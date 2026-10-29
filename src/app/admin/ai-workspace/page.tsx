import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AiEditorialWorkspace, WorkspaceSourceRecord } from "@/components/admin/AiEditorialWorkspace";
import { getAiConfigStatus } from "@/lib/ai/service";

const DEMO_FALLBACK_RECORDS: WorkspaceSourceRecord[] = [
  {
    id: "rec-ma-putusan-812",
    title: "Putusan Mahkamah Agung No. 812 K/Pdt.Sus-HKI/2026: Sengketa Merek Dagang & Hak Prioritas Pendaftaran",
    source_name: "Direktori Putusan Mahkamah Agung RI",
    source_type: "court",
    canonical_url: "https://putusan3.mahkamahagung.go.id/direktori/putusan/812-k-pdt-sus-hki-2026.html",
    external_id: "PUT-MA-812-2026",
    source_date: "2026-10-15",
    review_status: "reviewed",
    metadata: {
      majelis_hakim: ["Dr. Sunarto, S.H., M.H.", "Prof. Dr. Takdir Rahmadi, S.H., LL.M.", "Dr. Ibrahim, S.H., M.H."],
      amar: "Tolak Kasasi",
      klasifikasi: "Hak Kekayaan Intelektual",
      pengadilan_tingkat_pertama: "Pengadilan Niaga pada Pengadilan Negeri Jakarta Pusat",
    },
  },
  {
    id: "rec-jdihn-uu-1-2026",
    title: "Undang-Undang Republik Indonesia Nomor 1 Tahun 2026 tentang Penyelenggaraan Sistem Informasi Hukum Terpadu",
    source_name: "JDIHN RI (Jaringan Dokumentasi dan Informasi Hukum Nasional)",
    source_type: "regulation",
    canonical_url: "https://jdihn.go.id/dokumen/peraturan/uu-1-2026",
    external_id: "UU-01-2026",
    source_date: "2026-09-28",
    review_status: "reviewed",
    metadata: {
      pemrakarsa: "Kementerian Koordinator Bidang Politik, Hukum, dan Keamanan",
      lembaran_negara: "LN Tahun 2026 Nomor 14, TLN Nomor 6840",
      status_keberlakuan: "Berlaku efektif",
    },
  },
  {
    id: "rec-pkpu-45-2026",
    title: "Putusan Homologasi PKPU No. 45/Pdt.Sus-PKPU/2026/PN.Niaga.Jkt.Pst: Restrukturisasi Utang Korporasi Manufaktur",
    source_name: "Pengadilan Niaga Jakarta Pusat",
    source_type: "court",
    canonical_url: "https://pn-jakartapusat.go.id/pkpu/45-2026",
    external_id: "PKPU-45-2026",
    source_date: "2026-10-02",
    review_status: "pending",
    metadata: {
      debitur: "PT Nusantara Prima Persada",
      pengurus: "Tim Pengurus Terdaftar",
      hasil_voting: "94.2% Kreditor Konkuren Menyetujui Rencana Perdamaian",
    },
  },
  {
    id: "rec-djki-merek-104",
    title: "Berita Resmi Merek DJKI Seri A No. 104/BRM/2026: Pendaftaran Merek Internasional Protokol Madrid",
    source_name: "DJKI Kemenkumham RI",
    source_type: "intellectual_property",
    canonical_url: "https://pdki-indonesia.dgip.go.id/brm/104-2026",
    external_id: "BRM-104-2026",
    source_date: "2026-10-18",
    review_status: "reviewed",
    metadata: {
      kelas_barang: ["Kelas 9: Perangkat Lunak AI", "Kelas 42: Layanan Komputasi Awan"],
      periode_sanggahan: "2 Bulan sejak publikasi",
    },
  },
];

export default async function AdminAiWorkspacePage() {
  const supabase = await getSupabaseServerClient();
  let sourceRecords: WorkspaceSourceRecord[] = [];

  if (supabase) {
    try {
      const { data } = await (supabase as any)
        .from("source_records")
        .select(`
          id,
          title,
          canonical_url,
          external_id,
          source_date,
          review_status,
          raw_document_url,
          metadata,
          sources (
            name,
            source_type
          )
        `)
        .order("created_at", { ascending: false })
        .limit(30);

      if (data && data.length > 0) {
        sourceRecords = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          canonical_url: d.canonical_url,
          external_id: d.external_id,
          source_date: d.source_date,
          review_status: d.review_status,
          raw_document_url: d.raw_document_url,
          metadata: d.metadata,
          source_name: d.sources?.name || "Official Legal Source",
          source_type: d.sources?.source_type || "legal",
        }));
      }
    } catch {
      // In demo mode or offline, use fallback records
    }
  }

  // Combine with fallback records if database records are empty
  if (sourceRecords.length === 0) {
    sourceRecords = DEMO_FALLBACK_RECORDS;
  }

  const aiConfig = getAiConfigStatus();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="AI-Assisted Editorial & Legal Document Intelligence"
        description="Analisis yuridis berbantuan AI, ekstraksi klaim berbasis bukti, ringkasan putusan, dan penyusunan draf berita broadsheet."
        breadcrumbs={[{ label: "AI Editorial Workspace" }]}
      />

      <AiEditorialWorkspace initialSources={sourceRecords} initialConfig={aiConfig} />
    </div>
  );
}
