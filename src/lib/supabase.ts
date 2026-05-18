import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pnxrfggkrdjcknpocylj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jj11TpYerkWzWQJSRJb4Nw_7-PqBuBP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
