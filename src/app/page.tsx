import Link from "next/link";
import {
  getClientPublications,
  getArticles,
  getRegulations,
  getGeneralNews,
} from "@/lib/content";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { EditorialSectionHeader } from "@/components/editorial/EditorialSectionHeader";
import { ArticleListItem } from "@/components/editorial/ArticleListItem";
import { RegulationListItem } from "@/components/editorial/RegulationListItem";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { Scale, ArrowRight } from "lucide-react";

export default async function FrontPage() {
  const [clientPubs, generalNews, ipArticles, regulations] = await Promise.all([
    getClientPublications(6),
    getGeneralNews(6),
    getArticles("intellectual-property"),
    getRegulations(),
  ]);

  // Priority 1: Main featured client-case publication
  const featuredClient = clientPubs[0];
  const additionalClientPubs = clientPubs.slice(1, 4);

  // Priority 2: Trademark & IP coverage
  const featuredIP = ipArticles.slice(0, 3);

  // Priority 3: Latest General Legal News
  const latestNews = generalNews.slice(0, 4);

  // Priority 4: Regulation updates
  const featuredRegulations = regulations.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* ==================================================================== */}
      {/* 2. MAIN FEATURED CLIENT-CASE PUBLICATION (TOP HOMEPAGE PRIORITY)     */}
      {/* ==================================================================== */}
      <section aria-label="Publikasi Perkara Klien Utama" className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-accent" />
            <h1 className="font-serif font-bold text-lg text-ink uppercase tracking-wider">
              Publikasi Perkara Klien & Pengumuman Resmi
            </h1>
          </div>
          <Link
            href="/perkara"
            className="kicker inline-flex items-center gap-1 text-xs text-ink hover:text-accent font-bold uppercase transition-colors"
          >
            <span>Seluruh Publikasi Perkara</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredClient && <FeaturedStory article={featuredClient} />}
      </section>

      {/* ==================================================================== */}
      {/* 3. ADDITIONAL RECENT CLIENT-CASE PUBLICATIONS                        */}
      {/* ==================================================================== */}
      {additionalClientPubs.length > 0 && (
        <section aria-label="Publikasi Kasus Terkait Lainnya" className="space-y-6">
          <PaperDivider variant="double" />
          <EditorialSectionHeader
            title="Publikasi Kasus & Putusan Klien Terbaru"
            subtitle="Keterbukaan informasi putusan pengadilan, sengketa komersial, dan warta resmi perkara terkait"
            kicker="Saluran Publikasi Klien"
            action={{ label: "Buka Indeks Perkara", href: "/perkara" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalClientPubs.map((art) => (
              <ArticleListItem
                key={art.id}
                article={art}
                showImage
                className="border-b border-rule-soft md:border-b-0 pb-4 md:pb-0"
              />
            ))}
          </div>
        </section>
      )}

      <PaperDivider variant="thick" />

      {/* ==================================================================== */}
      {/* 4. TRADEMARK AND INTELLECTUAL PROPERTY COVERAGE                      */}
      {/* ==================================================================== */}
      <section aria-label="Kekayaan Intelektual" className="space-y-6">
        <EditorialSectionHeader
          title="Merek & Kekayaan Intelektual"
          subtitle="Sengketa pendaftaran merek dagang, hak cipta, paten & perlindungan prioritas komersial"
          kicker="Rubrik HKI & Hak Cipta"
          action={{ label: "Indeks Merek & HKI", href: "/merek-hki" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredIP.map((art, idx) => (
            <ArticleListItem
              key={art.id}
              article={art}
              showImage={idx === 0}
              className="border-b border-rule-soft md:border-b-0 pb-4 md:pb-0"
            />
          ))}
        </div>
      </section>

      <PaperDivider variant="hairline" />

      {/* ==================================================================== */}
      {/* 5. LATEST GENERAL LEGAL NEWS                                         */}
      {/* ==================================================================== */}
      <section aria-label="Berita Hukum Terkini" className="space-y-6">
        <EditorialSectionHeader
          title="Warta Hukum Terkini"
          subtitle="Perkembangan peradilan umum, advokat, legislasi & ulasan yurisprudensi"
          kicker="Redaksi Broadsheet"
          action={{ label: "Semua Berita Hukum", href: "/berita-hukum" }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.map((art) => (
            <ArticleListItem
              key={art.id}
              article={art}
              compact
              className="border-b border-rule-soft sm:border-b-0 pb-4 sm:pb-0"
            />
          ))}
        </div>
      </section>

      <PaperDivider variant="double" />

      {/* ==================================================================== */}
      {/* 6. REGULATION AND POLICY UPDATES                                     */}
      {/* ==================================================================== */}
      <section aria-label="Pantauan Regulasi" className="space-y-6">
        <EditorialSectionHeader
          title="Pantauan Regulasi & Kebijakan"
          subtitle="Pelacakan ketetapan undang-undang, keputusan menteri & lembaran negara resmi"
          kicker="Monitor Hukum Nasional"
          action={{ label: "Daftar Regulasi Lengkap", href: "/regulasi" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRegulations.map((reg) => (
            <RegulationListItem key={reg.id} regulation={reg} />
          ))}
        </div>
      </section>
    </div>
  );
}
