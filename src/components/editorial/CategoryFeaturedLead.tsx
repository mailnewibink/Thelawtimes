import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";

interface CategoryFeaturedLeadProps {
  article: Article;
  badgeLabel?: string;
  showLegalNoticeBox?: boolean;
}

export function CategoryFeaturedLead({
  article,
  badgeLabel = "WARTA UTAMA",
  showLegalNoticeBox = false,
}: CategoryFeaturedLeadProps) {
  return (
    <article className="border border-ink p-4 sm:p-6 bg-paper-light/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Top: Image */}
        {article.image && (
          <figure className="lg:col-span-6 flex flex-col">
            <div className="relative aspect-[16/10] w-full border border-ink bg-paper-dark overflow-hidden">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover engraving"
              />
              <div className="absolute top-2 left-2 bg-ink text-paper text-[0.625rem] font-bold px-2 py-0.5 tracking-wider uppercase">
                {badgeLabel}
              </div>
            </div>
            <figcaption className="mt-2 flex items-center justify-between text-[0.6875rem] text-ink-muted italic flex-wrap gap-1 border-b border-rule/30 pb-1">
              <span>{article.image.caption || article.headline}</span>
              <span className="font-sans text-[0.625rem] not-italic text-ink-muted/90 shrink-0">
                {article.image.credit ? `Sumber: ${article.image.credit} • ` : ""}Gambar hanya ilustrasi
              </span>
            </figcaption>
          </figure>
        )}

        {/* Right / Content */}
        <div className={article.image ? "lg:col-span-6 flex flex-col justify-between" : "lg:col-span-12 flex flex-col justify-between"}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-sans text-[0.6875rem] uppercase tracking-wider font-bold text-accent">
                {article.category || "HUKUM"}
              </span>
              <span className="text-rule font-serif text-xs">•</span>
              <time
                dateTime={article.publishedAt}
                className="font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted"
              >
                {formatDate(article.publishedAt, "long")}
              </time>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-ink mb-3">
              <Link href={`/artikel/${article.slug}`} className="hover:underline decoration-1">
                {article.headline}
              </Link>
            </h2>

            {article.deck && (
              <p className="font-serif text-sm sm:text-base italic text-ink-muted font-medium mb-3 leading-snug">
                {article.deck}
              </p>
            )}

            <p className="font-serif text-sm text-ink-soft leading-relaxed line-clamp-4 mb-4">
              {article.excerpt}
            </p>
          </div>

          <div>
            {/* Boxed Legal Notice preview if requested */}
            {showLegalNoticeBox && (
              <div className="border border-ink/80 bg-paper p-3 mb-4 text-xs">
                <div className="font-sans font-bold text-[0.625rem] uppercase tracking-wider text-ink border-b border-rule pb-1 mb-2">
                  Risalah Perkara & Rujukan Hukum Terkait
                </div>
                <div className="grid grid-cols-2 gap-2 text-[0.6875rem] mb-2 font-serif">
                  <div>
                    <span className="text-ink-muted">Jenis Publikasi:</span>{" "}
                    <strong className="text-ink">Pengumuman & Putusan</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted">Sumber Verifikasi:</span>{" "}
                    <strong className="text-ink">{article.sourceName || "Dokumen Resmi"}</strong>
                  </div>
                </div>
                <p className="text-[0.6875rem] text-ink-muted italic font-serif">
                  Warta diterbitkan atas otorisasi kuasa hukum pemegang hak untuk kepastian hukum masyarakat umum.
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-rule flex items-center justify-between flex-wrap gap-2">
              <span className="font-sans text-xs italic text-ink-muted">
                Oleh {article.byline || "Tim Publikasi Hukum"}
              </span>

              <div className="flex items-center gap-3">
                <Link
                  href={`/artikel/${article.slug}`}
                  className="bg-ink text-paper px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider hover:bg-ink-soft transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Baca Selengkapnya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
