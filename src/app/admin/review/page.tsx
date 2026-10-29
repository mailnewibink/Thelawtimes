import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

export default async function AdminReviewQueuePage() {
  const supabase = await getSupabaseServerClient();
  let submissions: Array<{
    id: string;
    title: string;
    slug: string;
    content_type: string;
    created_at: string;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, content_type, created_at")
      .eq("status", "in_review")
      .order("created_at", { ascending: false });
    submissions = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editorial Review Queue"
        description="Verify factual citations, legal sources, and approve dispatches for publication."
        breadcrumbs={[{ label: "Review Queue" }]}
      />

      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Pending Article</th>
              <th className="p-3">Section</th>
              <th className="p-3">Submitted</th>
              <th className="p-3 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center italic text-ink-muted">
                  No submissions currently awaiting editorial review.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="p-3 font-semibold text-ink">
                    <Link href={`/admin/articles/${sub.id}/edit`} className="hover:underline">
                      {sub.title}
                    </Link>
                  </td>
                  <td className="p-3 uppercase font-sans text-[0.625rem] text-ink-muted">{sub.content_type}</td>
                  <td className="p-3 meta text-ink-muted">{formatDate(sub.created_at.substring(0, 10), "short")}</td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/admin/articles/${sub.id}/edit`}
                      className="kicker text-[0.625rem] border border-ink bg-ink text-paper px-2 py-1 hover:bg-paper hover:text-ink inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Review & Approve</span>
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
