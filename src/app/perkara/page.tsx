import { Metadata } from "next";
import {
  getClientPublications,
  getAnnouncements,
  getCases,
  getArticles,
  getExternalNews,
} from "@/lib/content";
import { CategoryHeader } from "@/components/editorial/CategoryHeader";
import { CategoryFeaturedLead } from "@/components/editorial/CategoryFeaturedLead";
import { PaginatedArticleListing } from "@/components/editorial/PaginatedArticleListing";
import { CategorySidebar } from "@/components/editorial/CategorySidebar";
import { ExternalNewsSection } from "@/components/editorial/ExternalNewsSection";
import { PublicationCtaBox } from "@/components/editorial/PublicationCtaBox";
import { Scale, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Perkara & Putusan — Saluran Publikasi Perkara Resmi & Putusan Pengadilan | The Law Times",
  description:
    "Saluran utama publikasi resmi perkara hukum klien, amar putusan Mahkamah Agung, pengadilan niaga, panggilan sidang, dan pengumuman kepailitan terverifikasi.",
};

export default async function PerkaraCategoryPage() {
  const [clientArticles, allArticles, announcements, cases, externalNews] = await Promise.all([
    getClientPublications(20),
    getArticles(),
    getAnnouncements(),
    getCases(),
    getExternalNews(3, "Perkara"),
  ]);

  // Lead story: highest priority client publication
  const featuredCase = clientArticles.find((a) => a.featured) || clientArticles[0];
  const listCases = clientArticles.filter((a) => a.id !== featuredCase?.id);

  // Secondary sidebar selected stories (from other articles with court/litigation context)
  const sidebarSelectedStories = allArticles
    .filter((a) => a.id !== featuredCase?.id && a.section !== "intellectual-property")
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Category Broadside Header */}
      <CategoryHeader
        kicker="RUBRIK UTAMA PERKARA & PUTUSAN"
        title="PERKARA & PUTUSAN"
        editionInfo="LEMBARAN RESMI REKAPITULASI PUTUSAN DAN PERKARA HUKUM"
        description="Saluran utama publikasi perkara hukum klien, penetapan peradilan, pembacaan amar putusan Mahkamah Agung, dan keterbukaan risalah kepailitan/PKPU."
        breadcrumbs={[
          { label: "Rubrikasi", href: "/" },
          { label: "Perkara & Putusan" },
        ]}
      />

      {/* Featured Client Case Publication (Priority Layout) */}
      {featuredCase && (
        <section aria-label="Warta Utama Publikasi Perkara">
          <CategoryFeaturedLead
            article={featuredCase}
            badgeLabel="PUBLIKASI PERKARA KLIEN"
            showLegalNoticeBox={true}
          />
        </section>
      )}

      {/* Editorial Transparency Callout */}
      <div className="border-y-2 border-ink py-2 bg-paper-light flex items-center justify-between text-xs px-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent" />
          <span className="font-sans font-bold uppercase tracking-wider text-[0.6875rem] text-ink">
            Status Publikasi: Terverifikasi Dokumen Resmi Pengadilan & Berkas Kuasa Hukum
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans text-[0.625rem] uppercase tracking-wider text-ink-muted">
          <span>Kompilasi Putusan 2026</span>
          <span>•</span>
          <Link href="/case-archive" className="hover:underline text-ink font-semibold">
            Buka Arsip Putusan →
          </Link>
        </div>
      </div>

      {/* Main Grid: Articles Listing + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Client Case Publications (Primary) */}
        <section aria-label="Daftar Perkara & Putusan Terkini" className="lg:col-span-8 space-y-6">
          <div className="border-b-2 border-ink pb-1 flex items-center justify-between">
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-accent" />
              <span>Publikasi Perkara Klien & Putusan Pengadilan</span>
            </h2>
            <span className="font-sans text-[0.625rem] text-ink-muted uppercase tracking-widest">
              Total {clientArticles.length} Warta
            </span>
          </div>

          <PaginatedArticleListing
            articles={listCases}
            itemsPerPage={5}
            highlightClientBadge={true}
          />
        </section>

        {/* Right Column: Secondary Sidebar */}
        <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-6 space-y-6">
          <PublicationCtaBox variant="compact" />
          <CategorySidebar
            title="WARTA SIDANG & PERADILAN"
            selectedStories={sidebarSelectedStories}
            cases={cases}
            announcements={announcements}
            clientSupportNotice={true}
          />
        </div>
      </div>

      {/* Subtle Broadsheet CTA Banner */}
      <PublicationCtaBox variant="banner" />

      {/* External Legal News Section (Perkara & Putusan) */}
      <ExternalNewsSection
        news={externalNews}
        title="WARTA SIDANG & PUTUSAN DARI SUMBER EKSTERNAL"
      />
    </div>
  );
}
