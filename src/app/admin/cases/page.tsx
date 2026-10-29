import { Plus } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminCasesPage() {
  const supabase = await getSupabaseServerClient();
  let cases: Array<{
    id: string;
    title: string;
    slug: string;
    case_reference: string | null;
    court_name: string | null;
    case_status: string | null;
    public_visibility: boolean;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("cases")
      .select("id, title, slug, case_reference, court_name, case_status, public_visibility")
      .order("created_at", { ascending: false });
    cases = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Court & Case Archives"
        description="Judicial dockets, dispute records, and courtroom filings."
        breadcrumbs={[{ label: "Cases" }]}
        actions={
          <button
            type="button"
            className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-xs hover:bg-paper hover:text-ink transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Case Docket</span>
          </button>
        }
      />

      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Matter / Title</th>
              <th className="p-3">Reference / Docket</th>
              <th className="p-3">Court</th>
              <th className="p-3">Procedural Status</th>
              <th className="p-3">Public Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {cases.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center italic text-ink-muted">
                  No judicial case dockets recorded in database.
                </td>
              </tr>
            ) : (
              cases.map((c) => (
                <tr key={c.id} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="p-3 font-semibold text-ink">{c.title}</td>
                  <td className="p-3 font-mono text-[0.6875rem]">{c.case_reference || "Unassigned"}</td>
                  <td className="p-3 text-ink-muted">{c.court_name || "Unspecified"}</td>
                  <td className="p-3">
                    <span className="kicker text-[0.625rem] border border-rule px-1.5 py-0.5">
                      {c.case_status || "Pending"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`kicker text-[0.625rem] px-2 py-0.5 border ${
                        c.public_visibility
                          ? "border-ink bg-ink text-paper"
                          : "border-rule text-ink-muted"
                      }`}
                    >
                      {c.public_visibility ? "PUBLIC" : "CONFIDENTIAL / PRIVATE"}
                    </span>
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
