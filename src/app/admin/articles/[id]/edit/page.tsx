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
