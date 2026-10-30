import { Metadata } from "next";
import { getGeneralNews, getArticles, getCases } from "@/lib/content";
import { CategoryHeader } from "@/components/editorial/CategoryHeader";
import { CategoryFeaturedLead } from "@/components/editorial/CategoryFeaturedLead";
import { PaginatedArticleListing } from "@/components/editorial/PaginatedArticleListing";
import { CategorySidebar } from "@/components/editorial/CategorySidebar";
import { Newspaper, Landmark } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Berita Hukum & Peradilan — Warta Hukum Nasional & Korporasi | The Law Times",
  description:
    "Liputan jurnalisme hukum independen mengenai pengadilan, kejaksaan, advokat, restrukturisasi bisnis, legislasi, dan analisis yurisprudensi Indonesia.",
};

export default async function BeritaHukumCategoryPage() {
  const [generalArticles, allArticles, cases] = await Promise.all([
    getGeneralNews(25),
    getArticles(),
    getCases(),
  ]);

  // Lead story: high-impact legal news
  const featuredNews =
    generalArticles.find((a) => a.featured) ||
    generalArticles.find((a) => a.image) ||
    generalArticles[0];

  const listNews = generalArticles.filter((a) => a.id !== featuredNews?.id);

  // Secondary sidebar selected stories
  const sidebarSelected = allArticles
    .filter((a) => a.id !== featuredNews?.id && a.publicationType === "client_publication")
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Category Broadside Header */}
      <CategoryHeader
        kicker="JURNALISME & LIPUTAN HUKUM NASIONAL"
        title="BERITA HUKUM"
        editionInfo="LEMBARAN WARTA HUKUM, PERADILAN & LEMBAGA NEGARA"
        description="Liputan redaksi mengenai dinamika peradilan nasional, yurisprudensi terkini, profesi advokat, kepatuhan korporasi, dan penegakan hukum."
        breadcrumbs={[
          { label: "Rubrikasi", href: "/" },
          { label: "Berita Hukum" },
        ]}
      />

      {/* Featured Legal News */}
      {featuredNews && (
        <section aria-label="Berita Utama Hukum">
          <CategoryFeaturedLead
            article={featuredNews}
            badgeLabel="LIPUTAN KHUSUS"
            showLegalNoticeBox={false}
          />
        </section>
      )}

      {/* Quick Topic Strips */}
      <div className="border-y-2 border-ink py-2 bg-paper-light flex items-center justify-between text-xs px-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-accent" />
          <span className="font-sans font-bold uppercase tracking-wider text-[0.6875rem] text-ink">
            Liputan Redaksi: Mahkamah Agung • Mahkamah Konstitusi • Pengadilan Tipikor & Niaga • Lembaga Hukum
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans text-[0.625rem] uppercase tracking-wider text-ink-muted">
          <span>Warta Terverifikasi</span>
          <span>•</span>
          <Link href="/perkara" className="hover:underline text-ink font-semibold">
            Lihat Publikasi Perkara Klien →
          </Link>
        </div>
      </div>

      {/* Main Grid: Articles Listing + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: General Legal News Listing */}
        <section aria-label="Daftar Berita Hukum Nasional" className="lg:col-span-8 space-y-6">
          <div className="border-b-2 border-ink pb-1 flex items-center justify-between">
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-accent" />
              <span>Kompilasi Warta Hukum & Dinamika Peradilan</span>
            </h2>
            <span className="font-sans text-[0.625rem] text-ink-muted uppercase tracking-widest">
              Total {generalArticles.length} Warta
            </span>
          </div>

          <PaginatedArticleListing
            articles={listNews}
            itemsPerPage={5}
            highlightClientBadge={true}
          />
        </section>

        {/* Right Column: Secondary Sidebar */}
        <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-6">
          <CategorySidebar
            title="PUBLIKASI & PUTUSAN PILIHAN"
            selectedStories={sidebarSelected}
            cases={cases}
            clientSupportNotice={true}
          />
        </div>
      </div>
    </div>
  );
}
