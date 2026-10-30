import Image from "next/image";
import type { Article } from "@/types/content";
import { ArticleHeadline } from "./ArticleHeadline";
import { ArticleMetadata } from "./ArticleMetadata";
import { cn } from "@/lib/utils";

interface ArticleListItemProps {
  article: Article;
  showExcerpt?: boolean;
  showImage?: boolean;
  compact?: boolean;
  priorityImage?: boolean;
  className?: string;
}

export function ArticleListItem({
  article,
  showExcerpt = true,
  showImage = false,
  compact = false,
  priorityImage = false,
  className,
}: ArticleListItemProps) {
  const detailHref = `/artikel/${article.slug}`;

  return (
    <article className={cn("group flex flex-col justify-between", className)}>
      <div>
        {showImage && article.image && (
          <figure className="mb-3 space-y-1">
            <div className="relative aspect-[3/2] w-full border border-rule bg-paper-dark overflow-hidden">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                fill
                loading={priorityImage ? "eager" : "lazy"}
                {...(priorityImage ? { fetchPriority: "high" as const } : {})}
                className="object-cover engraving"
                sizes="(min-width: 768px) 30vw, 100vw"
              />
            </div>
            <figcaption className="text-[0.58rem] font-sans text-ink-muted/80 flex items-center justify-between px-0.5">
              <span className="truncate max-w-[65%]">{article.image.credit ? `Sumber: ${article.image.credit}` : ""}</span>
              <span className="italic shrink-0">Gambar hanya ilustrasi</span>
            </figcaption>
          </figure>
        )}
        <ArticleMetadata
          publishedAt={article.publishedAt}
          category={article.category}
          publicationType={article.publicationType}
          provenance={article.provenance}
          className="mb-1.5"
        />
        <ArticleHeadline
          headline={article.headline}
          href={detailHref}
          size={compact ? "sm" : "md"}
          level={3}
          className="mb-2"
        />
        {showExcerpt && (
          <p className="font-serif text-sm leading-relaxed text-ink-soft line-clamp-3">
            {article.excerpt}
          </p>
        )}
      </div>
      {article.byline && (
        <p className="meta mt-2 text-xs italic">
          By {article.byline}
        </p>
      )}
    </article>
  );
}
