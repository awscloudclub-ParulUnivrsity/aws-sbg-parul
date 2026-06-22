-- ============================================================
-- Add password_set field for Google OAuth users
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Add password_set column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_set boolean DEFAULT true;

-- Set existing users to have password_set = true (backward compatibility)
UPDATE public.profiles SET password_set = true WHERE password_set IS NULL;

-- For new Google OAuth users, set password_set = false in trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, password_set)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    -- If Google OAuth user, set password_set = false
    CASE 
      WHEN new.app_metadata->>'provider' = 'google' THEN false
      ELSE true
    END
  );
  RETURN new;
END;
$$;
