import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Fallback project URL from existing database connection
const DEFAULT_SUPABASE_URL = 'https://xcoufxenbsafjcmsyyds.supabase.co';

export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string)?.trim() || DEFAULT_SUPABASE_URL;

export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim() || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes('your_supabase_anon_key')
);

/**
 * Singleton Supabase Client
 * Uses official client session persistence (persisted via localStorage by default).
 * Auto-refreshes tokens in the background.
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || 'dummy_anon_key_until_configured',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
