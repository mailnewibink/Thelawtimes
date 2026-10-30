import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import {
  Mail,
  MapPin,
  FileText,
  Scale,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak Redaksi & Layanan Publikasi | The Law Times",
  description:
    "Informasi kontak resmi dewan redaksi The Law Times, meja publikasi perkara hukum, permohonan hak jawab, dan klarifikasi dokumentasi peradilan.",
};

export default function ContactPage() {
  const editorialDesks = [
    {
      title: "Meja Publikasi Perkara & Klien",
      description:
        "Saluran resmi penerimaan usulan warta perkara perdata, permohonan kepailitan/PKPU, pengumuman putusan pengadilan, dan pendaftaran sengketa merek.",
      actionLabel: "Buka Formulir Publikasi Perkara",
      actionHref: "/publikasi-perkara",
      icon: Scale,
    },
    {
      title: "Meja Hak Jawab & Klarifikasi Redaksi",
      description:
        "Layanan penerimaan permohonan Hak Jawab dan Hak Koreksi terhadap artikel atau pengumuman hukum yang dimuat sesuai Kode Etik Jurnalistik.",
      actionLabel: "Pelajari Kebijakan Hak Jawab",
      actionHref: "/kebijakan-redaksi#hak-jawab",
      icon: RotateCcw,
    },
    {
      title: "Meja Redaksi Umum & Tata Kelola",
      description:
        "Korespondensi redaksional mengenai kerjasama pertukaran informasi hukum, agregasi data warta resmi, dan kemitraan lembaga akademik.",
      actionLabel: "Tentang The Law Times",
      actionHref: "/tentang-kami",
      icon: FileText,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Header */}
      <header className="border-b-[3px] border-ink pb-6 space-y-2 text-center">
        <p className="kicker text-accent text-xs font-bold uppercase tracking-[0.24em]">
          Komunikasi & Hubungan Eksternal
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold uppercase text-ink">
          Kontak Redaksi
        </h1>
        <p className="font-serif text-base sm:text-lg italic text-ink-muted max-w-2xl mx-auto leading-relaxed">
          Kanal komunikasi resmi ruang redaksi, meja publikasi perkara, dan bagian arsip dokumentasi The Law Times.
        </p>
      </header>

      {/* Main Office Details */}
      <div className="border border-ink bg-paper-light p-6 sm:p-8 space-y-6">
        <div className="border-b border-rule pb-3 flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-ink">
            Pusat Operasional Redaksi
          </h2>
          <span className="font-sans text-[0.6875rem] kicker uppercase text-ink-muted">
            Republik Indonesia
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-serif text-xs sm:text-sm text-ink-soft">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-1" />
              <div>
                <strong className="block text-ink font-sans uppercase text-[0.6875rem] kicker">
                  Lokasi Penerbitan
                </strong>
                <span>{siteConfig.location}, Republik Indonesia</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-accent shrink-0 mt-1" />
              <div>
                <strong className="block text-ink font-sans uppercase text-[0.6875rem] kicker">
                  Alamat Surat Elektronik Korespondensi
                </strong>
                <span className="font-mono text-xs text-ink">
                  redaksi@thelawtimes.id
                </span>
                <span className="block text-[0.6875rem] text-ink-muted italic mt-0.5">
                  (Khusus korespondensi redaksional dan verifikasi putusan)
                </span>
              </div>
            </div>
          </div>

          <div className="border-l-0 md:border-l border-rule pl-0 md:pl-6 space-y-2">
            <strong className="block text-ink font-sans uppercase text-[0.6875rem] kicker">
              Standar Korespondensi Resmi
            </strong>
            <p className="text-xs leading-relaxed text-ink-muted">
              Seluruh permohonan publikasi perkara, salinan putusan, atau relaas sidang wajib diajukan
              secara tertulis melalui formulir sistem verifikasi The Law Times untuk memastikan
              keotentikan berkas dan ketercatatan nomor registrasi.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Dedicated Desks Cards */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-base text-ink border-b border-ink pb-2">
          Saluran Komunikasi Berdasarkan Urusan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editorialDesks.map((desk) => {
            const Icon = desk.icon;
            return (
              <div
                key={desk.title}
                className="border border-rule bg-paper p-5 space-y-4 flex flex-col justify-between hover:border-ink transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="p-2 bg-paper-dark border border-rule w-fit text-ink">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-ink">
                    {desk.title}
                  </h4>
                  <p className="font-serif text-xs text-ink-soft leading-relaxed">
                    {desk.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-rule/60">
                  <Link
                    href={desk.actionHref}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-ink hover:text-accent uppercase tracking-wider transition-colors"
                  >
                    <span>{desk.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advisory Notice */}
      <div className="border-y border-rule py-4 px-2 text-center text-xs font-serif text-ink-muted italic">
        Catatan Redaksi: The Law Times tidak melayani konsultasi hukum privat atau bantuan hukum perorangan. Untuk keperluan litigasi, silakan menghubungi kantor advokat atau Lembaga Bantuan Hukum (LBH) terakreditasi.
      </div>
    </div>
  );
}
