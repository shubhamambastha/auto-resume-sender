import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate that we have proper values (not just the default placeholders)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key. Check your .env file.");
}

// Additional validation to ensure the URL is properly formatted
if (
  supabaseUrl.includes("your-project-id") ||
  supabaseUrl === "your-supabase-url"
) {
  throw new Error(
    "Please update your NEXT_PUBLIC_SUPABASE_URL in .env with your actual Supabase project URL."
  );
}

if (supabaseAnonKey === "your-supabase-anon-key") {
  throw new Error(
    "Please update your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env with your actual Supabase anonymous key."
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
