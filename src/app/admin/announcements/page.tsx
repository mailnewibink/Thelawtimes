import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

export default async function AdminAnnouncementsPage() {
  const supabase = await getSupabaseServerClient();
  let announcements: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    updated_at: string;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, status, published_at, updated_at")
      .eq("content_type", "announcement")
      .order("updated_at", { ascending: false });
    announcements = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Official Legal Announcements"
        description="Public summons, bankruptcy notices, auctions, and corporate notifications."
        breadcrumbs={[{ label: "Announcements" }]}
        actions={
          <Link
            href="/admin/articles/new"
            className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-xs hover:bg-paper hover:text-ink transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Notice</span>
          </Link>
        }
      />

      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Notice Title</th>
              <th className="p-3">Publication Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center italic text-ink-muted">
                  No announcements recorded yet in the database.
                </td>
              </tr>
            ) : (
              announcements.map((ann) => (
                <tr key={ann.id} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="p-3 font-semibold text-ink">
                    <Link href={`/admin/articles/${ann.id}/edit`} className="hover:underline">
                      {ann.title}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span className="kicker text-[0.625rem] border border-rule px-2 py-0.5 uppercase">
                      {ann.status}
                    </span>
                  </td>
                  <td className="p-3 meta text-ink-muted">
                    {ann.published_at ? formatDate(ann.published_at.substring(0, 10), "short") : "Unscheduled"}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/articles/${ann.id}/edit`}
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
