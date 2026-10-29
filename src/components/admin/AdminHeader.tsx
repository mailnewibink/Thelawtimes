"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AdminSidebar } from "./AdminSidebar";
import type { AdminUser } from "@/lib/admin/auth";

interface AdminHeaderProps {
  user: AdminUser | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <header className="h-14 bg-paper-light border-b border-rule flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open sidebar menu"
            className="md:hidden p-1.5 text-ink hover:bg-paper-dark"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <span className="kicker text-[0.625rem] text-ink-muted">Publishing Console</span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-paper-dark border border-rule flex items-center justify-center text-ink">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-ink leading-tight">
                {user?.fullName || user?.email || "Editor Session"}
              </p>
              <p className="meta text-[0.625rem] uppercase tracking-wider text-ink-muted">
                {user?.role || "Editor"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 border border-rule-soft px-2.5 py-1 text-xs font-sans text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex flex-col w-72 max-w-xs bg-paper h-full shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-rule">
              <span className="font-blackletter text-xl">The Law Times</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-ink hover:bg-paper-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminSidebar
              userRole={user?.role}
              className="w-full flex-1 border-r-0"
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
