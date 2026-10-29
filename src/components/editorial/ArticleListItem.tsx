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
  const detailHref = `/${article.section}/${article.slug}`;

  return (
    <article className={cn("group flex flex-col justify-between", className)}>
      <div>
        {showImage && article.image && (
          <div className="relative mb-3 aspect-[3/2] w-full border border-rule bg-paper-dark">
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
        )}
        <ArticleMetadata
          publishedAt={article.publishedAt}
          category={article.category}
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
