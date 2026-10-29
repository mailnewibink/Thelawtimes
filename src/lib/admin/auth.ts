import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export interface AdminUser {
  id: string;
  email: string | null;
  fullName: string | null;
  role: UserRole;
  isActive: boolean;
}

/**
 * Validates the current session on the server and retrieves user profile & role.
 * Returns null if not logged in or inactive.
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return null;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Fetch user profile from public.profiles
    const { data: profileData, error: profileError } = await (supabase as any)
      .from("profiles")
      .select("id, full_name, role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    const profile = profileData as { full_name: string | null; role: UserRole; is_active: boolean } | null;

    if (profileError || !profile || !profile.is_active) {
      return null;
    }

    return {
      id: user.id,
      email: user.email ?? null,
      fullName: profile.full_name,
      role: profile.role,
      isActive: profile.is_active,
    };
  } catch (err) {
    console.error("[Auth] Error resolving current admin user:", err);
    return null;
  }
}

/**
 * Checks if user has minimum required role.
 * Hierarchy: reader (0) < author (1) < editor (2) < admin (3)
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const levels: Record<UserRole, number> = {
    reader: 0,
    author: 1,
    editor: 2,
    admin: 3,
  };
  return levels[userRole] >= levels[requiredRole];
}
