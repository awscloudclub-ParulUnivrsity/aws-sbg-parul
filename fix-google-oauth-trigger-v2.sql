-- ============================================================
-- Fix Google OAuth User Creation (CORRECTED)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function that properly handles Google OAuth
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
    -- Set password_set based on provider
    CASE 
      WHEN new.raw_app_meta_data->>'provider' = 'google' THEN false
      ELSE true
    END
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also handle existing Google OAuth users who might not have profiles
-- Run this once to fix any existing users
INSERT INTO public.profiles (id, name, email, password_set)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'name',
    u.raw_user_meta_data->>'full_name',
    split_part(u.email, '@', 1)
  ),
  u.email,
  CASE 
    WHEN u.raw_app_meta_data->>'provider' = 'google' THEN false
    ELSE true
  END
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;
