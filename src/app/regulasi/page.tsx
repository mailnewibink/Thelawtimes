import { Metadata } from "next";
import { getRegulations, getArticles } from "@/lib/content";
import { CategoryHeader } from "@/components/editorial/CategoryHeader";
import { PaginatedRegulationListing } from "@/components/editorial/PaginatedRegulationListing";
import { CategorySidebar } from "@/components/editorial/CategorySidebar";
import { BookOpen, Scale, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pantauan Regulasi & Kebijakan — Lembaran Negara & Aturan Menteri | The Law Times",
  description:
    "Pelacakan undang-undang, peraturan pemerintah (PP), peraturan menteri (Permen), dan keputusan lembaga negara Republik Indonesia.",
};

export default async function RegulationsCategoryPage() {
  const [regulations, allArticles] = await Promise.all([
    getRegulations(),
    getArticles(),
  ]);

  // Featured regulation lead
  const featuredReg = regulations[0];
  const listRegulations = regulations.slice(1);

  // Secondary sidebar articles regarding regulatory & business impact
  const sidebarSelected = allArticles.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Category Broadside Header */}
      <CategoryHeader
        kicker="RUBRIKASI REGULASI & KEBIJAKAN PEMERINTAH"
        title="REGULASI"
        editionInfo="LEMBARAN NEGARA & WARTA REGULASI REPUBLIK INDONESIA"
        description="Dokumentasi komparatif perkembangan undang-undang, ketetapan menteri, peraturan pemerintah, dan penegakan regulasi nasional."
        breadcrumbs={[
          { label: "Rubrikasi", href: "/" },
          { label: "Regulasi" },
        ]}
      />

      {/* Featured Regulation Lead Card (Newspaper Style) */}
      {featuredReg && (
        <section aria-label="Regulasi Utama">
          <div className="border-2 border-ink p-5 sm:p-6 bg-paper-light">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-ink pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-ink text-paper font-sans text-xs font-bold uppercase tracking-widest px-2 py-0.5">
                  FOKUS REGULASI TERBARU
                </span>
                <span className="font-sans text-xs font-semibold text-accent uppercase tracking-wider">
                  {featuredReg.type}
                </span>
              </div>
              <time className="font-sans text-xs text-ink-muted uppercase tracking-wider">
                {formatDate(featuredReg.publishedAt, "long")}
              </time>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug text-ink mb-3">
              {featuredReg.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-paper border border-rule p-3 text-xs mb-4 font-serif">
              <div>
                <span className="font-sans font-semibold text-ink-muted uppercase text-[0.625rem] block mb-0.5">
                  Nomor & Tahun Regulasi
                </span>
                <span className="font-bold text-ink">
                  {featuredReg.number ? `${featuredReg.number} (${featuredReg.year})` : "Dalam Proses Kodifikasi"}
                </span>
              </div>
              <div>
                <span className="font-sans font-semibold text-ink-muted uppercase text-[0.625rem] block mb-0.5">
                  Instansi Pemrakarsa
                </span>
                <span className="font-bold text-ink">
                  {featuredReg.issuingInstitution || "Pemerintah RI / Kementerian Terkait"}
                </span>
              </div>
              <div>
                <span className="font-sans font-semibold text-ink-muted uppercase text-[0.625rem] block mb-0.5">
                  Kekuatan Hukum
                </span>
                <span className="font-bold text-ink flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  {featuredReg.status || "Telah Diundangkan"}
                </span>
              </div>
            </div>

            <p className="font-serif text-sm sm:text-base text-ink-soft leading-relaxed mb-4">
              {featuredReg.summary}
            </p>

            <div className="pt-3 border-t border-rule flex items-center justify-between text-xs text-ink-muted">
              <span className="italic">
                Saluran Dokumentasi: {featuredReg.source.label}
              </span>
              <span className="font-sans font-semibold uppercase tracking-wider text-[0.6875rem] text-ink">
                Arsip Terintegrasi Lembaran Negara
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Quick Topic Strips */}
      <div className="border-y-2 border-ink py-2 bg-paper-light flex items-center justify-between text-xs px-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" />
          <span className="font-sans font-bold uppercase tracking-wider text-[0.6875rem] text-ink">
            Kategori Regulasi: Undang-Undang • Peraturan Pemerintah • Peraturan Menteri • Keputusan Badan
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans text-[0.625rem] uppercase tracking-wider text-ink-muted">
          <span>JDIH Terkoneksi</span>
          <span>•</span>
          <Link href="/regulation-watch" className="hover:underline text-ink font-semibold">
            Pencarian Detail Regulasi →
          </Link>
        </div>
      </div>

      {/* Main Grid: Regulation Listing + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Regulations Listing */}
        <section aria-label="Daftar Regulasi Terkini" className="lg:col-span-8 space-y-6">
          <div className="border-b-2 border-ink pb-1 flex items-center justify-between">
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-accent" />
              <span>Daftar Regulasi & Kebijakan Terbitan Terbaru</span>
            </h2>
            <span className="font-sans text-[0.625rem] text-ink-muted uppercase tracking-widest">
              Total {regulations.length} Regulasi
            </span>
          </div>

          <PaginatedRegulationListing
            regulations={listRegulations}
            itemsPerPage={5}
          />
        </section>

        {/* Right Column: Secondary Sidebar */}
        <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-6">
          <CategorySidebar
            title="WARTA HUKUM TERKAIT KEBIJAKAN"
            selectedStories={sidebarSelected}
            clientSupportNotice={true}
          />
        </div>
      </div>
    </div>
  );
}
