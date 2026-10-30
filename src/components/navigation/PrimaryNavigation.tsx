"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PrimaryNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: "BERANDA", href: "/" },
    { label: "PERKARA & PUTUSAN", href: "/perkara" },
    { label: "MEREK & HKI", href: "/merek-hki" },
    { label: "BERITA HUKUM", href: "/berita-hukum" },
    { label: "REGULASI", href: "/regulasi" },
    { label: "TENTANG KAMI", href: "/tentang-kami" },
  ];

  return (
    <nav aria-label="Navigasi Surat Kabar" className="hidden md:block select-none my-1">
      <div className="border-y border-ink py-1.5 bg-paper">
        <ul className="flex items-center justify-center gap-1 sm:gap-4 md:gap-6 flex-wrap">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <li key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  className={cn(
                    "font-sans text-xs tracking-[0.14em] uppercase transition-all py-1 px-2",
                    isActive
                      ? "font-extrabold text-ink underline decoration-2 underline-offset-4"
                      : "font-semibold text-ink/80 hover:text-ink hover:underline decoration-1 underline-offset-4"
                  )}
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <span className="text-rule font-serif text-sm opacity-60 ml-1 sm:ml-4 md:ml-6" aria-hidden="true">
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
