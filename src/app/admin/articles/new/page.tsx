import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tulis Artikel Baru"
        description="Buat warta hukum baru, publikasi perkara klien, artikel opini, atau kajian regulasi."
        breadcrumbs={[
          { label: "Articles", href: "/admin/articles" },
          { label: "New Article" },
        ]}
      />

      <ArticleForm />
    </div>
  );
}
