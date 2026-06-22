-- ============================================================
-- VERIFY AND FIX TRIGGER - Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Check if trigger exists
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Step 2: Check if function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Step 3: Drop and recreate everything
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 4: Create function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  user_name text;
BEGIN
  -- Get name from metadata
  user_name := COALESCE(
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );
  
  -- Insert profile
  INSERT INTO public.profiles (id, name, email, password_set, approved, role)
  VALUES (
    new.id,
    user_name,
    new.email,
    false,
    false,
    'member'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = EXCLUDED.email,
    password_set = COALESCE(profiles.password_set, false);
  
  -- Log success
  RAISE NOTICE 'Profile created for user: % (id: %)', new.email, new.id;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the trigger
    RAISE WARNING 'Failed to create profile for %: %', new.email, SQLERRM;
    RETURN new;
END;
$$;

-- Step 5: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Fix any existing users without profiles
INSERT INTO public.profiles (id, name, email, password_set, approved, role)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'name',
    u.raw_user_meta_data->>'full_name',
    split_part(u.email, '@', 1)
  ),
  u.email,
  CASE 
    WHEN u.encrypted_password IS NOT NULL AND u.encrypted_password != '' THEN true
    ELSE false
  END,
  false,
  'member'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Step 7: Verify trigger is active
SELECT 
  t.trigger_name,
  t.event_manipulation,
  t.action_timing,
  p.proname as function_name
FROM information_schema.triggers t
JOIN pg_proc p ON p.proname = 'handle_new_user'
WHERE t.trigger_name = 'on_auth_user_created';

-- Should return 1 row showing AFTER INSERT trigger with handle_new_user function
