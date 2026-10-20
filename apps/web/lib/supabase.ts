import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export function getSupabase() {
  if (!supabase) {
    throw new Error('Авторизация не настроена. Заполните apps/web/.env.local.');
  }
  return supabase;
}
