import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Supabase project configuration for KICKOFF WINS GIFTS.
// Publishable keys are intended for client apps; never put a sb_secret key here.
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  'https://mljecunjrfgicasyhwac.supabase.co';
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  'sb_publishable_wEsKbJU1SvggtGJGPNeVew_uNquBwOI';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
