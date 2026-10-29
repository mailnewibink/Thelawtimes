import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminIPPage() {
  const supabase = await getSupabaseServerClient();
  let ipArticles: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, status")
      .eq("content_type", "intellectual_property")
      .order("created_at", { ascending: false });
    ipArticles = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Intellectual Property Desk"
        description="Trademarks, patents, copyright, and industrial designs."
        breadcrumbs={[{ label: "Intellectual Property" }]}
        actions={
          <Link
            href="/admin/articles/new"
            className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-xs hover:bg-paper hover:text-ink transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New IP Story</span>
          </Link>
        }
      />

      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {ipArticles.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center italic text-ink-muted">
                  No IP records catalogued yet.
                </td>
              </tr>
            ) : (
              ipArticles.map((art) => (
                <tr key={art.id} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="p-3 font-semibold text-ink">{art.title}</td>
                  <td className="p-3">
                    <span className="kicker text-[0.625rem] border border-rule px-1.5 py-0.5 uppercase">
                      {art.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="kicker text-[0.625rem] border border-rule px-2 py-1 hover:border-ink"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
