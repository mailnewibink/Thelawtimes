import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const supabase = await getSupabaseServerClient();
  let categories: Array<{ id: string; name: string }> = [];

  if (supabase) {
    const { data } = await supabase.from("categories").select("id, name").order("sort_order");
    categories = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Draft New Article"
        description="Compose new legal journalism, analysis, or statutory explainer."
        breadcrumbs={[
          { label: "Articles", href: "/admin/articles" },
          { label: "New Article" },
        ]}
      />

      <ArticleForm categories={categories} />
    </div>
  );
}
