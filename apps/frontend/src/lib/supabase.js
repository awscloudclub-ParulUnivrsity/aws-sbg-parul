import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
  try {
    return url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('your_supabase_url');
  } catch {
    return false;
  }
};

let supabaseInstance = null;

if (!isValidUrl(supabaseUrl) || !supabaseKey || supabaseKey.includes('your_supabase')) {
  console.warn('⚠️ Warning: Supabase environment variables are missing or placeholders. Supabase client will be disabled.');
} else {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

export const supabase = supabaseInstance;
