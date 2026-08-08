"use client";

import { createBrowserClient } from "@supabase/ssr";

import {
  assertSupabaseEnv,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
} from "@/lib/supabase/env";

/**
 * Browser-side Supabase client. `createBrowserClient` memoises internally, so
 * calling this from several components returns the same underlying client.
 */
export function createClient() {
  assertSupabaseEnv();
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
