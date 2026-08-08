import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  assertSupabaseEnv,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
} from "@/lib/supabase/env";

/**
 * Server-side Supabase client for Server Components, Server Actions and Route
 * Handlers. `cookies()` is async in Next 16, so this must be awaited.
 *
 * Server Components cannot write cookies. The `setAll` swallow below is the
 * documented pattern: session refresh happens in `proxy.ts`, which runs before
 * rendering and *can* write, so losing the write here is harmless.
 */
export async function createClient() {
  assertSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — proxy.ts already refreshed the session.
        }
      },
    },
  });
}
