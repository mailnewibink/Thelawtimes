import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Shield, Scale, FileText, Building2, HelpCircle } from "lucide-react";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { LEGAL_SERVICES } from "@/data/legal-services";

export const metadata: Metadata = {
  title: "Layanan Hukum & Legal Services — The Law Times",
  description:
    "Solusi legalitas, perlindungan kekayaan intelektual, pendaftaran merek, perizinan produk BPOM, dan pendampingan hukum untuk bisnis dan individu.",
};

const SERVICE_ICONS: Record<string, any> = {
  "pendaftaran-merek": Shield,
  "kekayaan-intelektual": Scale,
  "perizinan-bpom": FileText,
  "pendampingan-hukum": Scale,
  "legalitas-usaha": Building2,
};

export default function LegalServicesOverviewPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* 1. EDITORIAL BROADSHEET HEADER */}
      <header className="border-b-2 border-ink pb-6 pt-2">
        <div className="flex items-center justify-between text-[0.68rem] kicker text-ink-muted uppercase tracking-widest border-b border-rule/60 pb-2 mb-4">
          <span>DEPARTEMEN LAYANAN HUKUM & KONSULTASI PROFESIONAL</span>
          <span>JAKARTA, REPUBLIK INDONESIA</span>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-serif italic text-sm text-accent tracking-wide">
            The Law Times Legal Advisory Desk
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight uppercase">
            LAYANAN HUKUM & LEGAL SERVICES
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-ink-soft leading-relaxed">
            &ldquo;Solusi Legalitas, Perlindungan, dan Pendampingan Hukum untuk Bisnis dan Individu.&rdquo;
          </p>
          <div className="pt-2">
            <PaperDivider variant="double" />
          </div>
          <p className="font-serif text-xs sm:text-sm text-ink-muted leading-relaxed text-justify sm:text-center pt-2">
            The Law Times menyediakan akses konsultasi dan pendampingan profesional dalam bidang perlindungan kekayaan intelektual, pendaftaran merek, perizinan produk, legalitas usaha, serta kebutuhan hukum lainnya dengan standar integritas redaksi dan kepatuhan regulasi statutori nasional.
          </p>
        </div>
      </header>

      {/* 2. SERVICES EDITORIAL GRID */}
      <section className="space-y-8" aria-label="Daftar Layanan Hukum">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEGAL_SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.key] || Shield;
            return (
              <article
                key={service.slug}
                className="border-2 border-ink bg-paper p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                {/* Vintage Section Index */}
                <div className="flex items-center justify-between border-b border-rule pb-2 mb-3">
                  <span className="font-mono text-[0.65rem] uppercase font-bold text-accent">
                    SEKSI {String(index + 1).padStart(2, "0")} · {service.categoryName}
                  </span>
                  <Icon className="w-4 h-4 text-ink-muted" />
                </div>

                {/* Visual Image Header */}
                <div className="relative w-full h-36 border border-rule/60 overflow-hidden mb-3 bg-paper-dark">
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute bottom-1 right-1 bg-ink/80 text-paper text-[0.55rem] px-1.5 py-0.5 font-sans">
                    {service.imageCredit}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2.5 flex-1">
                  <h2 className="font-serif font-bold text-xl text-ink leading-snug">
                    <Link
                      href={`/layanan-hukum/${service.slug}`}
                      className="hover:underline hover:text-accent transition-colors"
                    >
                      {service.title}
                    </Link>
                  </h2>

                  <p className="font-serif text-xs text-ink-soft leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="pt-2 border-t border-rule/50">
                    <span className="font-sans font-bold text-[0.62rem] kicker uppercase text-ink block mb-2">
                      Cakupan Layanan:
                    </span>
                    <ul className="space-y-1.5 font-serif text-[0.78rem] text-ink-muted">
                      {service.scopes.slice(0, 4).map((scope, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-accent mt-0.5" />
                          <span>{scope}</span>
                        </li>
                      ))}
                      {service.scopes.length > 4 && (
                        <li className="text-[0.72rem] italic text-ink-muted/80 pl-5">
                          + {service.scopes.length - 4} cakupan teknis lainnya...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-4 border-t-2 border-ink/40 flex items-center justify-between gap-2">
                  <Link
                    href={`/layanan-hukum/${service.slug}`}
                    className="font-sans text-[0.7rem] font-bold kicker text-ink hover:text-accent border border-ink/40 px-3 py-1.5 hover:border-ink transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>Pelajari Layanan</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <Link
                    href={`/konsultasi?service=${encodeURIComponent(service.title)}`}
                    className="font-sans text-[0.7rem] font-bold kicker bg-ink text-paper px-3.5 py-1.5 hover:bg-accent hover:text-white transition-colors uppercase tracking-wider shadow-xs"
                  >
                    Konsultasi →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. EDITORIAL INTEGRITY & CONSULTATION NOTICE */}
      <section className="border border-rule bg-paper-dark/30 p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-rule/60 pb-2">
          <HelpCircle className="w-4 h-4 text-accent" />
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-ink">
            Pedoman Standar & Batasan Kewenangan Layanan
          </h3>
        </div>
        <p className="font-serif text-xs text-ink-muted leading-relaxed">
          The Law Times merupakan media warta dan platform informasi hukum independen. Seluruh layanan pendampingan dan konsultasi diselenggarakan dalam kerangka bantuan penelaahan kepatuhan administratif, audit regulasi, dan perumusan dokumen legal oleh tim praktisi dan konsultan terdaftar. Penerbitan sertifikat, izin edar, atau status pengesahan badan hukum merupakan hak dan kewenangan diskresi mutlak lembaga pemerintah terkait (DJKI, BPOM, Kemenkumham, dan Kementerian Investasi/BKPM).
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="font-serif italic text-ink-soft">
            Membutuhkan pendampingan spesifik untuk perkara atau kebutuhan korporasi Anda?
          </span>
          <Link
            href="/konsultasi"
            className="font-sans font-bold kicker bg-accent text-white px-4 py-2 uppercase tracking-wider hover:bg-ink transition-colors shrink-0"
          >
            Mulai Konsultasi Resmi →
          </Link>
        </div>
      </section>
    </div>
  );
}
