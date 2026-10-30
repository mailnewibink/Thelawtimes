import Link from "next/link";
import type { Article, Announcement, CaseRecord } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, Scale } from "lucide-react";

interface CategorySidebarProps {
  title?: string;
  selectedStories?: Article[];
  announcements?: Announcement[];
  cases?: CaseRecord[];
  clientSupportNotice?: boolean;
}

export function CategorySidebar({
  title = "PILIHAN REDAKSI",
  selectedStories = [],
  announcements = [],
  cases = [],
  clientSupportNotice = true,
}: CategorySidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Selected Stories List */}
      {selectedStories.length > 0 && (
        <div className="border border-rule p-4 bg-paper-light/40">
          <div className="border-b-2 border-ink pb-1.5 mb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-ink">
              {title}
            </h3>
            <span className="font-serif text-xs text-ink-muted">✱</span>
          </div>

          <div className="divide-y divide-rule-soft">
            {selectedStories.map((story, idx) => (
              <div key={story.id} className="py-3 first:pt-0 last:pb-0 group">
                <div className="flex items-start gap-3">
                  <span className="font-serif text-base font-bold text-ink-muted/60 shrink-0 w-5">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-sans text-[0.5625rem] font-bold uppercase tracking-wider text-accent">
                        {story.category || "HUKUM"}
                      </span>
                      <span className="text-rule text-[0.625rem]">•</span>
                      <time className="font-sans text-[0.5625rem] text-ink-muted uppercase">
                        {formatDate(story.publishedAt, "short")}
                      </time>
                    </div>

                    <h4 className="font-serif text-xs sm:text-sm font-bold text-ink leading-snug group-hover:underline">
                      <Link href={`/artikel/${story.slug}`}>
                        {story.headline}
                      </Link>
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Case and Court Decision Archives (If provided) */}
      {cases.length > 0 && (
        <div className="border border-rule p-4 bg-paper">
          <div className="border-b border-ink pb-1.5 mb-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-accent" />
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-ink">
              Arsip Putusan & Direktori Kasus
            </h3>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 4).map((c) => (
              <div key={c.id} className="text-xs border-b border-rule-soft/60 pb-2.5 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between text-[0.625rem] text-ink-muted uppercase mb-0.5">
                  <span className="font-semibold text-ink">{c.archiveId}</span>
                  <span>{c.year}</span>
                </div>
                <h5 className="font-serif font-bold text-ink leading-tight hover:underline">
                  <Link href={`/case-archive/${c.slug}`}>
                    {c.title}
                  </Link>
                </h5>
                <p className="font-serif text-[0.6875rem] text-ink-muted mt-0.5 line-clamp-1">
                  Kategori: {c.category}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/case-archive"
            className="mt-3 block text-center border-t border-rule pt-2 text-[0.625rem] font-sans uppercase font-bold tracking-wider text-ink hover:underline"
          >
            Buka Direktori Lengkap Putusan →
          </Link>
        </div>
      )}

      {/* Official Announcements widget (If provided) */}
      {announcements.length > 0 && (
        <div className="border border-rule p-4 bg-paper-dark/20">
          <div className="border-b border-ink pb-1.5 mb-3">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-ink">
              Warta Pengumuman Resmi
            </h3>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="text-xs border-b border-rule-soft pb-2 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between text-[0.625rem] text-ink-muted uppercase mb-0.5">
                  <span className="font-bold text-accent">{ann.type}</span>
                  <span>{formatDate(ann.publishedAt, "short")}</span>
                </div>
                <h5 className="font-serif font-bold text-ink leading-tight">
                  <Link href={`/announcements`} className="hover:underline">
                    {ann.title}
                  </Link>
                </h5>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Publication Callout Notice */}
      {clientSupportNotice && (
        <div className="border border-ink bg-paper-light p-4 text-xs text-ink-soft space-y-2">
          <div className="flex items-center gap-1.5 text-ink font-bold uppercase tracking-wider text-[0.6875rem] border-b border-rule pb-1">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Keterbukaan Publikasi Resmi</span>
          </div>
          <p className="font-serif leading-relaxed text-[0.6875rem]">
            Publikasi perkara, warta peringatan merek terdaftar, serta pengumuman kepailitan/PKPU yang dimuat pada edisi ini diverifikasi secara ketat melalui dokumen putusan pengadilan dan kuasa hukum berwenang.
          </p>
          <div className="pt-1 text-[0.625rem] font-sans uppercase tracking-wider text-ink-muted flex items-center justify-between">
            <span>Dewan Redaksi Hukum</span>
            <span>Est. 2026</span>
          </div>
        </div>
      )}
    </aside>
  );
}
