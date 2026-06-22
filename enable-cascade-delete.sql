-- ============================================================
-- Enable Cascade Delete from auth.users to profiles
-- Run this in Supabase SQL Editor
-- ============================================================

-- Drop existing foreign key
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add new foreign key with CASCADE delete
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Now when you delete from auth.users, profile will auto-delete
-- Test: DELETE FROM auth.users WHERE id = 'some-user-id';
