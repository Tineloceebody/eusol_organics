import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://xdyxmhtshfbdwwlchauv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_RylFxa2RCC4jrRSGQlY0IQ_Ez-ijzjA';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return (
    !!supabaseUrl &&
    supabaseUrl !== 'https://placeholder-project.supabase.co' &&
    !!supabaseAnonKey &&
    supabaseAnonKey !== 'placeholder-anon-key'
  );
};
