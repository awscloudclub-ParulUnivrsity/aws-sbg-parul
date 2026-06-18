-- ============================================================
-- STORAGE SETUP FOR CERTIFICATION UPLOADS
-- Run this AFTER the main schema if not already done
-- ============================================================

-- Step 1: Create the certifications storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('certifications', 'certifications', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Set up storage policies
CREATE POLICY "Anyone can upload certification files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certifications');

CREATE POLICY "Public certification files are readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certifications');

CREATE POLICY "Leaders can delete certification files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'certifications' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'leader')
  );

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'certifications';

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%certification%';
