import { Metadata } from "next";
import Link from "next/link";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { publicationServicesData } from "@/data/publication-services";
import { PublicationSubmissionForm } from "@/components/publication/PublicationSubmissionForm";
import {
  Scale,
  FileCheck2,
  BookOpen,
  ShieldCheck,
  Award,
  ArrowRight,
  ShieldAlert,
  FileText,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Publikasi Perkara — Layanan Publikasi Hukum Resmi & Dokumentasi Perkara | The Law Times",
  description:
    "The Law Times menyediakan ruang publikasi informasi perkara dan konten hukum untuk memperluas akses terhadap informasi hukum yang relevan, terstruktur, dan dapat dipertanggungjawabkan.",
};

const serviceIcons: Record<string, any> = {
  case_publication: Scale,
  ruling_publication: FileCheck2,
  legal_opinion: BookOpen,
  ip_publication: Award,
  sponsored_content: ShieldCheck,
};

export default function PublikasiPerkaraPage() {
  return (
    <div className="space-y-12">
      {/* ==================================================================== */}
      {/* 1. BROADSHEET BANNER & MASTHEAD SECTION                               */}
      {/* ==================================================================== */}
      <header className="text-center space-y-4 pt-2">
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs text-accent font-serif" aria-hidden="true">✱</span>
          <p className="kicker text-[0.6875rem] text-accent tracking-[0.24em] font-bold uppercase">
            Saluran Resmi Dokumentasi & Publikasi Perkara
          </p>
          <span className="text-xs text-accent font-serif" aria-hidden="true">✱</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-ink">
          PUBLIKASI PERKARA
        </h1>

        <PaperDivider variant="double" className="max-w-4xl mx-auto" />

        <div className="max-w-3xl mx-auto">
          <p className="font-serif text-lg sm:text-xl italic leading-relaxed text-ink font-medium">
            &ldquo;The Law Times menyediakan ruang publikasi informasi perkara dan konten hukum
            untuk memperluas akses terhadap informasi hukum yang relevan, terstruktur, dan dapat
            dipertanggungjawabkan.&rdquo;
          </p>
        </div>

        {/* Editorial Independence Notice */}
        <div className="border border-rule bg-paper-light max-w-3xl mx-auto p-4 text-xs font-serif text-ink-soft flex items-start gap-3 text-left">
          <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-ink uppercase tracking-wider text-[0.6875rem] kicker">
              Prinsip Penelaahan Redaksi Independen
            </p>
            <p className="leading-relaxed">
              The Law Times bukan merupakan kantor advokat (law firm) dan tidak memberikan nasihat
              hukum atau representasi litigasi. Setiap materi permohonan publikasi wajib melalui proses
              penelaahan dan verifikasi berkas oleh Dewan Redaksi sesuai dengan{" "}
              <Link href="/kebijakan-redaksi" className="underline font-bold text-ink hover:text-accent">
                Kebijakan Redaksi
              </Link>{" "}
              The Law Times.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <a
            href="#formulir-pengajuan"
            className="inline-flex items-center gap-2 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink px-6 py-2.5 text-xs font-sans font-bold tracking-[0.16em] uppercase transition-colors"
          >
            <span>Buka Formulir Pengajuan Publikasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. THE 5 PUBLICATION SERVICES DETAILED EXPOSITIONS                    */}
      {/* ==================================================================== */}
      <section aria-label="Rincian Layanan Publikasi Hukum" className="space-y-8">
        <div className="border-b-2 border-ink pb-2 flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink">
            Klasifikasi Layanan Publikasi Hukum
          </h2>
          <span className="kicker text-xs text-ink-muted">
            5 Bidang Layanan Dokumentasi
          </span>
        </div>

        <div className="space-y-8">
          {publicationServicesData.map((svc, index) => {
            const Icon = serviceIcons[svc.key] || Scale;
            return (
              <article
                key={svc.key}
                className="border border-ink bg-paper p-6 sm:p-8 space-y-6 relative overflow-hidden"
              >
                {/* Number index indicator */}
                <div className="flex items-start justify-between gap-4 border-b border-rule pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-paper-dark border border-rule text-ink">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <span className="kicker text-[0.625rem] text-accent font-bold uppercase tracking-[0.2em]">
                        Layanan #{String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-ink">
                        {svc.title}
                      </h3>
                      <p className="font-serif italic text-xs text-ink-muted">
                        {svc.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:block font-serif text-3xl font-bold text-rule-soft">
                    § 0{index + 1}
                  </span>
                </div>

                {/* Description */}
                <p className="font-serif text-sm sm:text-base leading-relaxed text-ink-soft">
                  {svc.description}
                </p>

                {/* 3 Column Grid for Content, Process, and Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-serif text-xs">
                  {/* Intended Content */}
                  <div className="border border-rule bg-paper-light p-4 space-y-2">
                    <h4 className="kicker uppercase font-bold text-[0.6875rem] text-ink border-b border-rule pb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>Cakupan Materi & Konten</span>
                    </h4>
                    <ul className="space-y-1.5 text-ink-soft leading-relaxed">
                      {svc.intendedContent.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-accent font-bold">›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Publication Process */}
                  <div className="border border-rule bg-paper-light p-4 space-y-2">
                    <h4 className="kicker uppercase font-bold text-[0.6875rem] text-ink border-b border-rule pb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span>Tahapan Proses Penerbitan</span>
                    </h4>
                    <ul className="space-y-1.5 text-ink-soft leading-relaxed">
                      {svc.publicationProcess.map((step, i) => (
                        <li key={i} className="text-ink-soft">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Editorial Requirements */}
                  <div className="border border-rule bg-paper-light p-4 space-y-2">
                    <h4 className="kicker uppercase font-bold text-[0.6875rem] text-ink border-b border-rule pb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span>Persyaratan Berkas & Redaksi</span>
                    </h4>
                    <ul className="space-y-1.5 text-ink-soft leading-relaxed">
                      {svc.editorialRequirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-ink font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. INTERACTIVE SUBMISSION FORM SECTION                                */}
      {/* ==================================================================== */}
      <section aria-label="Formulir Pengajuan Publikasi">
        <PublicationSubmissionForm />
      </section>

      {/* ==================================================================== */}
      {/* 4. EDITORIAL STANDARDS FOOTNOTE                                       */}
      {/* ==================================================================== */}
      <aside className="border-t-2 border-b-2 border-ink py-6 px-4 bg-paper-dark/20 text-center space-y-2">
        <h3 className="font-serif font-bold text-base text-ink">
          Komitmen Keterbukaan & Integritas Faktual
        </h3>
        <p className="font-serif text-xs text-ink-muted max-w-2xl mx-auto leading-relaxed">
          Seluruh warta publikasi perkara yang dimuat di The Law Times tunduk pada prinsip jurnalisme
          hukum berimbang (cover both sides), hak jawab pihak berperkara, dan rujukan dokumen peradilan
          otentik. Untuk pertanyaan khusus dewan redaksi, kunjungi{" "}
          <Link href="/contact" className="underline font-bold text-ink hover:text-accent">
            Halaman Kontak
          </Link>{" "}
          atau pelajari{" "}
          <Link href="/kebijakan-redaksi" className="underline font-bold text-ink hover:text-accent">
            Kebijakan Redaksi
          </Link>.
        </p>
      </aside>
    </div>
  );
}
