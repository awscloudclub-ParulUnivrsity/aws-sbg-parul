-- ============================================================
-- FINAL FIX - Google OAuth Profile Creation
-- Copy and run this ENTIRE block in Supabase SQL Editor
-- ============================================================

-- 1. Add password_set column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_set boolean DEFAULT true;

-- 2. Drop old trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create new trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, password_set, approved, role)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    false,
    false,
    'member'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = EXCLUDED.email;
  
  RETURN new;
END;
$$;

-- 4. Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Fix existing users without profiles
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

-- 6. Update existing profiles with encrypted_password to password_set = true
UPDATE public.profiles p
SET password_set = true
WHERE EXISTS (
  SELECT 1 FROM auth.users u 
  WHERE u.id = p.id 
  AND u.encrypted_password IS NOT NULL 
  AND u.encrypted_password != ''
)
AND p.password_set = false;
