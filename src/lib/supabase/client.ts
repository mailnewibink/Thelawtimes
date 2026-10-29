import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { envConfig, isSupabaseConfigured } from "./config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or reuses a browser-safe Supabase client.
 * Returns null if Supabase environment variables are not configured.
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      envConfig.supabaseUrl,
      envConfig.supabaseAnonKey
    );
  }

  return browserClient;
}
