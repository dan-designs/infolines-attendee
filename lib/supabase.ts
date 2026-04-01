// File: lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl ?? '', 
  supabaseAnonKey ?? '', 
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Architectural Handshake Check
// This logs to your terminal/debugger without affecting UI state.
(async () => {
  const { error } = await supabase.from('attendees').select('id').limit(1);
  if (error) {
    console.error(`[Supabase Handshake Failed]: ${error.message}`);
  } else {
    console.log("[Supabase Status]: Connection Verified. MVP Data Layer is Live.");
  }
})();