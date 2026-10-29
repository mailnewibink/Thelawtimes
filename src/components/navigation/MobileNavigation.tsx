"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden select-none border-b border-rule">
      <div className="flex items-center justify-between py-2 px-1">
        <span className="kicker text-xs text-ink-muted">Sections</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="kicker flex items-center gap-1.5 border border-ink px-2.5 py-1 text-xs text-ink hover:bg-ink hover:text-paper"
        >
          <span>{isOpen ? "Close" : "Menu"}</span>
          <span aria-hidden="true">{isOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {isOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-rule-soft bg-paper-light py-2">
          <ul className="flex flex-col space-y-1">
            {primaryNavigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-2 kicker text-xs transition-colors",
                      isActive
                        ? "bg-paper-dark font-bold text-ink border-l-4 border-ink"
                        : "text-ink-muted hover:text-ink hover:bg-paper"
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
