import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExternalSourcesClient } from "@/components/admin/ExternalSourcesClient";
import { OFFICIAL_LEGAL_SOURCE_DIRECTORY } from "@/data/sources/directory";
import { demoExternalNews } from "@/data/demo/externalNews";

export default async function AdminSourcesPage() {
  const supabase = await getSupabaseServerClient();
  let sources: any[] = [];
  let records: any[] = [];

  if (supabase) {
    const [srcRes, recRes] = await Promise.all([
      (supabase as any)
        .from("sources")
        .select("id, name, institution, base_url, verified_endpoint, is_enabled, last_successful_run, last_error")
        .order("created_at", { ascending: true }),
      (supabase as any)
        .from("source_records")
        .select("id, source_id, external_id, title, summary_abstract, canonical_url, source_date, metadata, review_status, sources(name)")
        .order("source_date", { ascending: false })
        .limit(30),
    ]);

    sources = srcRes.data || [];
    if (recRes.data && recRes.data.length > 0) {
      records = recRes.data.map((r: any) => ({
        id: r.id,
        sourceId: r.source_id,
        sourceName: r.sources?.name || r.metadata?.sourceName || "Sumber Resmi",
        title: r.title,
        summary: r.summary_abstract || "",
        canonicalUrl: r.canonical_url || "#",
        publishedAt: r.source_date || new Date().toISOString(),
        category: r.metadata?.category || "Berita Hukum",
        reviewStatus: r.review_status || "approved",
        isFeatured: r.metadata?.is_featured || false,
      }));
    }
  }

  // Fallback demo records if empty in dev
  if (records.length === 0) {
    records = demoExternalNews.map((d) => ({
      ...d,
      reviewStatus: "approved",
      isFeatured: false,
    }));
  }

  // Ensure default LKBN Antara source is visible in sources table if empty
  if (sources.length === 0) {
    sources = [
      {
        id: "src-antara-hukum",
        name: "LKBN ANTARA — Warta Hukum",
        institution: "Lembaga Kantor Berita Nasional Antara",
        base_url: "https://www.antaranews.com",
        verified_endpoint: "https://www.antaranews.com/rss/hukum.xml",
        is_enabled: true,
        last_successful_run: new Date().toISOString(),
        last_error: null,
      },
      {
        id: "src-ojk",
        name: "Otoritas Jasa Keuangan (OJK)",
        institution: "OJK RI",
        base_url: "https://www.ojk.go.id",
        verified_endpoint: null,
        is_enabled: true,
        last_successful_run: null,
        last_error: null,
      },
    ];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sumber Informasi Hukum Eksternal & Agregasi Berita"
        description="Direktori resmi lembaga peradilan, pemantauan kesehatan feed RSS, dan meja kurasi redaksi untuk warta eksternal."
        breadcrumbs={[{ label: "External Sources" }]}
      />

      <ExternalSourcesClient
        initialSources={sources}
        sourceDirectory={OFFICIAL_LEGAL_SOURCE_DIRECTORY}
        initialRecords={records}
      />
    </div>
  );
}
