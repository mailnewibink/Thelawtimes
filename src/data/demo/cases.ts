import type { CaseRecord } from "@/types/content";
import { DEMO_PROVENANCE } from "./helpers";

/**
 * ARSIP PERKARA & PUTUSAN PENGADILAN THE LAW TIMES (Case Archive).
 */
export const demoCases: CaseRecord[] = [
  {
    id: "case-001",
    slug: "sengketa-kontrak-niaga-logistik-komersial",
    title: "Perkara Sengketa Wanprestasi Perjanjian Kerjasama Logistik & Pergudangan",
    reference: "No. 412/Pdt.G/2026/PN.Jkt.Pst",
    archiveId: "TLT-CASES-2026-0001",
    court: "Pengadilan Negeri Jakarta Pusat",
    category: "Commercial",
    caseType: "Perdata Khusus / Niaga",
    status: "Open",
    year: 2026,
    summary: [
      "Perkara gugatan perdata mengenai dalil ingkar janji (wanprestasi) atas pemenuhan kewajiban pembayaran jasa pengangkutan peti kemas dan sewa fasilitas dermaga.",
      "Penggugat mendalilkan adanya kerugian komersial terhitung sejak berakhirnya masa tenggang penagihan invoice jasa logistik yang disepakati bersama.",
    ],
    timeline: [
      {
        date: "2026-09-15",
        title: "Pendaftaran Gugatan Perdata di E-Court",
        description: "Gugatan resmi didaftarkan secara elektronik dan mendapatkan nomor registrasi perkara perdata.",
      },
      {
        date: "2026-10-02",
        title: "Sidang Perdana & Penunjukan Hakim Mediasi",
        description: "Pemeriksaan legalitas surat kuasa khusus para pihak dan penetapan mediator peradilan.",
      },
      {
        date: "2026-10-24",
        title: "Laporan Mediasi Tidak Berhasil (Deadlock)",
        description: "Hakim mediator melaporkan mediasi gagal dan persidangan dilanjutkan ke pembacaan gugatan.",
      },
    ],
    documents: [
      { label: "Salinan Relaas Panggilan Sidang", kind: "Record", url: null },
      { label: "Surat Kuasa Khusus Kuasa Hukum", kind: "Filing", url: null },
    ],
    relatedAnnouncementSlugs: ["relaas-panggilan-sidang-pertama-gugatan-perdata"],
    relatedArticleSlugs: ["panggilan-sidang-sengketa-pemenuhan-prestasi-kontrak-konstruksi"],
    lastUpdated: "2026-10-28",
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "case-002",
    slug: "sengketa-pembatalan-merek-dagang-farmasi",
    title: "Gugatan Pembatalan Pendaftaran Merek Dagang Kategori Produk Kesehatan Kelas 05",
    reference: "No. 29/Pdt.Sus-HKI/Merek/2026/PN.Niaga.Jkt.Pst",
    archiveId: "TLT-CASES-2026-0002",
    court: "Pengadilan Niaga Jakarta Pusat",
    category: "Intellectual Property",
    caseType: "Hak Kekayaan Intelektual",
    status: "Closed",
    year: 2026,
    summary: [
      "Sengketa kepemilikan dan hak prioritas pendaftaran etiket merek dagang produk suplemen kesehatan antara pemilik sah terdahulu melawan pendaftar beritikad tidak baik.",
      "Mahkamah Agung dalam tingkat kasasi menguatkan putusan Pengadilan Niaga yang membatalkan pendaftaran merek tergugat dari Daftar Umum Merek DJKI.",
    ],
    timeline: [
      {
        date: "2025-11-10",
        title: "Pendaftaran Gugatan Pembatalan Merek",
        description: "Penggugat mengajukan gugatan pembatalan merek berdasarkan Pasal 76 UU No. 20 Tahun 2016.",
      },
      {
        date: "2026-04-18",
        title: "Pembacaan Putusan Pengadilan Niaga",
        description: "Majelis hakim mengabulkan gugatan penggugat untuk seluruhnya.",
      },
      {
        date: "2026-10-29",
        title: "Pemberitahuan Amar Putusan Kasasi MA RI",
        description: "Permohonan kasasi ditolak dan putusan berkekuatan hukum tetap (inkracht van gewijsde).",
      },
    ],
    documents: [
      { label: "Salinan Amar Putusan Kasasi MA (PDF)", kind: "Ruling", url: null },
      { label: "Sertifikat Pendaftaran Merek DJKI", kind: "Record", url: null },
    ],
    relatedAnnouncementSlugs: ["pengumuman-dan-peringatan-hukum-merek-snowcan"],
    relatedArticleSlugs: ["putusan-kasasi-mahkamah-agung-sengketa-merek-dagang"],
    lastUpdated: "2026-10-29",
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "case-003",
    slug: "pkpu-restrukturisasi-utang-korporasi-manufaktur",
    title: "Permohonan Penundaan Kewajiban Pembayaran Utang (PKPU) Korporasi Manufaktur",
    reference: "No. 89/Pdt.Sus-PKPU/2026/PN.Niaga.Jkt.Pst",
    archiveId: "TLT-CASES-2026-0003",
    court: "Pengadilan Niaga Jakarta Pusat",
    category: "Bankruptcy & PKPU",
    caseType: "Kepailitan & PKPU",
    status: "Closed",
    year: 2026,
    summary: [
      "Permohonan restrukturisasi kewajiban pembayaran utang terhadap sindikasi perbankan dan pemasok bahan baku industri.",
      "Majelis Hakim Niaga mengesahkan Perjanjian Perdamaian (Homologasi) setelah disetujui secara mutlak dalam voting kreditor.",
    ],
    timeline: [
      {
        date: "2026-05-12",
        title: "Penetapan PKPU Sementara (45 Hari)",
        description: "Pengadilan menetapkan PKPU Sementara dan mengangkat Tim Pengurus berlisensi.",
      },
      {
        date: "2026-08-30",
        title: "Rapat Voting Rencana Perdamaian",
        description: "Kreditor separatis dan konkuren menyetujui proposal restrukturisasi utang secara bulat.",
      },
      {
        date: "2026-10-27",
        title: "Pembacaan Putusan Pengesahan Homologasi",
        description: "Pengadilan Niaga membacakan putusan pengesahan perdamaian dan PKPU berakhir damai.",
      },
    ],
    documents: [
      { label: "Naskah Akta Perjanjian Perdamaian", kind: "Record", url: null },
      { label: "Petikan Putusan Homologasi PKPU", kind: "Ruling", url: null },
    ],
    relatedAnnouncementSlugs: ["panggilan-rapat-kreditor-verifikasi-piutang-pkpu"],
    relatedArticleSlugs: ["pengumuman-homologasi-perdamaian-pkpu-korporasi"],
    lastUpdated: "2026-10-27",
    provenance: DEMO_PROVENANCE,
  },
];
