/**
 * Supabase connection details, read once and validated in one place so a
 * missing key fails with a clear message instead of a confusing 401 later.
 *
 * Supabase renamed the client-side key from "anon" to "publishable"; both names
 * are accepted here so either style of dashboard copy-paste works.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/**
 * True when the project has credentials. Public pages use this to fall back to
 * placeholder content instead of crashing during early development.
 */
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY,
);

export function assertSupabaseEnv() {
  if (!SUPABASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. Copy .env.local.example to .env.local and fill it in.",
    );
  }
  if (!SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) is not set. Copy .env.local.example to .env.local and fill it in.",
    );
  }
}

/** Storage bucket holding event photos. Must match supabase/schema.sql. */
export const EVENT_IMAGE_BUCKET = "event-images";
