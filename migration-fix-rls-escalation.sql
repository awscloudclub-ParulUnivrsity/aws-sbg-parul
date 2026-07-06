-- ============================================================
-- SECURITY HOTFIX: Prevent Privilege Escalation in profiles
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Step 1: Create trigger function to validate profile updates
CREATE OR REPLACE FUNCTION public.check_profile_update()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Prevent modifying the primary key ID
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Access Denied: Modifying user ID is prohibited.';
  END IF;

  -- 2. Prevent modifying email directly (must sync with auth.users via Supabase Auth)
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Access Denied: Email updates must be managed via Supabase Auth.';
  END IF;

  -- 3. Restrict modifications to role and approved status
  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.approved IS DISTINCT FROM OLD.approved) THEN
    -- Check if the current executing user (auth.uid()) is a leader
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'leader'
    ) THEN
      RAISE EXCEPTION 'Access Denied: You do not have permission to modify role or approval status.';
    END IF;
    
    -- Prevent leaders from demoting themselves or revoking their own approval status
    IF OLD.id = auth.uid() AND (NEW.role != 'leader' OR NEW.approved = false) THEN
      RAISE EXCEPTION 'Access Denied: Leaders cannot demote themselves or revoke their own approval status.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Step 2: Bind trigger to the profiles table
DROP TRIGGER IF EXISTS tr_before_profile_update ON public.profiles;
CREATE TRIGGER tr_before_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_update();

-- Step 3: Fix the broken public certification verification RLS Policy
-- Drop the restrictive select policy
DROP POLICY IF EXISTS "Leader and social media can read certs" ON public.certifications;

-- Create policy allowing anyone to verify approved certifications
CREATE POLICY "Anyone can select approved certifications"
  ON public.certifications FOR SELECT
  USING (status = 'approved');

-- Create policy allowing leaders and social media to select all certifications (including pending/rejected)
CREATE POLICY "Leaders and staff can select all certifications"
  ON public.certifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('leader', 'social_media')
    )
  );
