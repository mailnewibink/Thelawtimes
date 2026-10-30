"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Rss,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

interface AdminSidebarProps {
  userRole?: UserRole;
  className?: string;
  onNavigate?: () => void;
}

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  // Exactly 4 requested menus: Dashboard, Articles, External Sources, Settings
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Articles", href: "/admin/articles", icon: FileText },
    { label: "External Sources", href: "/admin/sources", icon: Rss },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className={cn("w-64 bg-paper-dark/40 border-r border-rule flex flex-col justify-between p-4", className)}>
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="border-b border-rule pb-3">
          <Link href="/admin" className="block" onClick={onNavigate}>
            <span className="font-blackletter text-2xl text-ink">The Law Times</span>
            <span className="block kicker text-[0.625rem] text-ink-muted mt-0.5">Admin & News CMS</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Admin Navigation" className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-xs font-sans tracking-wide transition-colors",
                  isActive
                    ? "bg-ink text-paper font-semibold shadow-xs"
                    : "text-ink-soft hover:bg-paper-dark hover:text-ink"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public website */}
      <div className="pt-4 border-t border-rule text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Lihat Website Publik</span>
        </Link>
      </div>
    </aside>
  );
}
