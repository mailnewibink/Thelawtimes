export interface LegalServiceItem {
  key: string;
  slug: string;
  title: string;
  categoryName: string;
  headline: string;
  tagline: string;
  description: string;
  longDescription: string[];
  scopes: string[];
  processSteps: { title: string; desc: string }[];
  deliverables: string[];
  disclaimer: string;
  imageSrc: string;
  imageCredit: string;
}

export const LEGAL_SERVICES: LegalServiceItem[] = [
  {
    key: "pendaftaran-merek",
    slug: "pendaftaran-merek",
    title: "Pendaftaran Merek",
    categoryName: "Merek & Identitas Bisnis",
    headline: "Layanan Pendaftaran Merek Dagang & Jasa DJKI",
    tagline: "Perlindungan Nama, Logo, dan Hak Eksklusif Bisnis di Seluruh Indonesia",
    description:
      "The Law Times menyediakan akses konsultasi dan pendampingan profesional dalam penelusuran, identifikasi kelas barang/jasa, persiapan berkas, dan pendaftaran merek resmi ke Direktorat Jenderal Kekayaan Intelektual (DJKI).",
    longDescription: [
      "Merek merupakan identitas dagang paling bernilai yang membedakan produk atau jasa Anda dari kompetitor. Berdasarkan asas First to File yang dianut dalam Undang-Undang Nomor 20 Tahun 2016 tentang Merek dan Indikasi Geografis, hak eksklusif atas merek hanya diberikan kepada pihak yang pertama kali mengajukan permohonan pendaftaran yang sah.",
      "Layanan pendampingan pendaftaran merek The Law Times dirancang secara komprehensif mulai dari tahap pra-pendaftaran guna meminimalisir risiko penolakan substantif oleh pemeriksa merek DJKI, hingga pemantauan berkala lembaran Berita Resmi Merek (BRM).",
      "Kami mendampingi para pelaku usaha perorangan, rintisan (startup), UMKM, hingga korporasi dalam memetakan klasifikasi Nice Classification yang paling tepat untuk perlindungan jangka panjang.",
    ],
    scopes: [
      "Konsultasi dan pemeriksaan awal merek",
      "Penelusuran merek (trademark clearance search) pada pangkalan data PDKI",
      "Identifikasi dan penetapan kelas merek (Nice Classification Edisi 12)",
      "Persiapan dokumen dan etiket (spesimen logo)",
      "Pendampingan permohonan pendaftaran ke DJKI Kementerian Hukum RI",
      "Pemantauan status proses pendaftaran hingga terbit sertifikat merek",
    ],
    processSteps: [
      {
        title: "1. Penelusuran & Analisis Kemiripan",
        desc: "Pengecekan kemiripan pada pokoknya atau keseluruhannya terhadap merek-merek yang telah terdaftar atau dalam permohonan di DJKI.",
      },
      {
        title: "2. Klasifikasi & Dokumen",
        desc: "Penyusunan deskripsi jenis barang/jasa sesuai sistem Klasifikasi Nice dan verifikasi dokumen legalitas pemohon.",
      },
      {
        title: "3. Pengajuan Permohonan Resmi",
        desc: "Pemberian tanda terima permohonan resmi DJKI yang memuat Nomor Permohonan dan Tanggal Penerimaan (Filing Date).",
      },
      {
        title: "4. Pengawalan Publikasi & Sertifikasi",
        desc: "Pemantauan masa pengumuman 2 (dua) bulan untuk hak sanggahan pihak ketiga hingga penyelesaian sertifikat hak merek.",
      },
    ],
    deliverables: [
      "Laporan Hasil Penelusuran Merek (Search Clearance Report)",
      "Bukti Tanda Terima Permohonan Resmi DJKI",
      "Monitoring berkala tahapan pemeriksaan substantif",
      "Salinan resmi Sertifikat Merek Terdaftar",
    ],
    disclaimer:
      "Pernyataan Redaksi: Keputusan penerbitan sertifikat merek merupakan kewenangan mutlak Direktorat Jenderal Kekayaan Intelektual Kementerian Hukum RI berdasarkan hasil pemeriksaan formalitas dan substantif. Layanan ini merupakan pendampingan persiapan administratif dan penelaahan kepatuhan hukum.",
    imageSrc: "/images/photos/trademark-branding.jpg",
    imageCredit: "Unsplash / Patrik Michalicka",
  },
  {
    key: "kekayaan-intelektual",
    slug: "kekayaan-intelektual",
    title: "Kekayaan Intelektual",
    categoryName: "Hak Kekayaan Intelektual (HKI)",
    headline: "Perlindungan Komprehensif Hak Kekayaan Intelektual (KI/HKI)",
    tagline: "Kepastian Hukum atas Hak Cipta, Paten, Desain Industri, dan Rahasia Dagang",
    description:
      "Perlindungan komprehensif aset inovasi dan karya kreatif mencakup hak cipta, paten teknologi, desain industri, indikasi geografis, dan rahasia dagang demi mengamankan keunggulan kompetitif bisnis.",
    longDescription: [
      "Aset tak berwujud (intangible assets) merupakan modal strategis terpenting bagi pertumbuhan ekonomi kreatif dan industri manufaktur modern. Tanpa perlindungan hukum yang sah, inovasi teknologi dan karya cipta rentan terhadap pembajakan dan peniruan tanpa hak.",
      "The Law Times memfasilitasi pendampingan konsultatif perlindungan seluruh rumpun kekayaan intelektual sesuai kerangka hukum nasional (UU Hak Cipta No. 28/2014, UU Paten No. 13/2016 jo. UU Cipta Kerja, dan UU Desain Industri No. 31/2000).",
      "Setiap permohonan ditelaah secara teliti untuk menentukan rezim perlindungan yang paling optimal bagi portofolio bisnis Anda.",
    ],
    scopes: [
      "Hak Cipta (pencatatan karya tulis, seni, sinematografi, dan program komputer)",
      "Paten (invensi teknologi, formulasi kimia, dan proses manufaktur)",
      "Paten Sederhana (pengembangan alat, mekanisme praktis, atau produk fisik)",
      "Desain Industri (estetika kreasi bentuk 3D, konfigurasi, atau komposisi garis/warna)",
      "Indikasi Geografis (komoditas khas wilayah)",
      "Rahasia Dagang (perlindungan informasi bisnis bernilai komersial rahasia)",
      "Desain Tata Letak Sirkuit Terpadu (DTLST)",
    ],
    processSteps: [
      {
        title: "1. Identifikasi Rezim Perlindungan",
        desc: "Penentuan apakah objek inovasi memenuhi syarat kebaruan paten, orisinalitas hak cipta, atau unsur desain industri.",
      },
      {
        title: "2. Penelusuran Paten & Desain",
        desc: "Pemeriksaan dokumen prior art internasional dan nasional guna memastikan asas kebaruan (novelty).",
      },
      {
        title: "3. Drafting Deskripsi & Klaim",
        desc: "Penyusunan naskah spesifikasi paten (klaim, deskripsi, abstrak) dan gambar teknik desain industri yang terstandarisasi.",
      },
      {
        title: "4. Pengajuan & Registrasi Statutori",
        desc: "Penyampaian berkas ke DJKI serta pemantauan tahapan publikasi dan pemeriksaan substantif.",
      },
    ],
    deliverables: [
      "Surat Pencatatan Hak Cipta Resmi DJKI (dengan barcode e-HakCipta)",
      "Dokumen Spesifikasi Paten Terstandar & Bukti Permohonan",
      "Sertifikat Desain Industri Resmi",
      "Dokumen Perjanjian Kerahasiaan (Non-Disclosure Agreement) untuk Rahasia Dagang",
    ],
    disclaimer:
      "Pernyataan Redaksi: Pemberian hak paten dan desain industri bergantung sepenuhnya pada hasil pemeriksaan substantif DJKI terkait kebaruan dan langkah inventif. Layanan ini berfokus pada pendampingan hukum dan penyusunan berkas administratif.",
    imageSrc: "/images/photos/ai-technology.jpg",
    imageCredit: "Unsplash / Milad Fakurian",
  },
  {
    key: "perizinan-bpom",
    slug: "perizinan-bpom",
    title: "Perizinan BPOM",
    categoryName: "Regulasi & Izin Edar Produk",
    headline: "Pendampingan Izin Edar Badan Pengawas Obat dan Makanan (BPOM)",
    tagline: "Kepatuhan Standar Keamanan Produk Pangan, Kosmetik, Obat Tradisional, dan Suplemen",
    description:
      "Pendampingan menyeluruh proses registrasi dan pemenuhan standar regulasi BPOM agar produk Anda legal diedarkan dan diperdagangkan secara aman di pasar Indonesia.",
    longDescription: [
      "Setiap produk pangan olahan dalam kemasan, kosmetik, obat bahan alam, dan suplemen kesehatan yang diedarkan di wilayah Indonesia wajib memiliki Izin Edar resmi dari Badan Pengawas Obat dan Makanan (BPOM). Peredaran produk tanpa izin edar dapat dikenakan sanksi pidana dan penarikan produk dari pasar.",
      "The Law Times memberikan pendampingan terstruktur dalam mengidentifikasi kategori registrasi yang tepat (misalnya registrasi BPOM MD untuk pangan dalam negeri, notifikasi kosmetik, atau izin edar suplemen).",
      "Kami membantu memverifikasi kesesuaian formula, naskah penandaan/label produk, klaim keamanan, dan kesiapan fasilitas produksi pemohon sesuai prinsip CPPOB/CPKB.",
    ],
    scopes: [
      "Konsultasi kategori produk dan evaluasi formula",
      "Persiapan dokumen teknis dan pengujian laboratorium terakreditasi",
      "Pendampingan registrasi pangan olahan (BPOM MD / ML)",
      "Pendampingan registrasi kosmetik (Notifikasi BPOM NA)",
      "Pendampingan registrasi obat tradisional dan herbal (BPOM TR)",
      "Pendampingan registrasi suplemen kesehatan",
    ],
    processSteps: [
      {
        title: "1. Audit Formulir & Komposisi",
        desc: "Pemeriksaan kesesuaian bahan baku, batas cemaran, dan kelayakan klaim khasiat sesuai peraturan BPOM terbaru.",
      },
      {
        title: "2. Verifikasi Fasilitas (PSAT/CPPOB/CPKB)",
        desc: "Pendampingan kesiapan izin penerapan cara produksi yang baik sebagai prasyarat akun registrasi perusahaan.",
      },
      {
        title: "3. Pendaftaran Akun & Pengajuan Produk",
        desc: "Pengunggahan dokumen legalitas, sertifikat analisis (CoA), dan desain kemasan pada portal resmi e-BPOM.",
      },
      {
        title: "4. Penerbitan Nomor Notifikasi / Izin Edar",
        desc: "Pengawalan klarifikasi teknis (evaluasi) hingga diterbitkannya Nomor Izin Edar (NIE) resmi.",
      },
    ],
    deliverables: [
      "Review Matriks Kepatuhan Formula & Label Produk",
      "Akun Perusahaan Terverifikasi pada Portal BPOM",
      "Surat Keputusan Izin Edar / Nomor Notifikasi Resmi BPOM",
    ],
    disclaimer:
      "Pernyataan Redaksi: Persetujuan Izin Edar merupakan kewenangan penuh Badan Pengawas Obat dan Makanan (BPOM) Republik Indonesia berdasarkan uji laboratorium dan telaah ilmiah. Layanan The Law Times adalah pendampingan persiapan kepatuhan hukum dan administratif.",
    imageSrc: "/images/photos/commercial-product.jpg",
    imageCredit: "Unsplash / Adrian Sulyok",
  },
  {
    key: "pendampingan-hukum",
    slug: "pendampingan-hukum",
    title: "Pendampingan Hukum",
    categoryName: "Corporate & Dispute Services",
    headline: "Layanan Konsultasi & Pendampingan Hukum Bisnis",
    tagline: "Mitigasi Risiko Kontrak, Penyelesaian Sengketa, dan Perlindungan Kepentingan Korporasi",
    description:
      "Akses pendampingan hukum terstruktur bagi para pelaku usaha, direksi, dan individu dalam penelaahan kontrak bisnis, mitigasi risiko sengketa perdata, serta pemenuhan kebutuhan hukum operasional.",
    longDescription: [
      "Dalam dinamika aktivitas bisnis yang serba cepat, kepastian klausul kontrak dan kepatuhan hukum merupakan benteng utama kelangsungan usaha. Perjanjian yang multitafsir atau ketidakpatuhan terhadap regulasi sektoral dapat berujung pada sengketa hukum berkepanjangan dan kerugian finansial yang signifikan.",
      "The Law Times menghubungkan Anda dengan layanan pendampingan hukum profesional untuk memastikan setiap instrumen perikatan bisnis memiliki kekuatan pembuktian yang kokoh, seimbang, dan melindungi hak-hak Anda.",
      "Kami juga membantu penanganan pra-litigasi seperti perancangan somasi resmi serta negosiasi damai (mediasi) demi memitigasi eskalasi perkara ke meja hijau.",
    ],
    scopes: [
      "Konsultasi hukum bisnis dan tata kelola korporasi",
      "Peninjauan dan penyusunan kontrak (legal drafting & contract review)",
      "Penanganan permasalahan hukum perdata dan wanprestasi",
      "Penyelesaian sengketa bisnis komersial",
      "Penyusunan dan pengiriman surat somasi / teguran hukum resmi",
      "Pendampingan penyelesaian sengketa melalui negosiasi & mediasi",
      "Kebutuhan legal operasional dan audit kepatuhan perusahaan",
    ],
    processSteps: [
      {
        title: "1. Pemetaan Kasus & Telaah Dokumen",
        desc: "Pengkajian menyeluruh terhadap dokumen perjanjian, kronologi fakta hukum, dan hak-kewajiban para pihak.",
      },
      {
        title: "2. Pendapat Hukum (Legal Opinion)",
        desc: "Pemberian analisa yuridis tertulis mengenai posisi hukum, potensi risiko, dan opsi tindakan yang dapat ditempuh.",
      },
      {
        title: "3. Perumusan Klausul & Negosiasi",
        desc: "Penyempurnaan naskah kontrak atau penyusunan langkah responsif (seperti somasi dan jawaban somasi).",
      },
      {
        title: "4. Eksekusi Solusi Hukum",
        desc: "Pendampingan dalam penandatanganan akta perdamaian, penyelesaian administratif, atau langkah pembuktian lanjutan.",
      },
    ],
    deliverables: [
      "Naskah Kontrak Bisnis / Perjanjian Kerja Sama Final",
      "Surat Pendapat Hukum (Legal Opinion Memo)",
      "Dokumen Somasi Resmi dan Berita Acara Mediasi",
    ],
    disclaimer:
      "Pernyataan Redaksi: Informasi dan pendampingan yang disediakan merupakan layanan konsultasi hukum umum dan penelaahan administratif, dan tidak dapat ditafsirkan sebagai jaminan hasil putusan pengadilan atau kemenangan sengketa di lembaga peradilan.",
    imageSrc: "/images/photos/employment-contract.jpg",
    imageCredit: "Unsplash / Wesley Tingey",
  },
  {
    key: "legalitas-usaha",
    slug: "legalitas-usaha",
    title: "Legalitas Usaha",
    categoryName: "Corporate Legal Setup",
    headline: "Pendirian Badan Usaha & Perizinan Berusaha OSS RBA",
    tagline: "Struktur Badan Hukum yang Kokoh, Akta Notaris, NIB, dan Penyesuaian KBLI Resmi",
    description:
      "Solusi pendirian badan usaha PT dan CV, penerbitan NIB berbasis risiko, penentuan klasifikasi KBLI, serta pembaharuan dokumen legalitas korporasi secara aman dan tepat waktu.",
    longDescription: [
      "Mendirikan badan usaha dengan struktur legalitas yang tepat sejak awal merupakan fondasi esensial untuk menarik investasi, membuka rekening bank korporasi, menjalin kemitraan dengan instansi pemerintah, serta membatasi tanggung jawab pribadi para pendiri.",
      "Melalui sistem Online Single Submission Berbasis Risiko (OSS RBA), setiap izin berusaha diklasifikasikan berdasarkan tingkat risiko (Rendah, Menengah Rendah, Menengah Tinggi, dan Tinggi) yang menentukan dokumen standar yang wajib dipenuhi.",
      "The Law Times mendampingi Anda melewati tahapan pendirian akta notaris, pengesahan SK Kemenkumham, penyesuaian kode KBLI yang presisi, hingga penerbitan Nomor Induk Berusaha (NIB) operasional.",
    ],
    scopes: [
      "Pendirian PT (Perseroan Terbatas) Biasa & PT Perorangan",
      "Pendirian CV (Commanditaire Vennootschap)",
      "Pengurusan NIB (Nomor Induk Berusaha) via OSS RBA",
      "Konsultasi penentuan kode KBLI (Klasifikasi Baku Lapangan Usaha)",
      "Pendampingan perizinan berusaha berbasis risiko di OSS",
      "Perubahan data perseroan (perubahan direksi, pemegang saham, modal)",
      "Kelengkapan dokumen dan sertifikat standar operasional usaha",
    ],
    processSteps: [
      {
        title: "1. Pengecekan Nama & Anggaran Dasar",
        desc: "Pengecekan ketersediaan nama perseroan pada AHU Kemenkumham serta penentuan bidang usaha sesuai KBLI.",
      },
      {
        title: "2. Akta Notaris & SK Kemenkumham",
        desc: "Penyusunan akta pendirian di hadapan Notaris rekanan serta penerbitan Surat Keputusan Pengesahan Badan Hukum.",
      },
      {
        title: "3. NPWP Badan & Pendaftaran NIB",
        desc: "Penerbitan NPWP perusahaan dan pendaftaran Nomor Induk Berusaha melalui portal OSS RBA.",
      },
      {
        title: "4. Pemenuhan Sertifikat Standar",
        desc: "Pengurusan izin lanjutan, pernyataan mandiri, atau izin verifikasi teknis sesuai tingkat risiko usaha.",
      },
    ],
    deliverables: [
      "Salinan Akta Pendirian Notaris & SK Pengesahan Kemenkumham",
      "Nomor Pokok Wajib Pajak (NPWP) Badan Usaha",
      "Nomor Induk Berusaha (NIB) beserta Lampiran Perizinan Berusaha",
      "Dokumen Pernyataan Mandiri K3L dan Lingkungan",
    ],
    disclaimer:
      "Pernyataan Redaksi: Waktu penyelesaian dan persetujuan perizinan operasional bergantung pada kelengkapan persyaratan administratif dan verifikasi teknis oleh dinas/kementerian berwenang melalui sistem OSS.",
    imageSrc: "/images/photos/corporate-governance.jpg",
    imageCredit: "Unsplash / Nastuh Abootalebi",
  },
];

export function getLegalServiceBySlug(slug: string): LegalServiceItem | undefined {
  return LEGAL_SERVICES.find((s) => s.slug === slug);
}
