import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// KICKOFF WINS GIFTS Supabase project URL.
// Keep the publishable key in a local .env file / EAS environment variable.
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  'https://mljecunjrfgicasyhwac.supabase.co';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
