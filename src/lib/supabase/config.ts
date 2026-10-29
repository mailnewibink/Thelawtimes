/**
 * Environment configuration and Supabase availability validator.
 */

export const envConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

/**
 * Returns true if valid Supabase client environment variables are provided.
 */
export function isSupabaseConfigured(): boolean {
  return (
    typeof envConfig.supabaseUrl === "string" &&
    envConfig.supabaseUrl.trim().length > 0 &&
    typeof envConfig.supabaseAnonKey === "string" &&
    envConfig.supabaseAnonKey.trim().length > 0
  );
}
