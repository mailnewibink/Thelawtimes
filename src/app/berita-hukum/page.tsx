import { Metadata } from "next";
import { getGeneralNews } from "@/lib/content";
import { EditorialSectionHeader } from "@/components/editorial/EditorialSectionHeader";
import { ArticleListItem } from "@/components/editorial/ArticleListItem";

export const metadata: Metadata = {
  title: "Berita Hukum & Peradilan — The Law Times",
  description:
    "Liputan jurnalisme hukum independen mengenai pengadilan, advokat, legislasi, dan analisis yurisprudensi Indonesia.",
};

export default async function GeneralLegalNewsPage() {
  const articles = await getGeneralNews(24);

  return (
    <div className="space-y-10">
      <EditorialSectionHeader
        title="Warta & Berita Hukum"
        subtitle="Liputan redaksi mengenai putusan peradilan, profesi advokat, undang-undang, dan yurisprudensi nasional"
        kicker="Berita Hukum"
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
