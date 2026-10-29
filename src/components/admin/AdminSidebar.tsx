"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Briefcase,
  Scale,
  ShieldCheck,
  FolderOpen,
  ClipboardCheck,
  Tags,
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

export function AdminSidebar({ userRole = "editor", className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Articles & News", href: "/admin/articles", icon: FileText },
    { label: "Review Queue", href: "/admin/review", icon: ClipboardCheck },
    { label: "Sources & Pipeline", href: "/admin/sources", icon: Scale },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { label: "Case Archive", href: "/admin/cases", icon: Briefcase },
    { label: "Regulations", href: "/admin/regulations", icon: Scale },
    { label: "Intellectual Property", href: "/admin/intellectual-property", icon: ShieldCheck },
    { label: "Documents & Files", href: "/admin/documents", icon: FolderOpen },
    { label: "Categories", href: "/admin/categories", icon: Tags },
    { label: "Settings & System", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className={cn("w-64 bg-paper-dark/40 border-r border-rule flex flex-col justify-between p-4", className)}>
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="border-b border-rule pb-3">
          <Link href="/admin" className="block" onClick={onNavigate}>
            <span className="font-blackletter text-2xl text-ink">The Law Times</span>
            <span className="block kicker text-[0.625rem] text-ink-muted mt-0.5">Editorial CMS</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Admin Navigation" className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
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

      {/* Footer Info & Quick Link to Site */}
      <div className="border-t border-rule-soft pt-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs font-serif text-ink-muted hover:text-ink hover:underline p-1"
        >
          <span>View Public Broadsheet</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <div className="meta text-[0.625rem] text-ink-muted px-1">
          Role: <strong className="uppercase text-ink font-sans">{userRole}</strong>
        </div>
      </div>
    </aside>
  );
}
