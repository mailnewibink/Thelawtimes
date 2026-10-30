import type { Announcement } from "@/types/content";
import { DEMO_PROVENANCE } from "./helpers";

/**
 * PENGUMUMAN STATUTORI & LEMBARAN RESMI THE LAW TIMES.
 */
const demoNoticeBody = (jenis: string, rincian: string): string[] => [
  `JAKARTA — Berdasarkan ketentuan hukum acara dan peraturan perundang-undangan yang berlaku di Republik Indonesia, disampaikan ${jenis} resmi sebagai berikut:`,
  rincian,
  "Pengumuman ini ditayangkan sebagai bentuk kepatuhan terhadap asas transparansi statutori dan pemenuhan tenggat waktu pemberitahuan resmi kepada para pihak yang berkepentingan.",
  "Bagi pihak-pihak yang berkepentingan dapat menghubungi narahubung kepaniteraan pengadilan atau tim kurator/likuidator terkait melalui saluran resmi yang tertera.",
];

export const demoAnnouncements: Announcement[] = [
  {
    id: "ann-001",
    slug: "relaas-panggilan-sidang-pertama-gugatan-perdata",
    title: "Relaas Panggilan Sidang Pertama: Perkara Gugatan Perdata Ganti Rugi Komersial",
    type: "Court Summons Notice",
    summary:
      "Panggilan resmi dari Pengadilan Negeri Jakarta Pusat kepada Tergugat II yang tempat tinggalnya tidak diketahui secara pasti di wilayah Republik Indonesia.",
    body: demoNoticeBody(
      "panggilan sidang statutori",
      "Panggilan kepada Tergugat II untuk hadir pada sidang hari Kamis, 19 November 2026 pukul 10.00 WIB di Pengadilan Negeri Jakarta Pusat Jalan Bungur Besar Raya No. 24, dalam Perkara Perdata No. 341/Pdt.G/2026/PN.Jkt.Pst."
    ),
    publishedAt: "2026-10-28",
    relatedParty: "Pengadilan Negeri Jakarta Pusat",
    document: { label: "Salinan Relaas Panggilan Resmi (PDF)", url: null },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "ann-002",
    slug: "panggilan-rapat-kreditor-verifikasi-piutang-pkpu",
    title: "Panggilan Rapat Kreditor Pertama & Pencocokan Piutang: Perkara PKPU Tetap",
    type: "Public Notice",
    summary:
      "Tim Pengurus mengundang seluruh kreditor konkuren, preferen, dan separatis untuk menghadiri sidang pencocokan piutang pada Pengadilan Niaga.",
    body: demoNoticeBody(
      "pengumuman kepengurusan PKPU",
      "Berdasarkan Putusan Pengadilan Niaga Jakarta Pusat No. 89/Pdt.Sus-PKPU/2026/PN.Niaga.Jkt.Pst, rapat verifikasi tagihan dan batas akhir pendaftaran tagihan piutang ditetapkan pada tanggal 24 November 2026 di Ruang Sidang Pengadilan Niaga."
    ),
    publishedAt: "2026-10-27",
    relatedParty: "Tim Pengurus PKPU Terdaftar",
    document: { label: "Pengumuman Koran Resmi Kepailitan (PDF)", url: null },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "ann-003",
    slug: "pengumuman-rencana-rupslb-perseroan-terbatas",
    title: "Pengumuman Rencana Rapat Umum Pemegang Saham Luar Biasa (RUPSLB) Perseroan Terbatas",
    type: "Corporate Notice",
    summary:
      "Direksi menyampaikan pemanggilan resmi RUPSLB mengenai persetujuan restrukturisasi permodalan dan perubahan anggaran dasar perseroan.",
    body: demoNoticeBody(
      "pemanggilan rapat korporasi",
      "Direksi Perseroan dengan ini mengundang para pemegang saham untuk menghadiri RUPSLB yang akan diselenggarakan pada tanggal 30 November 2026 bertempat di Financial Club Jakarta, dengan agenda persetujuan penambahan modal ditempatkan dan disetor."
    ),
    publishedAt: "2026-10-25",
    relatedParty: "Direksi PT Multi Niaga Internasional",
    document: { label: "Naskah Pemanggilan RUPSLB (PDF)", url: null },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "ann-004",
    slug: "pengumuman-penghapusan-hak-tanggungan-roya",
    title: "Pemberitahuan Pelaksanaan Pencoretan Hak Tanggungan (Roya) Sertifikat Tanah",
    type: "Public Notice",
    summary:
      "Pemberitahuan kepada publik mengenai pemenuhan kewajiban pelunasan utang debitur dan pelaksanaan permohonan roya pada Kantor Pertanahan.",
    body: demoNoticeBody(
      "pemberitahuan pencoretan hak tanggungan",
      "Diberitahukan bahwa fasilitas kredit atas Sertifikat Hak Milik No. 1284/Kel. Kebayoran Baru telah dinyatakan lunas dan proses pencoretan beban Hak Tanggungan sedang didaftarkan pada Kantor Pertanahan Kota Administrasi Jakarta Selatan."
    ),
    publishedAt: "2026-10-22",
    relatedParty: "Kantor Notaris & PPAT Rekanan",
    document: { label: "Keterangan Lunas Bank & Akta Roya", url: null },
    provenance: DEMO_PROVENANCE,
  },
];
