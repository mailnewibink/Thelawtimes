"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Masthead() {
  const { t } = useLanguage();

  return (
    <header className="pt-3 pb-2 sm:pt-5 sm:pb-3 text-center select-none">
      {/* Top micro bar with Language Toggle */}
      <div className="flex items-center justify-between meta text-[0.6875rem] sm:text-xs mb-3 px-1 text-ink-muted">
        <span className="font-serif italic hidden sm:inline">
          {t("broadsheetSubtitle")}
        </span>
        <span className="font-serif italic sm:hidden">
          {t("location")}
        </span>

        <span className="hidden sm:inline font-sans uppercase tracking-[0.2em] text-[0.625rem]">
          {t("digitalBroadsheet")}
        </span>

        <div className="flex items-center gap-3">
          <span className="font-serif italic hidden md:inline">{t("estYear")}</span>
          <LanguageToggle />
        </div>
      </div>

      <PaperDivider variant="double" className="mb-2" />

      {/* Main Masthead Title matching the visual reference */}
      <div className="py-1">
        <h1 className="font-blackletter text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-ink font-normal my-0 leading-[1.05]">
          <Link href="/" className="hover:opacity-95 transition-opacity">
            {siteConfig.name}
          </Link>
        </h1>
      </div>

      <PaperDivider variant="thick" className="mt-2" />
    </header>
  );
}
