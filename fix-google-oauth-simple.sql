-- ============================================================
-- Simple Google OAuth Fix - Without Provider Check
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create simple function - all new users get password_set = false by default
-- They can set password after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Insert profile for new user
  INSERT INTO public.profiles (id, name, email, password_set)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    false  -- All users need to set password (or already have one from email signup)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix existing users without profiles
INSERT INTO public.profiles (id, name, email, password_set)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'name',
    u.raw_user_meta_data->>'full_name',
    split_part(u.email, '@', 1)
  ),
  u.email,
  false
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Now manually update existing email/password users to password_set = true
-- This query updates only users who signed up with email/password (not Google)
UPDATE public.profiles
SET password_set = true
WHERE id IN (
  SELECT p.id FROM public.profiles p
  JOIN auth.users u ON p.id = u.id
  WHERE u.encrypted_password IS NOT NULL 
  AND u.encrypted_password != ''
);
