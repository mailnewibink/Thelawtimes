"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "BERANDA", href: "/" },
    { label: "PERKARA & PUTUSAN", href: "/perkara" },
    { label: "PUBLIKASI PERKARA", href: "/publikasi-perkara" },
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
