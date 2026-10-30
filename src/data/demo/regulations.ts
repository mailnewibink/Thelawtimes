import type { Regulation } from "@/types/content";
import { DEMO_PROVENANCE } from "./helpers";

/**
 * 5 REGULASI AKTUAL DARI SUMBER JDIH RESMI
 * Terverifikasi dari JDIH Nasional, JDIH Kominfo, JDIH Mahkamah Agung, dan JDIH OJK.
 */
export const demoRegulations: Regulation[] = [
  {
    id: "reg-real-001",
    slug: "undang-undang-nomor-1-tahun-2023-kuhp",
    title: "Undang-Undang Republik Indonesia Nomor 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana",
    type: "Law",
    number: "1",
    year: 2023,
    issuingInstitution: "Presiden RI & Dewan Perwakilan Rakyat RI",
    publishedAt: "2023-01-02",
    effectiveDate: "2026-01-02",
    status: "In Force",
    summary:
      "Kodifikasi hukum pidana nasional materiil yang menggantikan Wetboek van Strafrecht (WvS) warisan kolonial. Memuat prinsip pidana modern, keadilan restoratif (restorative justice), pengakuan hukum yang hidup dalam masyarakat (living law), serta pidana kerja sosial dan pengawasan sebagai alternatif pidana penjara. Catatan perubahan: Pasal 240 dan 241 telah dinyatakan inkonstitusional bersyarat oleh Mahkamah Konstitusi melalui Putusan No. 282/PUU-XXIII/2025.",
    body: [
      "JAKARTA — Undang-Undang Nomor 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana (KUHP Nasional) diundangkan pada Lembaran Negara Republik Indonesia Tahun 2023 Nomor 1 dan Tambahan Lembaran Negara Nomor 6842 pada tanggal 2 Januari 2023.",
      "Berdasarkan Pasal 624, undang-undang ini mulai berlaku 3 (tiga) tahun terhitung sejak tanggal diundangkan, yaitu pada tanggal 2 Januari 2026, guna memberikan masa transisi yang memadai bagi aparat penegak hukum dan institusi peradilan.",
      "KUHP Nasional memperkenalkan pergeseran paradigma hukum pidana dari retributif (pembalasan) menuju keadilan korektif, restoratif, dan rehabilitatif. UU ini juga memuat ketentuan pidana korporasi dan pedoman pemidanaan terukur.",
      "Teks salinan lembaran resmi dapat diakses dan diunduh langsung melalui pangkalan data JDIH Nasional Kementerian Hukum dan HAM RI.",
    ],
    source: {
      label: "Lembaran Negara Republik Indonesia Tahun 2023 Nomor 1",
      publisher: "JDIH Nasional / Kementerian Hukum RI",
      url: "https://peraturan.go.id/id/uu-no-1-tahun-2023",
      accessedOn: "2026-10-30",
    },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "reg-real-002",
    slug: "undang-undang-nomor-27-tahun-2022-pelindungan-data-pribadi",
    title: "Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)",
    type: "Law",
    number: "27",
    year: 2022,
    issuingInstitution: "Presiden RI & Dewan Perwakilan Rakyat RI",
    publishedAt: "2022-10-17",
    effectiveDate: "2024-10-17",
    status: "In Force",
    summary:
      "Payung hukum perlindungan data pribadi komprehensif pertama di Indonesia. Mengatur hak subjek data, kewajiban pengendali data (data controller) dan prosesor data, penunjukan Pejabat Perlindungan Data (DPO), transfer data lintas batas negara, serta sanksi administratif dan pidana atas kebocoran data pribadi korporasi.",
    body: [
      "JAKARTA — Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) disahkan dan diundangkan pada tanggal 17 Oktober 2022 dalam Lembaran Negara Republik Indonesia Tahun 2022 Nomor 196.",
      "Masa penyesuaian (transisi) kepatuhan selama 2 (dua) tahun yang diatur dalam Pasal 74 telah berakhir pada 17 Oktober 2024, sehingga seluruh ketentuan pemrosesan data pribadi kini berlaku penuh dengan ancaman sanksi denda administratif hingga ganti rugi perdata.",
      "UU PDP membagi data menjadi data pribadi umum dan data pribadi spesifik (data biometrik, rekam medis, data keuangan pribadi, dan data anak). Setiap pemrosesan wajib memiliki dasar hukum yang sah (lawful basis) seperti persetujuan eksplisit dari pemilik data.",
    ],
    source: {
      label: "Lembaran Negara Republik Indonesia Tahun 2022 Nomor 196",
      publisher: "JDIH Kementerian Komunikasi dan Informatika RI",
      url: "https://jdih.kominfo.go.id/produk_hukum/view/id/838/t/undangundang+nomor+27+tahun+2022+tanggal+17+oktober+2022",
      accessedOn: "2026-10-30",
    },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "reg-real-003",
    slug: "peraturan-pemerintah-nomor-71-tahun-2019-transaksi-elektronik",
    title: "Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik",
    type: "Government Regulation",
    number: "71",
    year: 2019,
    issuingInstitution: "Presiden Republik Indonesia",
    publishedAt: "2019-10-10",
    effectiveDate: "2019-10-10",
    status: "In Force",
    summary:
      "Peraturan pelaksana utama UU ITE yang mengatur kewajiban pendaftaran Penyelenggara Sistem Elektronik (PSE) lingkup privat dan publik, pengelolaan pusat data (data center), keabsahan tanda tangan elektronik tersertifikasi, dan tata kelola transaksi digital nasional.",
    body: [
      "JAKARTA — Peraturan Pemerintah Nomor 71 Tahun 2019 (PP PSTE) menggantikan PP No. 82 Tahun 2012 untuk menyesuaikan pesatnya perkembangan ekonomi digital dan layanan komputasi awan (cloud computing).",
      "PP ini membedakan kewajiban lokalisasi data antara PSE Lingkup Publik (wajib menempatkan data di wilayah Indonesia) dan PSE Lingkup Privat (diberikan fleksibilitas mengelola data sepanjang memenuhi standar kepatuhan dan akses penegakan hukum).",
      "Selain itu, regulasi ini menjadi rujukan baku verifikasi keabsahan tanda tangan elektronik (TTE) tersertifikasi yang memiliki kekuatan pembuktian sempurna di hadapan pengadilan perdata.",
    ],
    source: {
      label: "Lembaran Negara Republik Indonesia Tahun 2019 Nomor 185",
      publisher: "JDIH Nasional BPHN Kemenkumham RI",
      url: "https://jdihn.go.id/dokumen/peraturan-pemerintah-nomor-71-tahun-2019",
      accessedOn: "2026-10-30",
    },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "reg-real-004",
    slug: "peraturan-mahkamah-agung-nomor-7-tahun-2022-ecourt",
    title: "Peraturan Mahkamah Agung Nomor 7 Tahun 2022 tentang Perubahan Atas Perma No. 1 Tahun 2019 tentang Administrasi Perkara dan Persidangan Elektronik",
    type: "Agency Regulation",
    number: "7",
    year: 2022,
    issuingInstitution: "Mahkamah Agung Republik Indonesia",
    publishedAt: "2022-12-19",
    effectiveDate: "2022-12-19",
    status: "In Force",
    summary:
      "Regulasi peradilan MA yang memperluas dan menyempurnakan administrasi perkara elektronik (e-Court) dan persidangan online (e-Litigation) untuk perkara perdata, perdata agama, tata usaha militer, dan tata usaha negara, termasuk keabsahan panggilan sidang elektronik (e-Summons) ke domisili elektronik para pihak.",
    body: [
      "JAKARTA — Mahkamah Agung menerbitkan Perma No. 7 Tahun 2022 untuk mempertegas landasan hukum modernisasi administrasi peradilan di tingkat pertama, banding, dan kasasi.",
      "Perma ini menetapkan bahwa panggilan sidang yang dikirimkan ke alamat domisili elektronik terverifikasi memiliki kekuatan hukum yang sah dan mengikat tanpa memerlukan pemanggilan langsung oleh jurusita.",
      "Selain itu, pembacaan putusan dilakukan secara elektronik melalui sistem informasi pengadilan dan salinan putusan resmi bertanda tangan digital dapat langsung diunduh para pihak yang berperkara.",
    ],
    source: {
      label: "Berita Negara Republik Indonesia Tahun 2022 Nomor 1303",
      publisher: "JDIH Mahkamah Agung Republik Indonesia",
      url: "https://jdih.mahkamahagung.go.id/peraturan/peraturan-mahkamah-agung-nomor-7-tahun-2022",
      accessedOn: "2026-10-30",
    },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "reg-real-005",
    slug: "pojk-nomor-24-tahun-2025-pengelolaan-rekening-bank-umum",
    title: "Peraturan Otoritas Jasa Keuangan Nomor 24 Tahun 2025 tentang Pengelolaan Rekening pada Bank Umum",
    type: "Agency Regulation",
    number: "24",
    year: 2025,
    issuingInstitution: "Otoritas Jasa Keuangan (OJK)",
    publishedAt: "2025-10-14",
    effectiveDate: "2025-10-14",
    status: "In Force",
    summary:
      "Peraturan OJK terbaru yang menetapkan pedoman tata kelola dan manajemen risiko bank dalam pembukaan, penatausahaan, penutupan rekening nasabah, penanganan rekening pasif (dormant), serta kewajiban deteksi otomatis terhadap rekening penampungan aktivitas transaksi ilegal.",
    body: [
      "JAKARTA — POJK No. 24 Tahun 2025 diterbitkan OJK untuk memperkuat integritas sistem perbankan nasional dan meningkatkan perlindungan konsumen jasa keuangan dari maraknya penyalahgunaan rekening untuk tindak pidana penipuan dan kejahatan siber.",
      "Bank umum diwajibkan melakukan identifikasi dini (profiling) nasabah, menerapkan kriteria rekening dormant secara seragam, serta mengintegrasikan sistem pelaporan dengan Indonesia Anti-Scam Center (IASC).",
      "Ketentuan ini juga mengatur hak nasabah untuk melakukan reaktivasi rekening dormant melalui verifikasi identitas resmi tanpa dikenakan biaya yang memberatkan.",
    ],
    source: {
      label: "Lembaran Peraturan Otoritas Jasa Keuangan Tahun 2025",
      publisher: "JDIH Otoritas Jasa Keuangan",
      url: "https://www.ojk.go.id/id/regulasi/Pages/POJK-tentang-Pengelolaan-Rekening-pada-Bank-Umum.aspx",
      accessedOn: "2026-10-30",
    },
    provenance: DEMO_PROVENANCE,
  },
];
