"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LEGAL_SERVICE_SUBMENUS = [
  { label: "Pendaftaran Merek", href: "/layanan-hukum/pendaftaran-merek" },
  { label: "Kekayaan Intelektual", href: "/layanan-hukum/kekayaan-intelektual" },
  { label: "Perizinan BPOM", href: "/layanan-hukum/perizinan-bpom" },
  { label: "Pendampingan Hukum", href: "/layanan-hukum/pendampingan-hukum" },
  { label: "Legalitas Usaha", href: "/layanan-hukum/legalitas-usaha" },
];

export function PrimaryNavigation() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { label: "BERANDA", href: "/" },
    { label: "PERKARA & PUTUSAN", href: "/perkara" },
    { label: "PUBLIKASI PERKARA", href: "/publikasi-perkara" },
    {
      label: "LAYANAN HUKUM",
      href: "/layanan-hukum",
      hasDropdown: true,
      subItems: LEGAL_SERVICE_SUBMENUS,
    },
    { label: "MEREK & HKI", href: "/merek-hki" },
    { label: "BERITA HUKUM", href: "/berita-hukum" },
    { label: "REGULASI", href: "/regulasi" },
    { label: "TENTANG KAMI", href: "/tentang-kami" },
  ];

  return (
    <nav aria-label="Navigasi Surat Kabar" className="hidden md:block select-none my-1">
      <div className="border-y border-ink py-1.5 bg-paper px-1 lg:px-2">
        <ul className="flex items-center justify-between w-full flex-nowrap">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            if (item.hasDropdown) {
              return (
                <li
                  key={item.href}
                  className="relative flex items-center shrink-0 group"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "font-sans text-[0.66rem] lg:text-[0.72rem] xl:text-[0.78rem] tracking-[0.05em] lg:tracking-[0.1em] uppercase whitespace-nowrap transition-all py-1 px-1 lg:px-1.5 flex items-center gap-0.5",
                      isActive
                        ? "font-extrabold text-ink underline decoration-2 underline-offset-4"
                        : "font-semibold text-ink/80 hover:text-ink hover:underline decoration-1 underline-offset-4"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  {/* Vintage Newspaper Dropdown Menu */}
                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-0.5 w-60 bg-paper border-2 border-ink shadow-lg py-1.5 z-50 transition-all duration-150",
                      dropdownOpen
                        ? "opacity-100 visible translate-y-0 pointer-events-auto"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    )}
                  >
                    <div className="px-3 py-1 border-b border-rule/60 bg-paper-dark/30 mb-1">
                      <span className="font-serif italic text-[0.68rem] text-ink-muted block">
                        Layanan & Konsultasi Resmi
                      </span>
                    </div>

                    <ul className="space-y-0.5">
                      {item.subItems?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setDropdownOpen(false)}
                              className={cn(
                                "block px-3 py-1.5 font-serif text-xs leading-snug transition-colors",
                                isSubActive
                                  ? "bg-paper-dark font-bold text-accent border-l-2 border-accent pl-2.5"
                                  : "text-ink hover:bg-paper-dark/60 hover:text-accent"
                              )}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-1.5 pt-1.5 border-t border-rule/60 px-3 pb-0.5 flex items-center justify-between">
                      <Link
                        href="/layanan-hukum"
                        onClick={() => setDropdownOpen(false)}
                        className="font-sans text-[0.62rem] font-bold kicker text-accent hover:underline uppercase tracking-wider"
                      >
                        Semua Layanan →
                      </Link>
                      <Link
                        href="/konsultasi"
                        onClick={() => setDropdownOpen(false)}
                        className="font-sans text-[0.62rem] font-bold kicker text-ink hover:underline uppercase tracking-wider"
                      >
                        Konsultasi
                      </Link>
                    </div>
                  </div>

                  {index < navItems.length - 1 && (
                    <span
                      className="text-rule font-serif text-xs opacity-50 px-0.5 lg:px-1 select-none shrink-0"
                      aria-hidden="true"
                    >
                      |
                    </span>
                  )}
                </li>
              );
            }

            return (
              <li key={item.href} className="flex items-center shrink-0">
                <Link
                  href={item.href}
                  className={cn(
                    "font-sans text-[0.66rem] lg:text-[0.72rem] xl:text-[0.78rem] tracking-[0.05em] lg:tracking-[0.1em] uppercase whitespace-nowrap transition-all py-1 px-1 lg:px-1.5",
                    isActive
                      ? "font-extrabold text-ink underline decoration-2 underline-offset-4"
                      : "font-semibold text-ink/80 hover:text-ink hover:underline decoration-1 underline-offset-4"
                  )}
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <span
                    className="text-rule font-serif text-xs opacity-50 px-0.5 lg:px-1 select-none shrink-0"
                    aria-hidden="true"
                  >
                    |
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
