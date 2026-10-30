export interface ExternalNewsItem {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  publishedAt: string;
  category: string;
  imageUrl?: string | null;
}

export const demoExternalNews: ExternalNewsItem[] = [
  {
    id: "ext-news-001",
    sourceId: "src-ma",
    sourceName: "Direktori Putusan MA RI",
    title: "Kepaniteraan Mahkamah Agung Siapkan Pembaruan Sistem Digitalisasi Perkara Kasasi",
    summary: "Mahkamah Agung Republik Indonesia mengumumkan modernisasi modul e-court perdata khusus guna mempercepat distribusi salinan putusan kasasi ke pengadilan pengaju.",
    canonicalUrl: "https://putusan3.mahkamahagung.go.id/pengumuman/modernisasi-ecourt",
    publishedAt: "2026-10-29T10:30:00Z",
    category: "Perkara & Putusan",
  },
  {
    id: "ext-news-002",
    sourceId: "src-jdihn",
    sourceName: "JDIHN BPHN",
    title: "Pemerintah Undangkan Peraturan Pemerintah Terkait Harmonisasi Tata Ruang Wilayah",
    summary: "Lembaran Negara memuat instrumen regulasi baru tentang percepatan integrasi data geospasial tematik guna kepastian perizinan berusaha nasional.",
    canonicalUrl: "https://jdihn.go.id/peraturan/pp-tataruang-2026",
    publishedAt: "2026-10-28T08:15:00Z",
    category: "Regulasi",
  },
  {
    id: "ext-news-003",
    sourceId: "src-ojk",
    sourceName: "Otoritas Jasa Keuangan (OJK)",
    title: "OJK Terbitkan Panduan Mitigasi Risiko Kepatuhan Hukum Sektor Fintech Lending",
    summary: "Regulator jasa keuangan menetapkan standar transparansi penetapan bunga serta kepatuhan perlindungan kerahasiaan data konsumen peminjam.",
    canonicalUrl: "https://ojk.go.id/siaran-pers/fintech-compliance-2026",
    publishedAt: "2026-10-27T14:00:00Z",
    category: "Berita Hukum",
  },
  {
    id: "ext-news-004",
    sourceId: "src-dgip",
    sourceName: "DJKI Kemenkumham RI",
    title: "Direktorat Merek Tingkatkan Kecepatan Penyelesaian Oposisi Merek Komersial",
    summary: "Pangkalan Data Kekayaan Intelektual mencatat percepatan penyelesaian sengketa oposisi merek beritikad tidak baik melalui sidang mediasi digital.",
    canonicalUrl: "https://dgip.go.id/berita/penyelesaian-oposisi-merek",
    publishedAt: "2026-10-26T11:45:00Z",
    category: "Merek & HKI",
  },
  {
    id: "ext-news-005",
    sourceId: "src-mkri",
    sourceName: "Mahkamah Konstitusi RI",
    title: "MK Sidangkan Pengujian Materiil Pasal Ketentuan Batas Waktu Kasasi Kepailitan",
    summary: "Pemohon mendalilkan adanya kerugian konstitusional terkait batas waktu pemberitahuan putusan peradilan niaga yang dinilai terlalu singkat.",
    canonicalUrl: "https://mkri.id/sidang/uji-materi-kepailitan",
    publishedAt: "2026-10-25T09:20:00Z",
    category: "Perkara & Putusan",
  },
];
