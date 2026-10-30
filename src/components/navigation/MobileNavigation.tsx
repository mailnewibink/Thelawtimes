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

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "BERANDA", href: "/" },
    { label: "PERKARA & PUTUSAN", href: "/perkara" },
    { label: "PUBLIKASI PERKARA", href: "/publikasi-perkara" },
    {
      label: "LAYANAN HUKUM",
      href: "/layanan-hukum",
      isExpandable: true,
      subItems: LEGAL_SERVICE_SUBMENUS,
    },
    { label: "MEREK & HKI", href: "/merek-hki" },
    { label: "BERITA HUKUM", href: "/berita-hukum" },
    { label: "REGULASI", href: "/regulasi" },
    { label: "TENTANG KAMI", href: "/tentang-kami" },
  ];

  return (
    <div className="md:hidden select-none border-b border-ink my-1">
      <div className="flex items-center justify-between py-1.5 px-2 bg-paper-dark/30">
        <span className="font-sans font-bold text-xs tracking-widest uppercase text-ink">
          RUBRIK UTAMA
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Buka menu navigasi"
          className="kicker flex items-center gap-1.5 border border-ink px-2 py-0.5 text-xs text-ink hover:bg-ink hover:text-paper"
        >
          <span>{isOpen ? "TUTUP" : "MENU"}</span>
          <span aria-hidden="true">{isOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {isOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-rule bg-paper py-2">
          <ul className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              if (item.isExpandable) {
                return (
                  <li key={item.href} className="border-b border-rule/30 pb-1">
                    <div className="flex items-center justify-between px-3 py-2">
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "font-sans text-xs tracking-wider transition-colors",
                          isActive
                            ? "font-extrabold text-ink"
                            : "text-ink-muted hover:text-ink"
                        )}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setServicesExpanded(!servicesExpanded)}
                        className="p-1 text-ink-muted hover:text-ink"
                        aria-label="Buka sub-menu layanan hukum"
                      >
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform",
                            servicesExpanded && "rotate-180"
                          )}
                        />
                      </button>
                    </div>

                    {servicesExpanded && (
                      <ul className="pl-6 pr-3 py-1 space-y-1 bg-paper-dark/20 border-l-2 border-accent ml-3">
                        {item.subItems?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "block py-1 text-xs font-serif transition-colors",
                                  isSubActive
                                    ? "font-bold text-accent"
                                    : "text-ink-muted hover:text-ink"
                                )}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          );
                        })}
                        <li className="pt-1 border-t border-rule/30">
                          <Link
                            href="/konsultasi"
                            onClick={() => setIsOpen(false)}
                            className="block py-1 text-[0.68rem] font-sans font-bold kicker text-accent uppercase tracking-wider"
                          >
                            Formulir Konsultasi →
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-2 font-sans text-xs tracking-wider transition-colors",
                      isActive
                        ? "bg-paper-dark font-extrabold text-ink border-l-4 border-ink"
                        : "text-ink-muted hover:text-ink hover:bg-paper-dark/50"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
