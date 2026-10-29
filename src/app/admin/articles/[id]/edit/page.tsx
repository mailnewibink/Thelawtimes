import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { ArticleContentType, ArticleStatus } from "@/types/database";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    notFound();
  }

  const [artRes, catRes, relRes] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("sort_order"),
    supabase.from("article_categories").select("category_id").eq("article_id", id).maybeSingle(),
  ]);

  const article = artRes.data as {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string | null;
    content_type: string;
    status: string;
    featured_image_path: string | null;
    is_demo: boolean;
  } | null;

  const categories = (catRes.data as Array<{ id: string; name: string }> | null) || [];
  const catRel = relRes.data as { category_id: string } | null;

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Article"
        description={`Editing: "${article.title}"`}
        breadcrumbs={[
          { label: "Articles", href: "/admin/articles" },
          { label: "Edit" },
        ]}
      />

      <ArticleForm
        isEditing
        categories={categories || []}
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "",
          body: article.body || "",
          contentType: article.content_type as ArticleContentType,
          status: article.status as ArticleStatus,
          categoryId: catRel?.category_id || "",
          featuredImagePath: article.featured_image_path || "",
          isDemo: article.is_demo,
        }}
      />
    </div>
  );
}
