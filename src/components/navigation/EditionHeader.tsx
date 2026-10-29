"use client";

import { siteConfig } from "@/lib/site-config";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function EditionHeader() {
  const { lang, t } = useLanguage();

  const dateFormatted =
    lang === "id" ? "29 OKTOBER 2026" : "29 OCTOBER 2026";

  return (
    <div className="select-none">
      {/* Visual reference banner: JAKARTA * PENGUMUMAN / EDITION * DATE */}
      <div className="flex items-center justify-between py-2 sm:py-2.5 px-2 font-sans font-bold text-xs sm:text-sm tracking-wider text-ink">
        <div className="w-1/3 text-left tracking-[0.18em]">
          {siteConfig.location.toUpperCase()}
        </div>
        <div className="w-1/3 text-center flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-extrabold tracking-[0.16em]">
          <span aria-hidden="true" className="text-sm sm:text-base">✱</span>
          <span>{t("editionTitle")}</span>
          <span aria-hidden="true" className="text-sm sm:text-base">✱</span>
        </div>
        <div className="w-1/3 text-right tracking-[0.14em]">
          <time dateTime="2026-10-29">{dateFormatted}</time>
        </div>
      </div>
      <PaperDivider variant="double" />
    </div>
  );
}
