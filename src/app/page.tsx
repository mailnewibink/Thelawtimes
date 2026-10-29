import Link from "next/link";
import {
  getFeaturedArticle,
  getArticles,
  getAnnouncements,
  getRegulations,
  getCases,
} from "@/lib/content";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { EditorialSectionHeader } from "@/components/editorial/EditorialSectionHeader";
import { ArticleListItem } from "@/components/editorial/ArticleListItem";
import { AnnouncementNotice } from "@/components/editorial/AnnouncementNotice";
import { RegulationListItem } from "@/components/editorial/RegulationListItem";
import { PaperDivider } from "@/components/ui/PaperDivider";

export default async function FrontPage() {
  const [featured, allNews, ipArticles, announcements, regulations, cases] =
    await Promise.all([
      getFeaturedArticle(),
      getArticles("legal-news"),
      getArticles("intellectual-property"),
      getAnnouncements(),
      getRegulations(),
      getCases(),
    ]);

  const secondaryNews = allNews.filter((a) => a.id !== featured?.id).slice(0, 4);
  const featuredAnnouncements = announcements.slice(0, 3);
  const featuredRegulations = regulations.slice(0, 3);
  const featuredIP = ipArticles.slice(0, 3);
  const featuredCases = cases.slice(0, 2);

  return (
    <div className="space-y-12">
      {/* 1. Lead Section / Featured Story */}
      <section aria-label="Lead Story">
        {featured && <FeaturedStory article={featured} />}
      </section>

      <PaperDivider variant="double" />

      {/* 2. Official Announcements & Latest Legal News (Broadsheet Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official Legal Announcements */}
        <section
          aria-label="Official Announcements"
          className="lg:col-span-5 flex flex-col space-y-6"
        >
          <EditorialSectionHeader
            title="Official Announcements"
            subtitle="Public notices, court summons, and insolvency filings"
            kicker="Gazette & Record"
            action={{ label: "View Archive", href: "/announcements" }}
          />
          <div className="space-y-4">
            {featuredAnnouncements.map((ann) => (
              <AnnouncementNotice key={ann.id} announcement={ann} compact />
            ))}
          </div>
        </section>

        {/* Right Column: Latest Legal News */}
        <section
          aria-label="Latest Legal News"
          className="lg:col-span-7 flex flex-col space-y-6 lg:border-l lg:border-rule-soft lg:pl-8"
        >
          <EditorialSectionHeader
            title="Latest Legal News"
            subtitle="Developments in the courts, bar, and legislation"
            kicker="Editorial Dispatch"
            action={{ label: "All News", href: "/legal-news" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {secondaryNews.map((art) => (
              <ArticleListItem
                key={art.id}
                article={art}
                compact
                className="border-b border-rule-soft sm:border-b-0 pb-4 sm:pb-0"
              />
            ))}
          </div>
        </section>
      </div>

      <PaperDivider variant="thick" />

      {/* 3. Regulation Watch & Intellectual Property */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Regulation Watch */}
        <section
          aria-label="Regulation Watch"
          className="lg:col-span-6 flex flex-col space-y-6"
        >
          <EditorialSectionHeader
            title="Regulation Watch"
            subtitle="Tracking governmental decrees, ministerial rulings & draft laws"
            kicker="Regulatory Monitor"
            action={{ label: "Full Watchlist", href: "/regulation-watch" }}
          />
          <div className="space-y-3">
            {featuredRegulations.map((reg) => (
              <RegulationListItem key={reg.id} regulation={reg} />
            ))}
          </div>
        </section>

        {/* Intellectual Property */}
        <section
          aria-label="Intellectual Property"
          className="lg:col-span-6 flex flex-col space-y-6 lg:border-l lg:border-rule-soft lg:pl-8"
        >
          <EditorialSectionHeader
            title="Intellectual Property"
            subtitle="Trademarks, patents, copyright, and industrial designs"
            kicker="IP & Commercial Desk"
            action={{ label: "IP Section", href: "/intellectual-property" }}
          />
          <div className="space-y-4">
            {featuredIP.map((art) => (
              <ArticleListItem
                key={art.id}
                article={art}
                showImage={!!art.image}
                className="border-b border-rule-soft pb-4 last:border-b-0 last:pb-0"
              />
            ))}
          </div>
        </section>
      </div>

      <PaperDivider variant="double" />

      {/* 4. Court & Case Archive Entry Point */}
      <section aria-label="Court & Case Archive">
        <EditorialSectionHeader
          title="Court & Case Documentation Archive"
          subtitle="Structured documentation of civil, commercial, and administrative disputes"
          kicker="Judicial Docket"
          action={{ label: "Explore Archive", href: "/case-archive" }}
        />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-paper-light border border-rule p-6">
          <div className="lg:col-span-8">
            <h3 className="font-display text-2xl font-bold text-ink mb-2">
              Search Legal Precedents & Dispute Records
            </h3>
            <p className="font-serif text-sm leading-relaxed text-ink-soft mb-4">
              The archive provides structured case dockets including filing summaries,
              procedural timelines, and attached documentation. Access verified case
              histories across Indonesian commercial, IP, and civil jurisdictions.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/case-archive"
                className="kicker inline-block border border-ink bg-ink text-paper px-4 py-2 hover:bg-paper hover:text-ink transition-colors"
              >
                Open Full Case Archive
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-rule-soft pt-4 lg:pt-0 lg:pl-6 space-y-3">
            <span className="kicker text-[0.625rem] text-ink-muted">Recent Archive Records</span>
            {featuredCases.map((c) => (
              <div key={c.id} className="text-xs">
                <Link
                  href={`/case-archive/${c.slug}`}
                  className="font-serif font-bold text-ink hover:underline line-clamp-1"
                >
                  {c.title}
                </Link>
                <div className="meta text-[0.6875rem]">{c.category} · {c.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
