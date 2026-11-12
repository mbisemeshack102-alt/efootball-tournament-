import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// KICKOFF WINS GIFTS Supabase project.
export const supabaseProjectUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  'https://mljecunjrfgicasyhwac.supabase.co';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// This reports local configuration only; it does not claim a live database check.
export const isSupabaseConfigured = Boolean(supabaseProjectUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseProjectUrl, supabasePublishableKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
