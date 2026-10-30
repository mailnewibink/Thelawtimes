"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Masthead() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  const formattedDate =
    lang === "id"
      ? "JUMAT, 30 OKTOBER 2026"
      : "FRIDAY, OCTOBER 30, 2026";

  const editorialDesc =
    lang === "id"
      ? "Warta Hukum & Lembaran Pengumuman Resmi"
      : "The Broadsheet of Legal Records & Decisions";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/berita-hukum?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="pt-2 select-none">
      {/* 1. TOP UTILITY ROW: Date & Editorial Description (Left) | Links & Search (Right) */}
      <div className="flex flex-wrap items-center justify-between py-1.5 px-1 text-xs border-b border-ink/40 text-ink-muted">
        {/* Left: Publication Date & Short Description */}
        <div className="flex items-center gap-3">
          <time className="font-sans font-bold tracking-widest uppercase text-[0.68rem] text-ink">
            {formattedDate}
          </time>
          <span className="text-rule-soft hidden sm:inline" aria-hidden="true">|</span>
          <span className="font-serif italic text-[0.72rem] text-ink-muted hidden md:inline">
            {editorialDesc}
          </span>
        </div>

        {/* Right: Quick Links, Search & Language */}
        <div className="flex items-center gap-3">
          <nav aria-label="Utility Links" className="hidden sm:flex items-center gap-2.5 font-sans font-semibold tracking-wider text-[0.65rem] uppercase">
            <Link href="/tentang-kami" className="hover:text-ink transition-colors">
              Tentang Kami
            </Link>
            <span className="text-rule-soft" aria-hidden="true">·</span>
            <Link href="/contact" className="hover:text-ink transition-colors">
              Kontak
            </Link>
            <span className="text-rule-soft" aria-hidden="true">·</span>
            <Link href="/perkara" className="hover:text-ink transition-colors">
              Arsip
            </Link>
          </nav>

          <span className="text-rule-soft hidden sm:inline" aria-hidden="true">|</span>

          {/* Search trigger / input */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita atau perkara..."
                  className="w-36 sm:w-48 text-[0.7rem] px-2 py-0.5 border border-ink bg-paper text-ink focus:outline-hidden font-serif"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setShowSearchInput(false);
                  }}
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearchInput(true)}
                className="flex items-center gap-1 text-[0.68rem] kicker text-ink hover:text-accent font-bold transition-colors"
                aria-label="Cari artikel"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cari</span>
              </button>
            )}
          </div>

          <span className="text-rule-soft" aria-hidden="true">|</span>
          <LanguageToggle />
        </div>
      </div>

      {/* 2. DOUBLE HORIZONTAL RULE */}
      <div className="pt-1.5 pb-2">
        <PaperDivider variant="double" />
      </div>

      {/* 3. CENTERED BLACKLETTER LOGO WITH SUBTLE ENGRAVING COURTHOUSE */}
      <div className="relative py-2 sm:py-3 text-center flex flex-col items-center justify-center">
        {/* Subtle architectural & judicial emblem left & right */}
        <div className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-2 opacity-85 pointer-events-none">
          <div className="relative w-16 h-12 border border-rule/50 bg-paper-dark/30 p-0.5 overflow-hidden">
            <Image
              src="/images/photos/supreme-court.jpg"
              alt="Gedung Pengadilan Mahkamah Agung"
              fill
              className="object-cover"
              sizes="64px"
              loading="eager"
            />
          </div>
          <div className="text-left font-serif text-[0.58rem] text-ink-muted leading-tight border-l border-rule/40 pl-1.5 max-w-[90px]">
            <span>Justitia & Veritas</span>
            <span className="block italic text-[0.52rem] text-ink-muted/80">Ed. 2026</span>
          </div>
        </div>

        <div className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 items-center gap-2 opacity-85 pointer-events-none">
          <div className="text-right font-serif text-[0.58rem] text-ink-muted leading-tight border-r border-rule/40 pr-1.5 max-w-[90px]">
            <span>Lex Superior</span>
            <span className="block italic text-[0.52rem] text-ink-muted/80">Jakarta RI</span>
          </div>
          <div className="relative w-16 h-12 border border-rule/50 bg-paper-dark/30 p-0.5 overflow-hidden">
            <Image
              src="/images/photos/courtroom-gavel.jpg"
              alt="Palu Peradilan dan Hukum"
              fill
              className="object-cover"
              sizes="64px"
              loading="eager"
            />
          </div>
        </div>

        {/* The Law Times Main Title */}
        <h1 className="font-blackletter text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-ink font-normal my-0 leading-[1.02]">
          <Link href="/" className="hover:opacity-95 transition-opacity">
            {siteConfig.name}
          </Link>
        </h1>

        <p className="font-serif italic text-xs sm:text-sm text-ink-muted mt-1 tracking-wide">
          Lembaran Pengumuman Hukum Resmi & Dokumentasi Peradilan Indonesia
        </p>
      </div>

      {/* 4. REFERENCE BANNER: JAKARTA * PENGUMUMAN * DATE */}
      <div className="mt-1 border-y-2 border-ink py-1.5 px-2 bg-paper-dark/20 text-center font-sans font-bold text-xs sm:text-sm tracking-wider text-ink flex items-center justify-between">
        <div className="w-1/4 text-left tracking-[0.2em] uppercase font-bold text-[0.7rem] sm:text-xs">
          JAKARTA
        </div>
        <div className="w-2/4 text-center flex items-center justify-center gap-2 sm:gap-3 uppercase font-extrabold tracking-[0.18em] text-[0.7rem] sm:text-xs">
          <span aria-hidden="true" className="text-sm">✱</span>
          <span>PENGUMUMAN & WARTA HUKUM</span>
          <span aria-hidden="true" className="text-sm">✱</span>
        </div>
        <div className="w-1/4 text-right tracking-[0.16em] uppercase font-bold text-[0.68rem] sm:text-xs">
          <time dateTime="2026-10-30">30 OKTOBER 2026</time>
        </div>
      </div>

      {/* Double hairline rule beneath banner */}
      <div className="pt-1">
        <PaperDivider variant="double" />
      </div>
    </header>
  );
}
