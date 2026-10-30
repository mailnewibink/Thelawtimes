import Image from "next/image";
import { ExternalNewsItem } from "@/data/demo/externalNews";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Rss } from "lucide-react";

interface ExternalNewsSectionProps {
  news: ExternalNewsItem[];
  title?: string;
}

export function ExternalNewsSection({
  news,
  title = "WARTA HUKUM DARI SUMBER EKSTERNAL",
}: ExternalNewsSectionProps) {
  if (news.length === 0) return null;

  return (
    <section aria-label="Warta Eksternal" className="space-y-4">
      {/* Section broadsheet rule & header */}
      <div className="border-t-[3px] border-b border-ink py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rss className="w-4 h-4 text-accent" />
          <h2 className="font-serif font-black text-sm sm:text-base uppercase tracking-wider text-ink">
            {title}
          </h2>
        </div>
        <span className="font-sans text-[0.625rem] text-ink-muted uppercase tracking-widest">
          Agregasi Feed Resmi & Terverifikasi
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <article
            key={item.id}
            className="border border-rule-soft bg-paper-light/30 p-4 flex flex-col justify-between hover:bg-paper-light transition-colors group"
          >
            <div>
              {/* Optional photographic thumbnail */}
              {item.imageUrl && (
                <div className="relative aspect-[16/9] w-full border border-rule bg-paper-dark mb-3 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 right-0 bg-paper/90 px-1.5 py-0.5 text-[0.5625rem] font-sans text-ink-muted border-tl border-rule">
                    {item.imageCredit ? `${item.imageCredit} • ` : ""}Gambar hanya ilustrasi
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-2 text-[0.625rem] font-sans">
                <span className="bg-ink text-paper font-bold uppercase tracking-wider px-1.5 py-0.5">
                  BERITA EKSTERNAL
                </span>
                <span className="font-semibold text-accent uppercase tracking-wider">
                  {item.sourceName}
                </span>
              </div>

              <h3 className="font-serif text-base font-bold leading-snug text-ink mb-2 group-hover:underline">
                <a
                  href={item.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-2"
                >
                  <span>{item.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-ink-muted group-hover:text-ink mt-1" />
                </a>
              </h3>

              <p className="font-serif text-xs text-ink-soft leading-relaxed line-clamp-3 mb-3">
                {item.summary}
              </p>
            </div>

            <div className="pt-2.5 border-t border-rule-soft/60 flex items-center justify-between text-[0.625rem] font-sans text-ink-muted">
              <span>
                Dipublikasi: {formatDate(item.publishedAt, "short")}
              </span>
              <a
                href={item.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-ink hover:underline uppercase tracking-wider flex items-center gap-1"
              >
                Buka Sumber Asli →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
