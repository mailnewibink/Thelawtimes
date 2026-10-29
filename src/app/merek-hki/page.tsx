import { Metadata } from "next";
import { getArticles } from "@/lib/content";
import { EditorialSectionHeader } from "@/components/editorial/EditorialSectionHeader";
import { ArticleListItem } from "@/components/editorial/ArticleListItem";

export const metadata: Metadata = {
  title: "Merek & Kekayaan Intelektual — The Law Times",
  description:
    "Liputan sengketa pendaftaran merek, hak cipta, paten, rahasia dagang, dan perkembangan perlindungan HKI di Indonesia.",
};

export default async function IntellectualPropertyPage() {
  const articles = await getArticles("intellectual-property");

  return (
    <div className="space-y-10">
      <EditorialSectionHeader
        title="Merek & Kekayaan Intelektual"
        subtitle="Dokumentasi sengketa hak merek dagang terdaftar, hak cipta, paten, dan putusan Pengadilan Niaga"
        kicker="Rubrik Merek & HKI"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((art, idx) => (
          <ArticleListItem
            key={art.id}
            article={art}
            showImage={idx < 6}
            className="border-b border-rule-soft pb-6"
          />
        ))}
      </div>
    </div>
  );
}
