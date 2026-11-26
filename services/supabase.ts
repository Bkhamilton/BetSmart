import { createClient } from '@supabase/supabase-js';
import { authStorage } from '@/services/authStorage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;

// Local startup must not require a running backend. Share one client across
// providers and database synchronization to avoid duplicate auth sessions.
export const supabase = url && key
  ? createClient(url, key, {
      auth: {
        storage: authStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : undefined;
