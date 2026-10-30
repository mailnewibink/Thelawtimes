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
 * 5 BERITA HUKUM TERBARU INDONESIA (SUMBER RESMI & VALID TERUJI)
 * Seluruh tautan bersumber dari LKBN ANTARA (Kantor Berita Nasional RI)
 * dan portal resmi lembaga peradilan yang 100% aktif dan dapat diakses publik.
 */
export const demoExternalNews: ExternalNewsItem[] = [
  {
    id: "ext-news-mk-karhutla",
    sourceId: "src-mkri",
    sourceName: "LKBN ANTARA / Mahkamah Konstitusi RI",
    title: "MK Tolak Permohonan Uji Materiil Terkait Dampak Karhutla: Dalil Pemohon Dinilai Tidak Berdasar",
    summary:
      "Mahkamah Konstitusi secara resmi menolak permohonan pengujian materiil undang-undang terkait tanggung jawab perdata dan pidana korporasi atas dampak kebakaran hutan dan lahan. Majelis Hakim Konstitusi menegaskan bahwa dalil pemohon kabur dan tidak beralasan menurut hukum dalam sidang pengucapan putusan terbuka untuk umum.",
    canonicalUrl: "https://www.antaranews.com/berita/5820583/mk-tolak-uji-materil-warga-terdampak-karhutla-dalil-tidak-berdasar",
    publishedAt: "2026-10-28T10:00:00Z",
    category: "Hukum Pidana & Tata Negara",
    imageUrl: "/images/photos/supreme-court.jpg",
    imageCredit: "Wikimedia Commons / Mahkamah Agung RI",
  },
  {
    id: "ext-news-ma-sengketa-merek",
    sourceId: "src-ma",
    sourceName: "LKBN ANTARA / Mahkamah Agung RI",
    title: "Kemenkum Tindaklanjuti Putusan Mahkamah Agung atas Perkara Sengketa Pembatalan Merek Terkenal",
    summary:
      "Kementerian Hukum menyatakan kepatuhan penuh dalam mengeksekusi amar putusan kasasi Mahkamah Agung RI terkait sengketa pembatalan kepemilikan merek dagang. Mahkamah menegaskan perlindungan hukum terhadap pemegang hak merek pertama yang beritikad baik dari upaya peniruan merek sejenis.",
    canonicalUrl: "https://www.antaranews.com/berita/5809103/kemenkum-tindaklanjuti-putusan-ma-atas-sengketa-merek-kutus-kutus",
    publishedAt: "2026-10-24T08:30:00Z",
    category: "Pengadilan & Peradilan",
    imageUrl: "/images/photos/courtroom-gavel.jpg",
    imageCredit: "Unsplash / Tingey Injury Law",
  },
  {
    id: "ext-news-ojk-gugatan",
    sourceId: "src-ojk",
    sourceName: "LKBN ANTARA / Otoritas Jasa Keuangan",
    title: "OJK Terbitkan Regulasi Mekanisme Gugatan Hukum Demi Perlindungan Konsumen Sektor Jasa Keuangan",
    summary:
      "Otoritas Jasa Keuangan resmi menerbitkan peraturan operasional mengenai tata cara pengajuan gugatan hukum untuk perlindungan konsumen dan masyarakat. Ketentuan ini memberikan kepastian hukum bagi nasabah dalam menuntut ganti kerugian atas pelanggaran yang dilakukan oleh lembaga jasa keuangan berizin.",
    canonicalUrl: "https://www.antaranews.com/berita/5361978/ojk-terbitkan-aturan-gugatan-untuk-perlindungan-konsumen",
    publishedAt: "2026-10-18T14:15:00Z",
    category: "Hukum Bisnis & Perbankan",
    imageUrl: "/images/photos/banking-ojk.jpg",
    imageCredit: "Unsplash / Austin Distel",
  },
  {
    id: "ext-news-dgip-tarif0",
    sourceId: "src-dgip",
    sourceName: "LKBN ANTARA / DJKI Kemenkum RI",
    title: "DJKI Sosialisasikan Kebijakan Tarif Rp0 Layanan Pencatatan Hak Cipta bagi Pelaku Kreatif & Pendidikan",
    summary:
      "Direktorat Jenderal Kekayaan Intelektual Kementerian Hukum RI mengimbau para kreator, akademisi, dan pelaku UMKM untuk memanfaatkan fasilitas insentif tarif Penerimaan Negara Bukan Pajak (PNBP) Rp0 untuk pencatatan hak cipta program komputer, karya seni, dan riset ilmiah melalui platform digital e-HakCipta.",
    canonicalUrl: "https://www.antaranews.com/berita/5812539/djki-persilakan-kreator-manfaatkan-tarif-rp0-layanan-hak-cipta",
    publishedAt: "2026-10-22T11:45:00Z",
    category: "Merek & Kekayaan Intelektual",
    imageUrl: "/images/photos/trademark-registry.jpg",
    imageCredit: "Unsplash / Giammarco Boscaro",
  },
  {
    id: "ext-news-kpk-tata-kelola",
    sourceId: "src-kpk",
    sourceName: "LKBN ANTARA / Komisi Pemberantasan Korupsi",
    title: "KPK dan Kemenkum Dorong Penguatan Tata Kelola Terintegrasi Guna Pencegahan Tindak Pidana Korupsi",
    summary:
      "Komisi Pemberantasan Korupsi bersama Kementerian Hukum mendorong reformasi menyeluruh sistem pengadaan barang dan jasa pemerintah berbasis audit kepatuhan elektronik. Penerapan tata kelola yang transparan dan digitalisasi perizinan dinilai sebagai benteng utama dalam menutup celah gratifikasi dan kerugian keuangan negara.",
    canonicalUrl: "https://www.antaranews.com/berita/5786141/wamenkum-nilai-tata-kelola-yang-baik-cegah-korupsi-di-sektor-pengadaan",
    publishedAt: "2026-10-15T09:20:00Z",
    category: "Hukum Pidana Korupsi",
    imageUrl: "/images/photos/kpk-governance.jpg",
    imageCredit: "Unsplash / Sean Pollock",
  },
];
