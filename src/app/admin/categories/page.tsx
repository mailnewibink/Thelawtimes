import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminCategoriesPage() {
  const supabase = await getSupabaseServerClient();
  let categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, description, sort_order, is_active")
      .order("sort_order");
    categories = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editorial Categories & Desks"
        description="Organize taxonomy hierarchies for court reporting and legal notices."
        breadcrumbs={[{ label: "Categories" }]}
      />

      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Order</th>
              <th className="p-3">Category Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-paper-dark/30 transition-colors">
                <td className="p-3 font-mono">{cat.sort_order}</td>
                <td className="p-3 font-bold text-ink">{cat.name}</td>
                <td className="p-3 font-mono text-ink-muted">{cat.slug}</td>
                <td className="p-3 text-ink-muted">{cat.description || "—"}</td>
                <td className="p-3">
                  <span className="kicker text-[0.625rem] border border-rule px-1.5 py-0.5">
                    {cat.is_active ? "ACTIVE" : "DISABLED"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
