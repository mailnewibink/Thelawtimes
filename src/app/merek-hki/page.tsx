import { Metadata } from "next";
import { getArticles, getAnnouncements } from "@/lib/content";
import { CategoryHeader } from "@/components/editorial/CategoryHeader";
import { CategoryFeaturedLead } from "@/components/editorial/CategoryFeaturedLead";
import { PaginatedArticleListing } from "@/components/editorial/PaginatedArticleListing";
import { CategorySidebar } from "@/components/editorial/CategorySidebar";
import { Sparkles, BookmarkCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Merek & Kekayaan Intelektual (HKI) — Pendaftaran, Paten & Hak Cipta | The Law Times",
  description:
    "Liputan sengketa pendaftaran merek dagang, pembatalan sertifikat PDKI, perlindungan paten industri, hak cipta, dan putusan Pengadilan Niaga.",
};

export default async function MerekHKICategoryPage() {
  const [allArticles, announcements] = await Promise.all([
    getArticles(),
    getAnnouncements(),
  ]);

  // Filter IP and trademark articles
  const ipArticles = allArticles.filter(
    (a) =>
      a.section === "intellectual-property" ||
      a.category?.toLowerCase().includes("trademark") ||
      a.category?.toLowerCase().includes("merek") ||
      a.category?.toLowerCase().includes("intellectual")
  );

  // If none or few, fallback to articles with IP keywords or general news
  const finalIpArticles = ipArticles.length >= 3 ? ipArticles : allArticles;

  // Featured IP article: prefer SNOWCAN or MA trademark ruling
  const featuredArticle =
    finalIpArticles.find((a) => a.slug.includes("snowcan")) ||
    finalIpArticles.find((a) => a.slug.includes("merek")) ||
    finalIpArticles[0];

  const listArticles = finalIpArticles.filter((a) => a.id !== featuredArticle?.id);

  // Secondary sidebar selected stories
  const sidebarSelected = allArticles
    .filter((a) => a.id !== featuredArticle?.id && a.section !== "intellectual-property")
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Category Broadside Header */}
      <CategoryHeader
        kicker="RUBRIKASI HAK KEKAYAAN INTELEKTUAL"
        title="MEREK & HKI"
        editionInfo="LEMBARAN RESMI DOKUMENTASI HAK KEKAYAAN INTELEKTUAL"
        description="Dokumentasi sengketa hak merek dagang terdaftar, hak cipta, paten industri, penegakan First-to-File, dan putusan Pengadilan Niaga."
        breadcrumbs={[
          { label: "Rubrikasi", href: "/" },
          { label: "Merek & HKI" },
        ]}
      />

      {/* Featured IP Story */}
      {featuredArticle && (
        <section aria-label="Warta Utama Merek & HKI">
          <CategoryFeaturedLead
            article={featuredArticle}
            badgeLabel="FOKUS UTAMA MEREK & HKI"
            showLegalNoticeBox={featuredArticle.publicationType === "client_publication"}
          />
        </section>
      )}

      {/* Quick Topic Strips */}
      <div className="border-y-2 border-ink py-2 bg-paper-light flex items-center justify-between text-xs px-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-accent" />
          <span className="font-sans font-bold uppercase tracking-wider text-[0.6875rem] text-ink">
            Fokus Rubrik: Sengketa Merek Dagang • Hak Cipta • Paten • Desain Industri • PDKI
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans text-[0.625rem] uppercase tracking-wider text-ink-muted">
          <span>Yurisdiksi UU No. 20/2016</span>
          <span>•</span>
          <Link href="/artikel/pengumuman-dan-peringatan-hukum-merek-snowcan" className="hover:underline text-ink font-semibold">
            Lihat Peringatan Terkini →
          </Link>
        </div>
      </div>

      {/* Main Grid: Articles Listing + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: IP Articles Listing */}
        <section aria-label="Daftar Warta Merek & HKI" className="lg:col-span-8 space-y-6">
          <div className="border-b-2 border-ink pb-1 flex items-center justify-between">
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Daftar Perkembangan & Sengketa Merek / HKI</span>
            </h2>
            <span className="font-sans text-[0.625rem] text-ink-muted uppercase tracking-widest">
              Total {finalIpArticles.length} Warta
            </span>
          </div>

          <PaginatedArticleListing
            articles={listArticles}
            itemsPerPage={5}
            highlightClientBadge={true}
          />
        </section>

        {/* Right Column: Secondary Sidebar */}
        <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-6">
          <CategorySidebar
            title="WARTA HUKUM TERKAIT"
            selectedStories={sidebarSelected}
            announcements={announcements}
            clientSupportNotice={true}
          />
        </div>
      </div>
    </div>
  );
}
