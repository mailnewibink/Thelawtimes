import { Metadata } from "next";
import Link from "next/link";
import { PaperDivider } from "@/components/ui/PaperDivider";
import {
  ShieldCheck,
  Scale,
  FileCheck,
  RotateCcw,
  Lock,
  FileText,
  BadgeAlert,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Redaksi — Standar Integritas, Independensi & Pedoman Publikasi | The Law Times",
  description:
    "Pedoman integritas redaksi The Law Times yang mengatur independensi pemberitaan, verifikasi sumber peradilan, hak jawab, transparansi konten bersponsor, dan perlindungan privasi data.",
};

export default function KebijakanRedaksiPage() {
  const policySections = [
    {
      id: "independensi",
      title: "1. Independensi Redaksi (Editorial Independence)",
      icon: Scale,
      content:
        "The Law Times memegang teguh asas kemandirian dan independensi ruang redaksi (newsroom) dari segala bentuk intervensi eksternal, baik pengaruh komersial, politik, maupun kepentingan pihak berperkara. Dewan redaksi bertanggung jawab secara otonom atas seluruh keputusan penayangan, penyuntingan judul, pemilihan sudut pandang jurnalistik, dan penolakan naskah. Penempatan warta pengumuman atau permohonan publikasi perkara oleh klien tidak memberikan hak kontraktual kepada pihak mana pun untuk mendikte narasi, memanipulasi fakta hukum, atau menghalangi pemberitaan yang berimbang.",
    },
    {
      id: "verifikasi",
      title: "2. Verifikasi Informasi yang Diajukan (Verification Standards)",
      icon: FileCheck,
      content:
        "Setiap permohonan publikasi perkara, warta putusan, penetapan sengketa merek, maupun pengumuman statutori wajib didukung oleh dokumen otentik resmi. Redaksi melakukan verifikasi silang (cross-check) terhadap sistem database institusi negara terkait, antara lain Sistem Informasi Penelusuran Perkara (SIPP) Pengadilan Negeri/Niaga, Direktori Putusan Mahkamah Agung RI, Pangkalan Data Kekayaan Intelektual (PDKI) Ditjen KI, dan JDIH Nasional. Klaim sepihak tanpa dokumen penunjang sah tidak akan diterbitkan.",
    },
    {
      id: "atribusi",
      title: "3. Atribusi Sumber & Dokumen Resmi (Source Attribution)",
      icon: FileText,
      content:
        "Transparansi rujukan merupakan pilar utama The Law Times. Setiap artikel publikasi perkara mencantumkan secara gamblang nomor register perkara resmi, pengadilan atau majelis hakim yang memeriksa, instansi penerbit regulasi, tanggal putusan, serta tautan dokumen publik bila tersedia. Redaksi secara jelas memisahkan antara kutipan fakta putusan pengadilan, pernyataan kuasa hukum pihak berperkara, dan analisis doktrinal akademisi.",
    },
    {
      id: "hak-jawab",
      title: "4. Hak Jawab & Hak Koreksi (Right of Response)",
      icon: RotateCcw,
      content:
        "Sesuai dengan Kode Etik Jurnalistik dan Undang-Undang Pers Republik Indonesia, The Law Times menjamin pemenuhan Hak Jawab dan Hak Koreksi bagi setiap individu, badan hukum, atau pihak yang merasa dirugikan oleh pemberitaan perkara yang ditayangkan. Permohonan Hak Jawab dapat diajukan secara resmi melalui Meja Redaksi dengan menyertakan sanggahan proporsional dan bukti pendukung. Tanggapan yang memenuhi kaidah hukum akan ditayangkan pada artikel terkait guna memelihara asas keberimbangan (cover both sides).",
    },
    {
      id: "ralat",
      title: "5. Ralat & Pembaruan Informasi (Corrections and Updates)",
      icon: HelpCircle,
      content:
        "Perkara hukum bersifat dinamis dan berkembang seiring adanya upaya hukum lanjutan (banding, kasasi, peninjauan kembali, atau perdamaian/dading). Apabila terdapat kekeliruan faktual, salah ketik nomor perkara, atau perkembangan status inkracht terbaru, The Law Times segera mempublikasikan catatan ralat (correction notice) atau pembaruan warta secara transparan pada bagian akhir artikel, tanpa menghapus rekam jejak integritas dokumentasi arsip.",
    },
    {
      id: "privasi",
      title: "6. Privasi & Kerahasiaan Data (Privacy & Confidentiality)",
      icon: Lock,
      content:
        "The Law Times menjaga kerahasiaan identitas dan data pribadi pemohon publikasi (termasuk nomor telepon WhatsApp, dokumen identitas kuasa hukum, dan korespondensi internal redaksi). Dokumen perkara yang diunggah melalui formulir permohonan disimpan dalam peladen tertutup berpengaman (private storage) dan hanya dapat diakses oleh editor yang berwenang. Untuk perkara anak, delik kesusilaan, atau perkara tertutup sesuai instruksi Mahkamah Agung RI, redaksi memberlakukan anonimisasi nama secara ketat.",
    },
    {
      id: "persetujuan",
      title: "7. Mekanisme Persetujuan Dewan Redaksi (Publication Approval)",
      icon: ShieldCheck,
      content:
        "Pengajuan permohonan melalui situs web tidak menciptakan kepastian atau jaminan publikasi langsung. Setiap usulan dinilai secara bertahap: (a) verifikasi administrasi dan keabsahan narahubung; (b) uji silang nomor perkara pada basis data peradilan; (c) penelaahan orisinalitas dan kepatutan hukum; serta (d) persetujuan akhir oleh Pemimpin Redaksi (Editor-in-Chief). Redaksi berhak menolak materi yang berpotensi melanggar hukum, berisiko fitnah, mengandung ujaran kebencian, atau menghina peradilan (contempt of court).",
    },
    {
      id: "konten-sponsor",
      title: "8. Keterbukaan Konten Berbayar & Advokasi (Sponsored Content Disclosure)",
      icon: BadgeAlert,
      content:
        "Seluruh publikasi yang didanai oleh kemitraan komersial, kantor hukum, atau korporasi sponsor (Sponsored Legal Content) wajib mencantumkan label transparansi yang tegas dan jelas kepada pembaca. Konten bersponsor tidak boleh disamarkan sebagai laporan investigasi independen The Law Times dan wajib mematuhi standar kebenaran fakta yang sama. Pemasangan konten sponsor tidak memengaruhi sikap kritis dan independensi redaksi atas isu hukum terkait.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Page Header */}
      <header className="border-b-[3px] border-ink pb-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="kicker text-accent text-xs font-bold uppercase tracking-[0.2em]">
            Standar Tata Kelola & Integritas Pers Hukum
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold uppercase text-ink">
          Kebijakan Redaksi
        </h1>
        <p className="font-serif text-base sm:text-lg italic text-ink-muted leading-relaxed">
          Prinsip dasar tata kelola pemberitaan, verifikasi perkara peradilan, hak jawab, dan etika
          publikasi informasi hukum di The Law Times.
        </p>
      </header>

      {/* Crucial Legal Disclaimer Alert */}
      <div className="border-2 border-ink bg-paper-light p-6 space-y-3">
        <div className="flex items-center gap-2 text-ink font-bold uppercase kicker text-xs tracking-wider">
          <ShieldAlert className="w-5 h-5 text-accent" />
          <span>Penafian Hukum Penting (Legal Disclaimer)</span>
        </div>
        <div className="font-serif text-xs sm:text-sm text-ink-soft leading-relaxed space-y-2">
          <p>
            The Law Times adalah media warta dan dokumentasi hukum independen. Seluruh isi publikasi
            perkara, artikel ulasan putusan, regulasi, dan opini hukum yang dimuat pada media ini
            disajikan semata-mata untuk tujuan <strong>keterbukaan informasi publik dan edukasi hukum</strong>.
          </p>
          <p>
            Publikasi warta di The Law Times <strong>bukan merupakan nasihat hukum (legal advice)</strong>,
            pendapat hukum mengikat, maupun jaminan atas hasil akhir dari proses penanganan perkara di
            pengadilan. The Law Times tidak mengklaim sertifikasi khusus, otoritas peradilan, atau afiliasi
            kelembagaan resmi yang tidak dimiliki.
          </p>
        </div>
      </div>

      {/* 8 Policy Pillars */}
      <div className="space-y-8">
        {policySections.map((sec) => {
          const Icon = sec.icon;
          return (
            <section
              key={sec.id}
              id={sec.id}
              className="border border-rule bg-paper p-6 space-y-3 hover:border-ink transition-colors"
            >
              <div className="flex items-center gap-2.5 border-b border-rule pb-2 text-ink">
                <Icon className="w-5 h-5 text-accent shrink-0" />
                <h2 className="font-serif font-bold text-lg sm:text-xl">
                  {sec.title}
                </h2>
              </div>
              <p className="font-serif text-xs sm:text-sm leading-relaxed text-ink-soft">
                {sec.content}
              </p>
            </section>
          );
        })}
      </div>

      <PaperDivider variant="ornament" />

      {/* Submission CTA Footnote */}
      <div className="border border-ink bg-paper-dark/20 p-6 text-center space-y-3">
        <h3 className="font-serif font-bold text-base text-ink">
          Ingin Mengajukan Publikasi Perkara Resmi?
        </h3>
        <p className="font-serif text-xs text-ink-muted max-w-xl mx-auto leading-relaxed">
          Kuasa hukum, kurator, advokat, dan perusahaan dapat mengajukan berkas usulan publikasi perkara
          secara langsung untuk diverifikasi oleh Dewan Redaksi.
        </p>
        <div className="pt-2">
          <Link
            href="/publikasi-perkara"
            className="inline-flex items-center gap-2 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink px-5 py-2 text-xs font-sans font-bold tracking-[0.14em] uppercase transition-colors"
          >
            <span>Kunjungi Layanan Publikasi Perkara</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
