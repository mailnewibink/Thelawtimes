import type { PublicationServiceDetail } from "@/types/content";

export const publicationServicesData: PublicationServiceDetail[] = [
  {
    key: "case_publication",
    title: "Publikasi Perkara",
    subtitle: "Dokumentasi & Keterbukaan Informasi Penanganan Perkara Hukum",
    description:
      "Layanan penerbitan ringkasan perkara perdata, kepailitan/PKPU, sengketa bisnis komersial, ketenagakerjaan, dan perkara tata usaha negara untuk memberikan transparansi informasi publik yang akurat dan berimbang.",
    intendedContent: [
      "Ringkasan duduk perkara sengketa hukum atau perselisihan perdata/komersial.",
      "Informasi permohonan kepailitan atau Penundaan Kewajiban Pembayaran Utang (PKPU).",
      "Panggilan resmi sidang pengadilan atau pengumuman hukum statutori.",
      "Klarifikasi posisi hukum para pihak dengan menjunjung asas praduga tak bersalah.",
    ],
    publicationProcess: [
      "1. Pengajuan berkas dan dokumen pendukung oleh kuasa hukum atau pihak berperkara.",
      "2. Verifikasi nomor registrasi perkara pada sistem informasi pengadilan resmi (SIPP/Kepaniteraan).",
      "3. Penyusunan draf narasi warta berimbang oleh tim redaksi The Law Times.",
      "4. Penelaahan kepatuhan kode etik jurnalistik dan regulasi privasi data peradilan.",
      "5. Penerbitan pada rubrik Perkara & Putusan dengan arsip publikasi permanen.",
    ],
    editorialRequirements: [
      "Nomor perkara resmi dan pengadilan yang memeriksa perkara.",
      "Salinan gugatan, permohonan, atau surat kuasa yang sah dari pemohon.",
      "Tidak memuat materi fitnah, pencemaran nama baik, atau penghinaan terhadap pengadilan (contempt of court).",
      "Wajib menyertakan identitas narahubung resmi yang dapat dihubungi dewan redaksi.",
    ],
  },
  {
    key: "ruling_publication",
    title: "Publikasi Putusan",
    subtitle: "Penyebarluasan Amar Putusan & Yurisprudensi Pengadilan",
    description:
      "Publikasi rekapitulasi pertimbangan hukum dan amar putusan pengadilan tingkat pertama, banding, kasasi, maupun peninjauan kembali di Mahkamah Agung untuk kepentingan dokumentasi hukum publik dan preseden yurisprudensi.",
    intendedContent: [
      "Amar putusan perkara perdata, perniagaan, pidana khusus, atau tata usaha negara.",
      "Pertimbangan hukum (ratio decidendi) hakim majelis pemeriksa perkara.",
      "Penetapan status hukum berkekuatan hukum tetap (inkracht van gewijsde) atau upaya hukum lanjutan.",
      "Putusan arbitrase nasional maupun internasional yang telah didaftarkan.",
    ],
    publicationProcess: [
      "1. Pengunggahan salinan resmi amar putusan atau putusan lengkap berotentikasi.",
      "2. Uji keabsahan putusan terhadap Direktori Putusan Mahkamah Agung RI.",
      "3. Redaksi mengekstrak pertimbangan hukum pokok dan membuat ringkasan eksekutif.",
      "4. Pengecekan status keberlakuan putusan (apakah ada banding/kasasi).",
      "5. Publikasi artikel warta putusan disertai metadata perkara dan tautan rujukan dokumen resmi.",
    ],
    editorialRequirements: [
      "Salinan resmi putusan pengadilan berstempel atau bertanda tangan elektronik sah.",
      "Penjelasan status keterikatan putusan (inkracht atau dalam proses banding/kasasi).",
      "Persetujuan atas redaksi anonimisasi perkara khusus anak atau kesusilaan sesuai ketentuan MA RI.",
    ],
  },
  {
    key: "legal_opinion",
    title: "Artikel Hukum dan Opini",
    subtitle: "Ruang Wacana Doktrin, Analisis Perundang-Undangan & Kolom Praktisi",
    description:
      "Wadah pemikiran dan kajian hukum mendalam dari akademisi, praktisi hukum, advokat, kurator, dan konsultan hukum mengenai isu-isu hukum terkini, perkembangan perundang-undangan, dan telaah peradilan di Indonesia.",
    intendedContent: [
      "Opini hukum (legal opinion) terkait perkembangan regulasi atau isu yuridis kontemporer.",
      "Analisis doktrinal terhadap yurisprudensi dan penerapan pasal peraturan perundang-undangan.",
      "Panduan kepatuhan hukum bisnis, perpajakan perusahaan, tata kelola korporasi (GCG), dan kepatuhan.",
      "Refleksi reformasi sistem peradilan dan hukum nasional.",
    ],
    publicationProcess: [
      "1. Pengiriman naskah artikel opini (800 – 2.000 kata) beserta biografi singkat penulis.",
      "2. Penilaian substansi hukum dan orisinalitas naskah oleh dewan redaksi.",
      "3. Penyuntingan bahasa jurnalistik hukum dan penyesuaian gaya selingkung The Law Times.",
      "4. Konfirmasi persetujuan draf final dengan penulis.",
      "5. Penayangan pada rubrik Berita Hukum atau Opini Hukum dengan atribusi penuh penulis.",
    ],
    editorialRequirements: [
      "Naskah orisinal, belum pernah dipublikasikan di media massa lain.",
      "Berisi dasar hukum yang jelas dengan rujukan undang-undang atau preseden terkait.",
      "Biodata singkat, foto profil berformat formal, dan afiliasi lembaga atau kantor hukum penulis.",
      "Bebas dari promosi terselubung yang bersifat menyesatkan pembaca.",
    ],
  },
  {
    key: "ip_publication",
    title: "Publikasi Merek & HKI",
    subtitle: "Pemberitahuan Pendaftaran Merek, Sengketa HKI & Perlindungan Aset Intelektual",
    description:
      "Saluran warta pengumuman permohonan pendaftaran merek dagang, pemberitahuan oposisi merek, sengketa hak cipta, paten, dan desain industri untuk memperkuat rekam jejak kepemilikan dan keterbukaan publik.",
    intendedContent: [
      "Pemberitahuan permohonan atau kepemilikan sertifikat merek terdaftar di DJKI.",
      "Pengumuman sengketa penghapusan merek, pembatalan pendaftaran, atau gugatan pelanggaran hak cipta.",
      "Peringatan hukum (somasi publik) terkait penggunaan merek tanpa hak dan pemalsuan barang.",
      "Informasi lisensi, pengalihan hak, atau waralaba kekayaan intelektual.",
    ],
    publicationProcess: [
      "1. Pengajuan berkas data merek (nomor permohonan/sertifikat, kelas barang/jasa, etiket merek).",
      "2. Verifikasi silang pada Pangkalan Data Kekayaan Intelektual (PDKI) DJKI Kemenkumham RI.",
      "3. Penyusunan teks warta formal pengumuman perlindungan hak cipta/merek.",
      "4. Penelaahan hukum dan kepastian tidak melanggar ketentuan warta pengumuman.",
      "5. Publikasi pada rubrik Merek & HKI dengan etiket grafis visual berkualitas tinggi.",
    ],
    editorialRequirements: [
      "Nomor permohonan atau sertifikat pendaftaran resmi dari Ditjen KI Kemenkumham RI.",
      "Spesimen etiket merek (logo/gambar) beresolusi tajam.",
      "Surat kuasa khusus konsultan HKI atau dokumen bukti hak pemegang merek yang sah.",
      "Klausul pernyataan tanggung jawab kebenaran dokumen dari pemohon.",
    ],
  },
  {
    key: "sponsored_content",
    title: "Sponsored Legal Content",
    subtitle: "Kemitraan Publikasi Institusional dengan Transparansi Label Sponsor",
    description:
      "Penerbitan warta institusional korporasi, kantor hukum, dan organisasi terkait pencapaian transaksi hukum (deals), ekspansi kantor hukum, advokasi regulasi industri, atau laporan riset hukum khusus dengan label transparansi editorial yang tegas.",
    intendedContent: [
      "Pemberitaan transaksi M&A, pembiayaan sindikasi, atau penutupan transaksi restrukturisasi berskala besar.",
      "Pengumuman kemitraan baru (new partners), merger kantor hukum, atau restrukturisasi firma hukum.",
      "Laporan riset industri atau panduan regulasi sektoral yang didanai institusi/asosiasi.",
      "Pemberitahuan seminar, konferensi hukum internasional, atau pelatihan sertifikasi hukum.",
    ],
    publicationProcess: [
      "1. Penyampaian proposal publikasi sponsor dan materi bahan pemberitaan.",
      "2. Evaluasi relevansi nilai informasi hukum bagi pembaca oleh meja redaksi.",
      "3. Penyuntingan editorial dan pelabelan wajib 'Konten Bersponsor / Sponsored Content'.",
      "4. Pemeriksaan bersama mengenai keakuratan data fakta dan keterbukaan pemodal sponsor.",
      "5. Penayangan resmi dengan penandaan visual yang transparan dan dapat dipertanggungjawabkan.",
    ],
    editorialRequirements: [
      "Wajib memuat label 'Konten Bersponsor' (Sponsored Legal Content) tanpa kecuali.",
      "Tidak boleh memuat klaim hukum fiktif, jaminan keberhasilan perkara, atau janji keuntungan finansial.",
      "Seluruh klaim fakta transaksi atau penghargaan wajib menyertakan rujukan yang dapat dibuktikan.",
      "Redaksi The Law Times memegang hak penolakan naskah yang melanggar kode etik independensi pers.",
    ],
  },
];

export const publicationTypeLabels: Record<string, string> = {
  case_publication: "Publikasi Perkara",
  ruling_publication: "Publikasi Putusan",
  legal_opinion: "Artikel Hukum & Opini",
  ip_publication: "Publikasi Merek & HKI",
  sponsored_content: "Sponsored Legal Content",
};

export const publicationStatusLabels: Record<string, { label: string; badgeClass: string }> = {
  submitted: {
    label: "Permohonan Masuk",
    badgeClass: "bg-paper-dark border border-rule text-ink-muted",
  },
  contacted: {
    label: "Sudah Dihubungi",
    badgeClass: "bg-blue-50 border border-blue-200 text-blue-800",
  },
  under_review: {
    label: "Dalam Penelaahan",
    badgeClass: "bg-amber-50 border border-amber-300 text-amber-900 font-semibold",
  },
  approved: {
    label: "Disetujui Redaksi",
    badgeClass: "bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold",
  },
  rejected: {
    label: "Ditolak / Batal",
    badgeClass: "bg-rose-50 border border-rose-200 text-rose-800",
  },
};
