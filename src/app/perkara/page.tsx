import { Metadata } from "next";
import { getClientPublications, getAnnouncements } from "@/lib/content";
import { EditorialSectionHeader } from "@/components/editorial/EditorialSectionHeader";
import { ArticleListItem } from "@/components/editorial/ArticleListItem";
import { AnnouncementNotice } from "@/components/editorial/AnnouncementNotice";
import { Scale, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Publikasi Perkara Klien & Pengumuman Resmi — The Law Times",
  description:
    "Saluran publikasi resmi perkara hukum klien, amar putusan pengadilan, panggilan sidang, dan pengumuman kepailitan terverifikasi.",
};

export default async function ClientCasePublicationsPage() {
  const [clientArticles, announcements] = await Promise.all([
    getClientPublications(20),
    getAnnouncements(),
  ]);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <EditorialSectionHeader
        title="Publikasi Perkara Klien & Pengumuman Resmi"
        subtitle="Saluran publikasi hukum resmi, warta sengketa, dan keterbukaan putusan pengadilan"
        kicker="Perkara Klien"
      />

      {/* Editorial Transparency Callout */}
      <div className="border border-rule bg-paper-dark/30 p-4 text-xs text-ink-muted flex items-start gap-3">
        <Info className="w-4 h-4 text-ink shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-ink uppercase tracking-wider text-[0.7rem] block mb-0.5">
            Pemberitahuan Transparansi Publikasi
          </strong>
          Halaman ini memuat publikasi perkara dan pengumuman resmi terkait klien The Law Times,
          mencakup amar putusan pengadilan, panggilan sidang resmi, serta keterbukaan sengketa komersial
          yang diterbitkan atas persetujuan para pihak dan otoritas peradilan berwenang.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Client Case Publications (Primary) */}
        <section aria-label="Publikasi Kasus Terkait" className="lg:col-span-8 space-y-6">
          <h2 className="font-serif font-bold text-base text-ink border-b border-rule pb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-accent" />
            <span>Laporan & Putusan Perkara Klien</span>
          </h2>

          <div className="space-y-6">
            {clientArticles.map((art) => (
              <ArticleListItem
                key={art.id}
                article={art}
                showImage
                className="border-b border-rule-soft pb-6"
              />
            ))}
          </div>
        </section>

        {/* Right Column: Court Summons & Official Notices */}
        <aside aria-label="Panggilan Sidang & Berkas" className="lg:col-span-4 space-y-6 lg:border-l lg:border-rule-soft lg:pl-6">
          <h2 className="font-serif font-bold text-base text-ink border-b border-rule pb-2">
            Panggilan Sidang & Lelang
          </h2>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <AnnouncementNotice key={ann.id} announcement={ann} compact />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
