"use client";

import React, { createContext, useContext, useState } from "react";

export type Language = "id" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Top bar & masthead
    broadsheetSubtitle: "Editorial Hukum & Dokumentasi Publik Indonesia",
    digitalBroadsheet: "Lembaran Berita Digital",
    estYear: "Didirikan 2026",
    editionTitle: "EDISI HUKUM & PENGUMUMAN",
    location: "JAKARTA",
    demoBannerTitle: "Edisi Demonstrasi",
    demoBannerDesc: "Seluruh konten merupakan materi sampel fiktif dan bukan informasi hukum resmi.",

    // Navigation
    navFrontPage: "Halaman Utama",
    navCasesClient: "Publikasi Perkara",
    navLegalNews: "Berita Hukum",
    navAnnouncements: "Pengumuman Resmi",
    navCaseArchive: "Arsip Perkara",
    navRegulationWatch: "Pantauan Regulasi",
    navIntellectualProperty: "Kekayaan Intelektual",
    navAbout: "Tentang Kami",
    sectionsMenu: "Rubrik",
    menuClose: "Tutup",
    menuOpen: "Menu",

    // Front page sections
    leadStoryLabel: "Berita Utama",
    continueReading: "Lanjutkan membaca",
    announcementsTitle: "Pengumuman Resmi",
    announcementsSubtitle: "Pemberitahuan publik, panggilan sidang & kepailitan",
    announcementsKicker: "Warta & Berkas",
    viewArchive: "Buka Arsip",
    latestNewsTitle: "Warta Hukum Terkini",
    latestNewsSubtitle: "Perkembangan di pengadilan, advokat & legislasi",
    latestNewsKicker: "Disposisi Redaksi",
    viewAllNews: "Semua Berita",
    regulationWatchTitle: "Pantauan Regulasi",
    regulationWatchSubtitle: "Pelacakan ketetapan pemerintah, keputusan menteri & RUU",
    regulationKicker: "Monitor Kebijakan",
    viewFullWatchlist: "Daftar Pantauan",
    ipTitle: "Kekayaan Intelektual",
    ipSubtitle: "Merek dagang, paten, hak cipta & desain industri",
    ipKicker: "Rubrik HKI & Komersial",
    viewIPSection: "Rubrik HKI",
    caseArchiveSectionTitle: "Arsip Dokumentasi Perkara & Pengadilan",
    caseArchiveSubtitle: "Dokumentasi terstruktur perkara perdata, niaga & tata usaha negara",
    caseArchiveKicker: "Daftar Sidang",
    exploreArchive: "Jelajahi Arsip",
    searchPrecedentsTitle: "Cari Preseden Hukum & Rekaman Sengketa",
    searchPrecedentsDesc: "Arsip ini menyediakan berkas perkara terstruktur mencakup ringkasan berkas, lini masa prosedural, dan dokumen pendukung.",
    openFullArchiveBtn: "Buka Arsip Perkara Lengkap",
    recentRecordsLabel: "Rekaman Arsip Terbaru",

    // Footer
    footerDesc: "Layanan dokumentasi independen dan pencatatan publik untuk urusan hukum Indonesia, pengumuman resmi, instrumen regulasi, dan risalah sidang.",
    editorialStandards: "Diterbitkan di Jakarta · Standar Editorial Broadsheet",
    editorialEthicsHeading: "Editorial & Etika",
    aboutTheLawTimes: "Tentang The Law Times",
    editorialPolicy: "Kebijakan Editorial",
    correctionsPolicy: "Kebijakan Koreksi",
    privacyPolicy: "Kebijakan Privasi",
    contactDesk: "Hubungi Redaksi",
    factualIntegrityHeading: "Pernyataan Integritas Faktual",
    factualIntegrityDesc: "The Law Times menjunjung tinggi standar verifikasi faktual dan keterbukaan informasi hukum terpercaya.",
    allRightsReserved: "Hak cipta dilindungi undang-undang.",
  },
  en: {
    // Top bar & masthead
    broadsheetSubtitle: "Indonesian Legal Editorial & Public Documentation",
    digitalBroadsheet: "Digital Broadsheet",
    estYear: "First Published 2026",
    editionTitle: "LEGAL NEWS & ANNOUNCEMENTS",
    location: "JAKARTA",
    demoBannerTitle: "Official Legal Edition",
    demoBannerDesc: "Official Indonesian legal news, statutory analysis, and verified judicial gazette.",

    // Navigation
    navFrontPage: "Front Page",
    navCasesClient: "Client Cases",
    navLegalNews: "Legal News",
    navAnnouncements: "Official Announcements",
    navCaseArchive: "Court & Case Archive",
    navRegulationWatch: "Regulation Watch",
    navIntellectualProperty: "Intellectual Property",
    navAbout: "About",
    sectionsMenu: "Sections",
    menuClose: "Close",
    menuOpen: "Menu",

    // Front page sections
    leadStoryLabel: "Lead Story",
    continueReading: "Continue reading story",
    announcementsTitle: "Official Announcements",
    announcementsSubtitle: "Public notices, court summons, and insolvency filings",
    announcementsKicker: "Gazette & Record",
    viewArchive: "View Archive",
    latestNewsTitle: "Latest Legal News",
    latestNewsSubtitle: "Developments in the courts, bar, and legislation",
    latestNewsKicker: "Editorial Dispatch",
    viewAllNews: "All News",
    regulationWatchTitle: "Regulation Watch",
    regulationWatchSubtitle: "Tracking governmental decrees, ministerial rulings & draft laws",
    regulationKicker: "Regulatory Monitor",
    viewFullWatchlist: "Full Watchlist",
    ipTitle: "Intellectual Property",
    ipSubtitle: "Trademarks, patents, copyright, and industrial designs",
    ipKicker: "IP & Commercial Desk",
    viewIPSection: "IP Section",
    caseArchiveSectionTitle: "Court & Case Documentation Archive",
    caseArchiveSubtitle: "Structured documentation of civil, commercial, and administrative disputes",
    caseArchiveKicker: "Judicial Docket",
    exploreArchive: "Explore Archive",
    searchPrecedentsTitle: "Search Legal Precedents & Dispute Records",
    searchPrecedentsDesc: "The archive provides structured case dockets including filing summaries, procedural timelines, and attached documentation.",
    openFullArchiveBtn: "Open Full Case Archive",
    recentRecordsLabel: "Recent Archive Records",

    // Footer
    footerDesc: "An independent editorial record and documentation service for Indonesian legal affairs, official announcements, regulatory instruments, and court notices.",
    editorialStandards: "Published in Jakarta · Broadsheet Editorial Standard",
    editorialEthicsHeading: "Editorial & Ethics",
    aboutTheLawTimes: "About The Law Times",
    editorialPolicy: "Editorial Policy",
    correctionsPolicy: "Corrections Policy",
    privacyPolicy: "Privacy Policy",
    contactDesk: "Contact Editorial Desk",
    factualIntegrityHeading: "Notice on Factual Integrity",
    factualIntegrityDesc: "The Law Times strictly adheres to factual verification standards. In Phase 1, all displayed records and articles are sample material intended to preview layout architecture.",
    allRightsReserved: "All rights reserved.",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "id",
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default Bahasa Indonesia (lazy initializer avoids setState in effect)
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("the-law-times-lang") as Language | null;
      if (saved === "id" || saved === "en") return saved;
    }
    return "id";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("the-law-times-lang", newLang);
    }
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.id[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
