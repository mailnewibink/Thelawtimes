import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

export default async function AdminSourcesHistoryPage() {
  const supabase = await getSupabaseServerClient();
  let runs = [];

  if (supabase) {
    const { data } = await (supabase as any)
      .from("automation_runs")
      .select(`
        id,
        status,
        trigger_type,
        records_found,
        records_new,
        records_updated,
        records_unchanged,
        records_failed,
        duration_ms,
        started_at,
        error_message,
        sources (name)
      `)
      .order("started_at", { ascending: false })
      .limit(30);
    runs = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Ingestion Telemetry & Run History"
        description="Audit records for all automated cron and manual ingestion pipeline runs."
        breadcrumbs={[
          { label: "Sources", href: "/admin/sources" },
          { label: "Telemetry History" },
        ]}
      />

      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Source Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Trigger</th>
              <th className="p-3">Found</th>
              <th className="p-3">New</th>
              <th className="p-3">Updated</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Execution Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {runs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center italic text-ink-muted">
                  No automated pipeline runs recorded yet.
                </td>
              </tr>
            ) : (
              runs.map((r: any) => (
                <tr key={r.id} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="p-3 font-semibold text-ink">{r.sources?.name || "Direct Trigger"}</td>
                  <td className="p-3">
                    <span
                      className={`kicker text-[0.625rem] px-2 py-0.5 border ${
                        r.status === "success"
                          ? "border-green-800 bg-green-50 text-green-900"
                          : r.status === "running"
                          ? "border-blue-800 bg-blue-50 text-blue-900 animate-pulse"
                          : "border-red-800 bg-red-50 text-red-900"
                      }`}
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[0.6875rem] uppercase text-ink-muted">
                    {r.trigger_type || "manual"}
                  </td>
                  <td className="p-3 font-mono">{r.records_found}</td>
                  <td className="p-3 font-mono text-green-900 font-bold">+{r.records_new}</td>
                  <td className="p-3 font-mono text-ink-muted">{r.records_updated || 0}</td>
                  <td className="p-3 font-mono text-ink-muted">{r.duration_ms ? `${r.duration_ms}ms` : "—"}</td>
                  <td className="p-3 meta text-ink-muted">
                    {formatDate(r.started_at.substring(0, 10), "short")}
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
