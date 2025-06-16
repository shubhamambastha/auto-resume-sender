// Configuration Constants

export const ENV_KEYS = {
  EMAIL: {
    HOST: "EMAIL_HOST",
    PORT: "EMAIL_PORT",
    SECURE: "EMAIL_SECURE",
    USER: "EMAIL_USER",
    PASS: "EMAIL_PASS",
  },
  SUPABASE: {
    URL: "NEXT_PUBLIC_SUPABASE_URL",
    ANON_KEY: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  },
} as const;

export const DEFAULT_VALUES = {
  EMAIL: {
    PORT: "587",
  },
  SUPABASE: {
    URL: "your-supabase-url",
    ANON_KEY: "your-supabase-anon-key",
  },
} as const;

export const TIMEOUTS = {
  FORM_SUBMISSION_DELAY: 1000, // milliseconds
} as const;
