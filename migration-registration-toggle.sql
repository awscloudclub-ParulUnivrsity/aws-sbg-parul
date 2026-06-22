-- ============================================================
-- Add registration toggle feature
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Create settings table for global configuration
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Settings readable by all"
  ON public.settings FOR SELECT USING (true);

-- Only leaders can update settings
CREATE POLICY "Leaders can update settings"
  ON public.settings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'leader')
  );

CREATE POLICY "Leaders can insert settings"
  ON public.settings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'leader')
  );

-- Insert default registration enabled setting
INSERT INTO public.settings (key, value)
VALUES ('registration_enabled', '{"enabled": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Function to check if registration is enabled
CREATE OR REPLACE FUNCTION public.is_registration_enabled()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE((value->>'enabled')::boolean, true)
  FROM public.settings
  WHERE key = 'registration_enabled';
$$;
