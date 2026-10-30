import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  let articleData: any = null;

  if (supabase) {
    const { data } = await (supabase as any)
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (data) {
      articleData = {
        id: data.id,
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        body: data.body || "",
        publicationType: data.publication_type || "general_news",
        category: "Berita Hukum",
        status: data.status === "published" ? "published" : "draft",
        author: "Redaksi The Law Times",
        publishedAt: data.published_at ? data.published_at.split("T")[0] : new Date().toISOString().split("T")[0],
        featuredImagePath: data.featured_image_path || "/images/courthouse.jpg",
        seoTitle: data.seo_title || "",
        seoDescription: data.seo_description || "",
      };
    }
  }

  // Fallback to real verified dataset if not found in database
  if (!articleData) {
    const { demoArticles } = await import("@/data/demo/articles");
    const fallbackArticle = demoArticles.find((a) => a.id === id);

    if (fallbackArticle) {
      const isNewContent =
        fallbackArticle.id.startsWith("art-edu-") || fallbackArticle.id.startsWith("art-hki-");

      articleData = {
        id: fallbackArticle.id,
        title: fallbackArticle.headline,
        slug: fallbackArticle.slug,
        excerpt: fallbackArticle.excerpt,
        body: fallbackArticle.body.join("\n\n"),
        publicationType: fallbackArticle.publicationType || "general_news",
        category: fallbackArticle.category || "Berita Hukum",
        status: isNewContent ? "draft" : "published",
        author: fallbackArticle.byline || "Redaksi The Law Times",
        publishedAt: fallbackArticle.publishedAt,
        featuredImagePath: fallbackArticle.image?.src || "/images/courthouse.jpg",
        seoTitle: fallbackArticle.seoTitle || "",
        seoDescription: fallbackArticle.seoDescription || "",
      };
    }
  }

  if (!articleData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit: ${articleData.title}`}
        description="Perbarui isi artikel, metadata penelusuran, atau ubah status penerbitan."
        breadcrumbs={[
          { label: "Articles", href: "/admin/articles" },
          { label: "Edit Article" },
        ]}
      />

      <ArticleForm initialData={articleData} isEditing={true} />
    </div>
  );
}
