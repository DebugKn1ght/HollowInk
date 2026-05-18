import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnxrfggkrdjcknpocylj.supabase.co';
const supabaseAnonKey = 'sb_publishable_jj11TpYerkWzWQJSRJb4Nw_7-PqBuBP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
