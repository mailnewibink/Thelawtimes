import Link from "next/link";
import { Plus, History } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SourceListTable } from "@/components/admin/SourceListTable";

export default async function AdminSourcesPage() {
  const supabase = await getSupabaseServerClient();
  let sources = [];

  if (supabase) {
    const { data } = await (supabase as any)
      .from("sources")
      .select("id, name, institution, source_type, access_method, is_enabled, polling_interval_minutes, last_successful_run, last_error")
      .order("created_at");
    sources = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Official Legal Sources & Automation Pipeline"
        description="Configure verified data connectors, court APIs, and statutory gazette ingestion."
        breadcrumbs={[{ label: "Sources & Connectors" }]}
        actions={
          <div className="flex gap-2">
            <Link
              href="/admin/sources/history"
              className="kicker inline-flex items-center gap-1.5 border border-rule bg-white text-ink px-3 py-1.5 text-xs hover:border-ink transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>Telemetry Runs</span>
            </Link>
            <Link
              href="/admin/sources/import"
              className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-xs hover:bg-paper hover:text-ink transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manual Import (CSV/JSON)</span>
            </Link>
          </div>
        }
      />

      <SourceListTable initialSources={sources} />
    </div>
  );
}
