"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={cn(
        "inline-flex items-center border border-ink bg-paper text-xs select-none p-0.5",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLang("id")}
        className={cn(
          "px-2 py-0.5 font-sans kicker text-[0.625rem] tracking-wider transition-colors",
          lang === "id"
            ? "bg-ink text-paper font-bold"
            : "text-ink hover:bg-paper-dark"
        )}
      >
        ID
      </button>
      <span aria-hidden="true" className="text-rule-soft px-0.5">|</span>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "px-2 py-0.5 font-sans kicker text-[0.625rem] tracking-wider transition-colors",
          lang === "en"
            ? "bg-ink text-paper font-bold"
            : "text-ink hover:bg-paper-dark"
        )}
      >
        EN
      </button>
    </div>
  );
}
