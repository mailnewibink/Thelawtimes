import type { Metadata } from "next";
import { getArticles, LEGAL_NEWS_CATEGORIES } from "@/lib/content";
import { NewsExplorer } from "@/components/explorer/NewsExplorer";

export const metadata: Metadata = {
  title: "Legal News & Editorial Dispatch",
  description:
    "Comprehensive legal journalism, court reporting, legislative monitoring, and professional analysis from The Law Times desk.",
};

export default async function LegalNewsPage() {
  const articles = await getArticles("legal-news");

  return (
    <div className="space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Section II · Editorial</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-ink mb-3">
          Legal News & Reporting
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-soft max-w-2xl leading-relaxed">
          In-depth coverage of courtroom dockets, legislative proposals, judicial precedents,
          and developments within the legal profession in Indonesia.
        </p>
      </header>

      <NewsExplorer
        initialArticles={articles}
        categories={LEGAL_NEWS_CATEGORIES}
      />
    </div>
  );
}
