import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, ShieldCheck, FileCheck, HelpCircle } from "lucide-react";
import { PaperDivider } from "@/components/ui/PaperDivider";
import type { LegalServiceItem } from "@/data/legal-services";

interface LegalServiceDetailTemplateProps {
  service: LegalServiceItem;
}

export function LegalServiceDetailTemplate({ service }: LegalServiceDetailTemplateProps) {
  return (
    <article className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* 1. BREADCRUMBS */}
      <nav aria-label="Breadcrumbs" className="text-xs font-sans text-ink-muted border-b border-rule/50 pb-2">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/layanan-hukum" className="hover:text-ink hover:underline">
              Layanan Hukum
            </Link>
          </li>
          <li>/</li>
          <li className="font-bold text-ink truncate">{service.title}</li>
        </ol>
      </nav>

      {/* 2. BROADSHEET HEADER */}
      <header className="space-y-3 border-b-2 border-ink pb-6">
        <div className="flex items-center justify-between text-[0.68rem] kicker text-accent font-bold uppercase tracking-widest border-b border-rule/60 pb-1.5">
          <span>{service.categoryName}</span>
          <span>THE LAW TIMES LEGAL DESK</span>
        </div>

        <h1 className="font-serif font-black text-3xl sm:text-4xl text-ink leading-tight uppercase">
          {service.headline}
        </h1>

        <p className="font-serif italic text-base sm:text-lg text-ink-soft leading-relaxed">
          &ldquo;{service.tagline}&rdquo;
        </p>

        <div className="pt-2">
          <PaperDivider variant="double" />
        </div>
      </header>

      {/* 3. HERO IMAGE & QUICK FACTS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-7 space-y-3">
          <div className="relative w-full h-64 sm:h-72 border-2 border-ink overflow-hidden bg-paper-dark">
            <Image
              src={service.imageSrc}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 60vw, 100vw"
              priority
            />
          </div>
          <div className="flex items-center justify-between text-[0.625rem] font-sans text-ink-muted px-1">
            <span>Foto Sumber: {service.imageCredit}</span>
            <span>Gambar hanya ilustrasi</span>
          </div>
        </div>

        {/* Quick Summary Card */}
        <div className="md:col-span-5 border-2 border-ink bg-paper-dark/30 p-5 space-y-4">
          <div className="border-b border-ink/60 pb-2">
            <span className="font-sans font-bold text-xs uppercase kicker text-ink block">
              Ringkasan Layanan
            </span>
            <span className="font-serif italic text-[0.72rem] text-ink-muted">
              Pendampingan Statutori & Konsultasi
            </span>
          </div>

          <p className="font-serif text-xs text-ink leading-relaxed">
            {service.description}
          </p>

          <div className="pt-2 border-t border-rule">
            <Link
              href={`/konsultasi?service=${encodeURIComponent(service.title)}`}
              className="w-full text-center block font-sans font-bold text-xs uppercase tracking-wider bg-ink text-paper py-2.5 px-4 hover:bg-accent hover:text-white transition-colors shadow-xs"
            >
              Ajukan Konsultasi Sekarang →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. LONG EDITORIAL DESCRIPTIONS */}
      <section className="space-y-4 font-serif text-sm sm:text-base text-ink leading-relaxed border-t border-rule pt-6">
        {service.longDescription.map((p, idx) => (
          <p key={idx} className="text-justify sm:text-left">
            {p}
          </p>
        ))}
      </section>

      {/* 5. SCOPES (CAKUPAN LAYANAN) */}
      <section className="border-2 border-ink bg-paper p-6 space-y-4">
        <div className="border-b border-ink pb-2 flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-ink uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span>Cakupan & Lingkup Layanan</span>
          </h2>
          <span className="font-mono text-xs text-ink-muted">{service.scopes.length} Butir Teknis</span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {service.scopes.map((scope, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 p-2.5 border border-rule/60 bg-paper-dark/20 text-xs sm:text-sm font-serif text-ink"
            >
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{scope}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. PROCESS STEPS */}
      <section className="space-y-4 border-t border-rule pt-6">
        <h2 className="font-serif font-bold text-lg sm:text-xl text-ink uppercase tracking-wide">
          Alur & Prosedur Pendampingan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.processSteps.map((step, idx) => (
            <div key={idx} className="border border-ink/40 p-4 bg-paper space-y-1.5">
              <h3 className="font-sans font-bold text-xs uppercase kicker text-accent">
                {step.title}
              </h3>
              <p className="font-serif text-xs text-ink-muted leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. DELIVERABLES (OUTPUT LAYANAN) */}
      <section className="border border-rule bg-paper-dark/25 p-5 space-y-3">
        <h2 className="font-serif font-bold text-base text-ink uppercase tracking-wide flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-accent" />
          <span>Luaran & Dokumen Hasil (Deliverables)</span>
        </h2>
        <ul className="space-y-1.5 font-serif text-xs text-ink">
          {service.deliverables.map((deliv, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-accent font-bold">▪</span>
              <span>{deliv}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. EDITORIAL DISCLAIMER (MANDATORY ACCORDING TO PROMPT) */}
      <section className="border-l-4 border-accent bg-paper-dark/40 p-4 space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-sans font-bold kicker text-ink">
          <HelpCircle className="w-3.5 h-3.5 text-accent" />
          <span>BATASAN KEWENANGAN & STANDAR KEPATUHAN:</span>
        </div>
        <p className="font-serif italic text-ink-muted leading-relaxed">
          {service.disclaimer}
        </p>
      </section>

      {/* 9. BOTTOM ACTION CTA */}
      <div className="border-2 border-ink p-6 bg-paper flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="font-serif font-bold text-base text-ink block">
            Mulai Konsultasi {service.title}
          </span>
          <span className="font-serif italic text-xs text-ink-muted">
            Konsultasikan kebutuhan legal dan persyaratan dokumen Anda bersama tim kami.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/layanan-hukum"
            className="font-sans text-xs font-bold kicker border border-ink/40 px-3.5 py-2 uppercase tracking-wider text-ink hover:border-ink transition-colors"
          >
            ← Kembali
          </Link>
          <Link
            href={`/konsultasi?service=${encodeURIComponent(service.title)}`}
            className="font-sans text-xs font-bold kicker bg-accent text-white px-5 py-2 uppercase tracking-wider hover:bg-ink transition-colors shadow-xs"
          >
            Isi Formulir Konsultasi →
          </Link>
        </div>
      </div>
    </article>
  );
}
