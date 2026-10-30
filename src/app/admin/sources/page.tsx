import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExternalSourcesClient } from "@/components/admin/ExternalSourcesClient";

export default async function AdminSourcesPage() {
  const supabase = await getSupabaseServerClient();
  let sources: any[] = [];

  if (supabase) {
    const { data } = await (supabase as any)
      .from("sources")
      .select("id, name, institution, base_url, verified_endpoint, is_enabled, last_successful_run, last_error")
      .order("created_at", { ascending: true });
    sources = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sumber Warta Eksternal & Agregasi RSS"
        description="Kelola saluran RSS feed resmi, aktifkan/nonaktifkan sumber, dan jalankan sinkronisasi berita eksternal."
        breadcrumbs={[{ label: "External Sources" }]}
      />

      <ExternalSourcesClient initialSources={sources} />
    </div>
  );
}
