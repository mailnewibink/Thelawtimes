import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Scale, FileText, Building2, HelpCircle } from "lucide-react";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { LEGAL_SERVICES } from "@/data/legal-services";

const ICONS: Record<string, any> = {
  "pendaftaran-merek": ShieldCheck,
  "kekayaan-intelektual": Scale,
  "perizinan-bpom": FileText,
  "pendampingan-hukum": Scale,
  "legalitas-usaha": Building2,
};

export function HomepageLegalServicesSection() {
  return (
    <section className="my-8 pt-4 border-t-2 border-ink" aria-label="Layanan Hukum The Law Times">
      {/* Editorial Section Header */}
      <div className="border-b border-rule/60 pb-2 mb-4 flex items-center justify-between">
        <span className="font-mono text-[0.62rem] uppercase font-bold text-accent tracking-widest">
          SEKSI KHUSUS · THE LAW TIMES LEGAL SERVICES
        </span>
        <Link
          href="/layanan-hukum"
          className="font-sans text-[0.68rem] kicker text-ink hover:text-accent font-bold uppercase tracking-wider"
        >
          Lihat Semua Layanan →
        </Link>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-1 mb-6">
        <h3 className="font-serif font-black text-2xl sm:text-3xl text-ink uppercase tracking-tight">
          LAYANAN HUKUM THE LAW TIMES
        </h3>
        <p className="font-serif italic text-xs sm:text-sm text-ink-muted leading-relaxed">
          &ldquo;Temukan solusi untuk kebutuhan perlindungan merek, kekayaan intelektual, perizinan, dan pendampingan hukum.&rdquo;
        </p>
      </div>

      {/* 5 Column Vintage Newspaper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 border-y border-rule py-4">
        {LEGAL_SERVICES.map((item, idx) => {
          const Icon = ICONS[item.key] || ShieldCheck;
          return (
            <div
              key={item.slug}
              className={`p-3.5 flex flex-col justify-between space-y-3 bg-paper hover:bg-paper-dark/20 transition-colors ${
                idx > 0 ? "border-t sm:border-t-0 sm:border-l border-rule/50" : ""
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] uppercase text-accent font-bold">
                    0{idx + 1}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-ink-muted" />
                </div>

                <h4 className="font-serif font-bold text-sm text-ink leading-snug">
                  <Link
                    href={`/layanan-hukum/${item.slug}`}
                    className="hover:underline hover:text-accent transition-colors"
                  >
                    {item.title}
                  </Link>
                </h4>

                <p className="font-serif text-[0.72rem] text-ink-muted leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-rule/40 space-y-1.5">
                <Link
                  href={`/layanan-hukum/${item.slug}`}
                  className="font-sans text-[0.65rem] font-bold kicker text-ink hover:text-accent flex items-center justify-between uppercase tracking-wider"
                >
                  <span>Pelajari</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href={`/konsultasi?service=${encodeURIComponent(item.title)}`}
                  className="block text-center font-sans text-[0.62rem] font-bold kicker bg-ink/90 text-paper py-1 px-2 uppercase tracking-wider hover:bg-accent transition-colors"
                >
                  Konsultasi
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <PaperDivider variant="hairline" />
      </div>
    </section>
  );
}
