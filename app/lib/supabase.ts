import { createClient } from "@supabase/supabase-js";
import { ENV_KEYS, DEFAULT_VALUES } from "@/app/constants";

const supabaseUrl =
  process.env[ENV_KEYS.SUPABASE.URL] || DEFAULT_VALUES.SUPABASE.URL;
const supabaseAnonKey =
  process.env[ENV_KEYS.SUPABASE.ANON_KEY] || DEFAULT_VALUES.SUPABASE.ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase URL or Anon Key. Check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}
