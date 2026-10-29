import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { envConfig, isSupabaseConfigured } from "./config";

/**
 * Creates a server-side Supabase client for reading public data.
 * Does NOT access `cookies()`, allowing it to run safely during static generation,
 * `generateStaticParams`, and ISR prerendering without hanging promise errors.
 */
export function getSupabasePublicServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createServerClient<Database>(
    envConfig.supabaseUrl,
    envConfig.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

/**
 * Creates an authenticated server-side Supabase client with user cookies.
 * Used for session verification, user profiles, or authenticated actions.
 */
export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    return createServerClient<Database>(
      envConfig.supabaseUrl,
      envConfig.supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore in Server Components
            }
          },
        },
      }
    );
  } catch {
    // If called outside an HTTP request context (e.g. generateStaticParams),
    // fallback cleanly to the public client.
    return getSupabasePublicServerClient();
  }
}

/**
 * Creates a server-side client with the privileged service role key if available.
 * NEVER expose this to the client/browser!
 */
export function getSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isSupabaseConfigured() || !serviceRoleKey) {
    return null;
  }

  return createServerClient<Database>(envConfig.supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}
