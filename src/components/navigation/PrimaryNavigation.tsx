"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function PrimaryNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigationItems = [
    { label: t("navFrontPage") || "Halaman Utama", href: "/" },
    { label: t("navCasesClient") || "Publikasi Perkara", href: "/perkara" },
    { label: t("navLegalNews") || "Berita Hukum", href: "/berita-hukum" },
    { label: t("navIntellectualProperty") || "Merek & HKI", href: "/merek-hki" },
    { label: t("navRegulationWatch") || "Regulasi", href: "/regulasi" },
    { label: t("navAbout") || "Tentang Kami", href: "/tentang-kami" },
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
