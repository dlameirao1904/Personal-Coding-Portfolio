import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
/** Painel Supabase: "anon" (legacy) ou "publishable" (UI recente) — o mesmo papel no cliente. */
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Define VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env',
    )
  }
  return supabase
}
