import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ConsultationForm } from "@/components/services/ConsultationForm";
import { PaperDivider } from "@/components/ui/PaperDivider";

export const metadata: Metadata = {
  title: "Formulir Konsultasi Layanan Hukum — The Law Times",
  description:
    "Ajukan permohonan konsultasi resmi untuk pendaftaran merek, kekayaan intelektual, izin edar BPOM, legalitas usaha, dan pendampingan hukum bisnis.",
};

export default function KonsultasiPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <header className="border-b-2 border-ink pb-4 pt-2 text-center space-y-2">
        <div className="flex items-center justify-between text-[0.68rem] kicker text-ink-muted uppercase tracking-widest border-b border-rule/60 pb-1.5 mb-2">
          <span>THE LAW TIMES · LEGAL ADVISORY DESK</span>
          <span>JAKARTA, INDONESIA</span>
        </div>

        <span className="font-serif italic text-xs text-accent tracking-wide block">
          Layanan Resmi Konsultasi Klien & Korporasi
        </span>

        <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-ink uppercase tracking-tight">
          FORMULIR KONSULTASI HUKUM
        </h1>

        <p className="font-serif text-xs sm:text-sm text-ink-muted max-w-xl mx-auto leading-relaxed">
          Silakan lengkapi formulir di bawah ini untuk memulai sesi konsultasi terarah bersama tim spesialis hukum The Law Times. Kami akan menganalisis kebutuhan Anda dan memberikan rekomendasi langkah statutori terbaik.
        </p>

        <div className="pt-2">
          <PaperDivider variant="hairline" />
        </div>
      </header>

      {/* Form with Suspense for SearchParams */}
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs font-serif text-ink-muted border border-rule">
            Memuat formulir pendaftaran konsultasi...
          </div>
        }
      >
        <ConsultationForm />
      </Suspense>

      {/* Helpful Info Section */}
      <div className="border border-rule bg-paper-dark/20 p-4 text-xs font-serif text-ink-muted space-y-2">
        <span className="font-sans font-bold kicker text-ink block uppercase text-[0.68rem]">
          Pemberitahuan Kerahasiaan & Privasi:
        </span>
        <p className="leading-relaxed">
          Seluruh data pribadi, informasi brand, dan materi perkara yang Anda cantumkan pada formulir ini sepenuhnya dilindungi dalam kerangka kerahasiaan korespondensi hukum The Law Times. Data Anda tidak akan dibagikan atau dipublikasikan kepada pihak ketiga mana pun tanpa persetujuan tertulis eksplisit dari Anda.
        </p>
      </div>
    </div>
  );
}
