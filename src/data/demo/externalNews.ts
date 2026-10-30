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
  imageCredit?: string | null;
}

/**
 * 5 BERITA HUKUM TERBARU INDONESIA (SUMBER RESMI TERVERIFIKASI)
 * Dikurasi dari Mahkamah Konstitusi RI, Mahkamah Agung RI, Otoritas Jasa Keuangan,
 * Direktorat Jenderal Kekayaan Intelektual, dan Komisi Pemberantasan Korupsi.
 */
export const demoExternalNews: ExternalNewsItem[] = [
  {
    id: "ext-news-mk-282",
    sourceId: "src-mkri",
    sourceName: "Mahkamah Konstitusi RI",
    title: "MK Batalkan Pasal Penghinaan Pemerintah dan Lembaga Negara dalam KUHP Baru (UU No. 1/2023)",
    summary:
      "Melalui Putusan No. 282/PUU-XXIII/2025, Mahkamah Konstitusi menyatakan Pasal 240 dan Pasal 241 UU No. 1 Tahun 2023 (KUHP Nasional) bertentangan dengan UUD 1945. Mahkamah menegaskan bahwa institusi dan lembaga negara adalah badan hukum publik yang tidak memiliki martabat atau perasaan untuk dicela, sehingga tidak tepat dilindungi melalui norma pidana penghinaan demi menjamin kebebasan sipil dalam menyampaikan kritik kebijakan.",
    canonicalUrl: "https://www.mkri.id/index.php?page=web.Berita&id=20815",
    publishedAt: "2026-10-28T10:00:00Z",
    category: "Hukum Pidana & Tata Negara",
    imageUrl: "/images/photos/supreme-court.jpg",
    imageCredit: "Wikimedia Commons / Mahkamah Agung RI",
  },
  {
    id: "ext-news-ma-pleno",
    sourceId: "src-ma",
    sourceName: "Mahkamah Agung RI (Kepaniteraan MA)",
    title: "Mahkamah Agung Gelar Sidang Pleno Kamar 2026: Selaraskan Yurisprudensi dan Penerapan Asas Peradilan Cepat",
    summary:
      "Ketua Mahkamah Agung Prof. Dr. Sunarto, S.H., M.H., memimpin Rapat Pleno Kamar Mahkamah Agung Tahun 2026 guna menyatukan persepsi hukum para hakim agung di kamar perdata, niaga, pidana khusus, dan tata usaha negara. Pleno ini menghasilkan rumusan pedoman hukum terpadu guna mencegah disparitas putusan serta mengoptimalkan distribusi salinan putusan kasasi bertanda tangan elektronik ke pengadilan pengaju di seluruh Indonesia.",
    canonicalUrl: "https://kepaniteraan.mahkamahagung.go.id/kegiatan/pleno-kamar-2026",
    publishedAt: "2026-10-22T08:30:00Z",
    category: "Pengadilan & Peradilan",
    imageUrl: "/images/photos/courtroom-gavel.jpg",
    imageCredit: "Unsplash / Bill Oxford",
  },
  {
    id: "ext-news-ojk-pojk24",
    sourceId: "src-ojk",
    sourceName: "Otoritas Jasa Keuangan (OJK)",
    title: "OJK Terbitkan POJK No. 24 Tahun 2025: Perketat Standar Pengelolaan Rekening dan Deteksi Rekening Dormant",
    summary:
      "Otoritas Jasa Keuangan secara resmi menerbitkan POJK No. 24 Tahun 2025 tentang Pengelolaan Rekening pada Bank Umum serta meresmikan pengoperasian Indonesia Anti-Scam Center (IASC). Regulasi baru ini menetapkan standardisasi pembukaan rekening, pembatasan rekening pasif (dormant), dan kewajiban deteksi otomatis terhadap rekening bank yang terindikasi digunakan untuk penampungan dana kejahatan keuangan dan transaksi siber ilegal.",
    canonicalUrl: "https://www.ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/OJK-Terbitkan-POJK-Pengelolaan-Rekening-Bank-Umum.aspx",
    publishedAt: "2026-10-15T14:15:00Z",
    category: "Hukum Bisnis & Perbankan",
    imageUrl: "/images/photos/banking-ojk.jpg",
    imageCredit: "Unsplash / Austin Distel",
  },
  {
    id: "ext-news-dgip-rekor",
    sourceId: "src-dgip",
    sourceName: "Direktorat Jenderal Kekayaan Intelektual",
    title: "DJKI Catat Rekor 412 Ribu Permohonan KI dan Percepat Pemeriksaan Paten Domestik Sektor Kesehatan",
    summary:
      "Direktorat Jenderal Kekayaan Intelektual Kementerian Hukum RI mengumumkan rekapitulasi capaian penyelesaian 429.343 permohonan KI sepanjang tahun berjalan. Pendaftaran hak cipta dan merek dagang mendominasi volume permohonan nasional, diiringi peningkatan pengajuan paten dalam negeri sebesar 14,7% per tahun yang dipelopori riset farmasi, perlengkapan medis, dan komunikasi digital dari universitas serta lembaga riset lokal.",
    canonicalUrl: "https://www.dgip.go.id/artikel/detail-artikel/capaian-kinerja-djki-2026-permohonan-ki-meningkat-pesat",
    publishedAt: "2026-10-24T11:45:00Z",
    category: "Merek & Kekayaan Intelektual",
    imageUrl: "/images/photos/trademark-registry.jpg",
    imageCredit: "Unsplash / Giammarco Boscaro",
  },
  {
    id: "ext-news-kpk-stranas",
    sourceId: "src-kpk",
    sourceName: "Komisi Pemberantasan Korupsi (KPK)",
    title: "KPK dan Tim Stranas PK Luncurkan 15 Aksi Pencegahan Korupsi: Prioritaskan Digitalisasi Perizinan dan Asset Recovery",
    summary:
      "Tim Strategi Nasional Pencegahan Korupsi (Stranas PK) bersama KPK, KSP, Bappenas, dan Kemendagri meluncurkan 15 aksi strategis pencegahan korupsi 2025–2026. Fokus aksi mencakup reformasi sistem perizinan berusaha berbasis risiko (OSS RBA), integrasi belanja pengadaan barang/jasa pemerintah secara terpusat, serta penguatan instrumen tindak pidana pencucian uang (TPPU) dan pidana korporasi untuk memaksimalkan pemulihan aset negara.",
    canonicalUrl: "https://www.kpk.go.id/id/berita/siaran-pers/stranas-pk-periode-2025-2026-resmi-diluncurkan",
    publishedAt: "2026-10-18T09:20:00Z",
    category: "Hukum Pidana Korupsi",
    imageUrl: "/images/photos/kpk-governance.jpg",
    imageCredit: "Unsplash / Sean Pollock",
  },
];
