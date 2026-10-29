"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function PrimaryNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigationItems = [
    { label: t("navFrontPage"), href: "/" },
    { label: t("navLegalNews"), href: "/legal-news" },
    { label: t("navAnnouncements"), href: "/announcements" },
    { label: t("navCaseArchive"), href: "/case-archive" },
    { label: t("navRegulationWatch"), href: "/regulation-watch" },
    { label: t("navIntellectualProperty"), href: "/intellectual-property" },
    { label: t("navAbout"), href: "/about" },
  ];

  return (
    <nav aria-label="Primary navigation" className="hidden md:block select-none">
      <ul className="flex items-center justify-between border-b border-rule py-2 px-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "kicker text-xs tracking-wider transition-colors py-1 px-1.5",
                  isActive
                    ? "font-extrabold text-ink border-b-2 border-ink"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
