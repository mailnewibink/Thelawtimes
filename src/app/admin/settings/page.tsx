import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

export default async function AdminSettingsPage() {
  const supabase = await getSupabaseServerClient();
  let auditLogs: Array<{
    id: string;
    action: string;
    entity_type: string;
    created_at: string;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("audit_logs")
      .select("id, action, entity_type, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    auditLogs = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Settings & Audit Log"
        description="Configuration parameters, editorial integrity controls, and security audit trail."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-rule bg-paper-light p-5 space-y-3">
            <h2 className="kicker text-xs text-ink border-b border-rule-soft pb-1">
              Publishing Environment Configuration
            </h2>
            <dl className="text-xs space-y-2 font-serif">
              <div className="flex justify-between py-1 border-b border-rule-soft">
                <dt className="text-ink-muted">Application Edition:</dt>
                <dd className="font-mono font-bold">Phase 3 (Admin CMS & Supabase Active)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-rule-soft">
                <dt className="text-ink-muted">Default Language:</dt>
                <dd className="font-mono font-bold">Bahasa Indonesia (id-ID)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-rule-soft">
                <dt className="text-ink-muted">Row Level Security:</dt>
                <dd className="font-mono font-bold text-green-900">Enforced (Least-Privilege)</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="border border-rule bg-paper-light p-5 space-y-3">
            <h2 className="kicker text-xs text-ink border-b border-rule-soft pb-1">
              Recent Security Audit Events
            </h2>
            {auditLogs.length === 0 ? (
              <p className="font-serif text-xs text-ink-muted italic py-4">
                No recent administrative actions recorded in audit trail.
              </p>
            ) : (
              <ul className="divide-y divide-rule-soft text-xs font-serif">
                {auditLogs.map((log) => (
                  <li key={log.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-ink">{log.action}</span>
                      <span className="meta text-ink-muted ml-2">[{log.entity_type}]</span>
                    </div>
                    <time className="meta text-[0.6875rem]">{formatDate(log.created_at.substring(0, 10), "short")}</time>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
