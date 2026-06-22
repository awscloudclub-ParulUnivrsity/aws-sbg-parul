-- ============================================================
-- PRODUCTION TRIGGER - Google OAuth Profile Creation
-- Run this complete block in Supabase SQL Editor
-- ============================================================

-- Clean up old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create production-ready trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
DECLARE
  user_name text;
  user_provider text;
BEGIN
  -- Extract user name from metadata
  user_name := COALESCE(
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'given_name',
    split_part(new.email, '@', 1),
    'User'
  );
  
  -- Detect provider (google vs email)
  user_provider := COALESCE(
    new.raw_app_meta_data->>'provider',
    'email'
  );
  
  -- Insert or update profile
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    password_set, 
    approved, 
    role,
    created_at
  )
  VALUES (
    new.id,
    user_name,
    new.email,
    CASE WHEN user_provider = 'google' THEN false ELSE true END,
    false,
    'member',
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = EXCLUDED.email,
    password_set = CASE 
      WHEN profiles.password_set = true THEN true 
      ELSE EXCLUDED.password_set 
    END;
  
  -- Log success
  RAISE LOG 'Profile created/updated for user: % (id: %, provider: %)', 
    new.email, new.id, user_provider;
  
  RETURN new;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth creation
    RAISE WARNING 'Failed to create profile for % (id: %): % %', 
      new.email, new.id, SQLERRM, SQLSTATE;
    RETURN new;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Fix existing users without profiles
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

-- Verify setup
DO $$
DECLARE
  trigger_count int;
  missing_profiles int;
BEGIN
  -- Check trigger exists
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers 
  WHERE trigger_name = 'on_auth_user_created';
  
  IF trigger_count = 0 THEN
    RAISE WARNING 'Trigger not created!';
  ELSE
    RAISE NOTICE 'Trigger successfully created';
  END IF;
  
  -- Check for users without profiles
  SELECT COUNT(*) INTO missing_profiles
  FROM auth.users u
  WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);
  
  IF missing_profiles > 0 THEN
    RAISE WARNING '% users found without profiles', missing_profiles;
  ELSE
    RAISE NOTICE 'All users have profiles';
  END IF;
END $$;
