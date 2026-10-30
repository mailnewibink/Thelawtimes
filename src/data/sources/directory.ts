export interface OfficialSourceEntry {
  id: string;
  name: string;
  institution: string;
  websiteUrl: string;
  category: string;
  integrationMethod: "RSS" | "REST API" | "Open Data" | "Manual Curation";
  endpointUrl: string | null;
  accessRestrictions: string;
  attributionRequirements: string;
  supportedCategories: string[];
  integrationStatus: "integrated" | "manual_only" | "requires_auth" | "restricted";
  notes: string;
}

/**
 * Official registry of candidate institutions and verified access methods.
 * Researched strictly against actual endpoints and access policies without fabricating credentials.
 */
export const OFFICIAL_LEGAL_SOURCE_DIRECTORY: OfficialSourceEntry[] = [
  {
    id: "src-ma-ri",
    name: "Mahkamah Agung Republik Indonesia",
    institution: "Mahkamah Agung Republik Indonesia",
    websiteUrl: "https://www.mahkamahagung.go.id",
    category: "Putusan & Perkembangan Pengadilan",
    integrationMethod: "Manual Curation",
    endpointUrl: "https://putusan3.mahkamahagung.go.id/rest/putusan",
    accessRestrictions: "Portal dan REST API direktori putusan dilindungi WAF / anti-bot (HTTP 403 untuk automated scrapers tanpa sertifikat kemitraan resmi).",
    attributionRequirements: "Wajib menyertakan nama lembaga, nomor register perkara, dan tautan langsung ke putusan asli.",
    supportedCategories: ["Perkara & Putusan", "Berita Hukum Nasional"],
    integrationStatus: "requires_auth",
    notes: "Memerlukan token/kemitraan B2B resmi dari Kepaniteraan MA RI untuk integrasi API otomatis; saat ini didukung melalui kurasi editorial terverifikasi.",
  },
  {
    id: "src-mk-ri",
    name: "Mahkamah Konstitusi Republik Indonesia",
    institution: "Mahkamah Konstitusi Republik Indonesia",
    websiteUrl: "https://www.mkri.id",
    category: "Perkembangan Pengadilan & Uji Materi",
    integrationMethod: "Manual Curation",
    endpointUrl: "https://www.mkri.id/index.php?page=web.Berita",
    accessRestrictions: "Portal web menerapkan filter keamanan Cloudflare/WAF ketat untuk permintaan otomatis luar negeri atau headless bots.",
    attributionRequirements: "Wajib mencantumkan nomor perkara pengujian undang-undang dan risalah sidang resmi MKRI.",
    supportedCategories: ["Berita Hukum", "Regulasi", "Perkara & Putusan"],
    integrationStatus: "manual_only",
    notes: "Pengumuman dan jadwal sidang dikurasi manual oleh redaksi berdasarkan lembaran panggilan resmi.",
  },
  {
    id: "src-jdihn",
    name: "Jaringan Dokumentasi dan Informasi Hukum Nasional (JDIHN)",
    institution: "Badan Pembinaan Hukum Nasional (BPHN)",
    websiteUrl: "https://jdihn.go.id",
    category: "Regulasi Terbaru",
    integrationMethod: "REST API",
    endpointUrl: "https://api.jdihn.go.id/v1/peraturan",
    accessRestrictions: "Protokol harvesting JDIHN memerlukan pendaftaran kode institusi pengelola dan whitelist IP server.",
    attributionRequirements: "Mencantumkan 'Sumber resmi: JDIHN (jdihn.go.id)' dan nomor lembaran negara.",
    supportedCategories: ["Regulasi", "Berita Hukum"],
    integrationStatus: "requires_auth",
    notes: "API publik memerlukan otentikasi header API-Key resmi dari BPHN Kemenkumham RI.",
  },
  {
    id: "src-dgip",
    name: "Direktorat Jenderal Kekayaan Intelektual (DJKI)",
    institution: "Kementerian Hukum Republik Indonesia",
    websiteUrl: "https://www.dgip.go.id",
    category: "Merek & Kekayaan Intelektual",
    integrationMethod: "Manual Curation",
    endpointUrl: "https://pdki-indonesia.dgip.go.id",
    accessRestrictions: "Pangkalan Data Kekayaan Intelektual (PDKI) publik tidak menyediakan endpoint RSS terbuka; dilengkapi Captcha dinamis untuk mencegah pencurian data massal.",
    attributionRequirements: "Wajib menyertakan Nomor Permohonan / IDM, kelas barang/jasa, dan tanggal penerimaan.",
    supportedCategories: ["Merek & HKI", "Pengetahuan Hukum"],
    integrationStatus: "manual_only",
    notes: "Didukung melalui sistem publikasi pengumuman perkara merek resmi oleh kuasa hukum dan pemohon terdaftar.",
  },
  {
    id: "src-ojk",
    name: "Otoritas Jasa Keuangan (OJK)",
    institution: "Otoritas Jasa Keuangan Republik Indonesia",
    websiteUrl: "https://www.ojk.go.id",
    category: "Hukum Bisnis & Regulasi Jasa Keuangan",
    integrationMethod: "Manual Curation",
    endpointUrl: "https://www.ojk.go.id/_layouts/15/OJK.CustomPages/RssFeed.aspx",
    accessRestrictions: "Endpoint SharePoint feed mengembalikan halaman HTML terproteksi saat diakses tanpa sesi browser terotentikasi.",
    attributionRequirements: "Mencantumkan tanggal siaran pers dan nomor Surat Edaran / POJK.",
    supportedCategories: ["Hukum Bisnis", "Regulasi"],
    integrationStatus: "manual_only",
    notes: "Kurasi rilis regulasi perbankan, pasar modal, dan fintech melalui siaran pers resmi.",
  },
  {
    id: "src-hukumonline",
    name: "Hukumonline",
    institution: "PT Justika Siar Publika",
    websiteUrl: "https://www.hukumonline.com",
    category: "Berita Hukum Nasional & Analisis",
    integrationMethod: "Manual Curation",
    endpointUrl: null,
    accessRestrictions: "Hukumonline tidak menyediakan RSS feed terbuka untuk umum (telah dihentikan) dan melarang web-scraping otomatis dalam Terms of Use.",
    attributionRequirements: "Atribusi nama media Hukumonline dan tautan URL asli.",
    supportedCategories: ["Berita Hukum", "Pengetahuan Hukum", "Hukum Bisnis"],
    integrationStatus: "restricted",
    notes: "Menghormati kebijakan hak cipta media swasta. Hanya mengutip tajuk dan mengarahkan langsung pembaca ke situs resmi Hukumonline.",
  },
  {
    id: "src-antara-hukum",
    name: "LKBN ANTARA — Rubrik Hukum & Kriminalitas",
    institution: "Lembaga Kantor Berita Nasional Antara",
    websiteUrl: "https://www.antaranews.com",
    category: "Berita Hukum Nasional",
    integrationMethod: "RSS",
    endpointUrl: "https://www.antaranews.com/rss/hukum.xml",
    accessRestrictions: "Feed RSS 2.0 resmi publik terbuka dengan izin sindikasi judul dan ringkasan.",
    attributionRequirements: "Mencantumkan atribusi 'Sumber: LKBN ANTARA' dan tautan artikel asli.",
    supportedCategories: ["Berita Hukum", "Perkembangan Pengadilan", "Hukum Bisnis"],
    integrationStatus: "integrated",
    notes: "Terverifikasi aktif dan beroperasi penuh secara otomatis melalui pipeline agregasi XML/RSS.",
  },
];
