import type { Metadata } from "next";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { Scale, ShieldCheck, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami — The Law Times",
  description:
    "Profil editorial, saluran publikasi perkara hukum klien, standar integritas faktual, dan misi jurnalisme The Law Times.",
};

export default function TentangKamiPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Profil Media & Saluran Publikasi</p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-ink mb-3">
          Tentang The Law Times
        </h1>
        <p className="font-serif text-lg italic text-ink-muted leading-relaxed">
          Publikasi berita hukum dan lembaran broadsheet digital terverifikasi yang melayani saluran
          resmi pengumuman hukum perkara klien, sengketa hak kekayaan intelektual, dan analisis peradilan nasional.
        </p>
      </header>

      <div className="prose-news text-ink-soft space-y-6">
        <section className="space-y-3">
          <h2 className="kicker text-sm text-ink border-b border-rule pb-1 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-accent" />
            <span>Fungsi Ganda & Posisi Produk</span>
          </h2>
          <p className="font-serif text-sm sm:text-base leading-relaxed">
            The Law Times hadir dengan dua fungsi utama yang terintegrasi secara profesional dan transparan:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="border border-rule p-4 bg-paper-dark/20 space-y-2">
              <span className="kicker text-[0.7rem] uppercase text-accent font-bold block">
                A. Publikasi Perkara & Klien
              </span>
              <p className="text-xs text-ink-muted leading-relaxed">
                Saluran pengumuman resmi berkekuatan hukum, mencakup keterbukaan amar putusan pengadilan,
                sengketa merek dagang dan HKI, panggilan sidang resmi, rencana homologasi PKPU, dan pernyataan
                keterbukaan hukum klien yang berwenang dipublikasikan kepada publik.
              </p>
            </div>
            <div className="border border-rule p-4 bg-paper-dark/20 space-y-2">
              <span className="kicker text-[0.7rem] uppercase text-ink font-bold block">
                B. Warta Berita Hukum Umum
              </span>
              <p className="text-xs text-ink-muted leading-relaxed">
                Pelaporan jurnalisme hukum yang objektif dan berimbang mencakup putusan penting Mahkamah Agung,
                perkembangan profesi advokat, pantauan ketetapan regulasi pemerintah, serta kajian yurisprudensi.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="kicker text-sm text-ink border-b border-rule pb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Transparansi Label & Pemisahan Redaksional</span>
          </h2>
          <p className="font-serif text-sm sm:text-base leading-relaxed">
            Setiap publikasi perkara klien secara tegas ditandai dengan label{" "}
            <strong>&ldquo;Publikasi Khusus Klien&rdquo;</strong> sehingga pembaca dapat dengan mudah membedakan
            antara pengumuman hukum resmi yang diterbitkan atas permohonan pihak terkait dengan laporan berita
            redaksi independen.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
            Verifikasi Sumber Resmi & Dokumen Pendukung
          </h2>
          <p className="font-serif text-sm sm:text-base leading-relaxed">
            Setiap laporan yang dipublikasikan di The Law Times mencantumkan rujukan sumber primer,
            seperti nomor registrasi putusan pengadilan, lembaran negara resmi, atau dokumen penetapan instansi
            pemerintah terkait yang dapat diverifikasi oleh pembaca.
          </p>
        </section>

        <PaperDivider variant="double" />

        <section className="space-y-3">
          <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
            Kantor Redaksi & Layanan Publikasi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif">
            <div className="space-y-1">
              <span className="kicker text-[0.65rem] text-ink-muted uppercase block">Alamat Redaksi</span>
              <p className="flex items-start gap-1.5 text-ink">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span>Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="kicker text-[0.65rem] text-ink-muted uppercase block">Kontak & Publikasi Perkara</span>
              <p className="flex items-center gap-1.5 text-ink">
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>redaksi@thelawtimes.id</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
