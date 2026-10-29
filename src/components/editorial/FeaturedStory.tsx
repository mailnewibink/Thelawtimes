import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/content";
import { ArticleHeadline } from "./ArticleHeadline";
import { ArticleMetadata } from "./ArticleMetadata";
import { cn } from "@/lib/utils";

interface FeaturedStoryProps {
  article: Article;
  className?: string;
}

export function FeaturedStory({ article, className }: FeaturedStoryProps) {
  const detailHref = `/${article.section}/${article.slug}`;

  return (
    <article className={cn("grid grid-cols-1 gap-6 lg:grid-cols-12", className)}>
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div>
          <ArticleMetadata
            publishedAt={article.publishedAt}
            category={article.category}
            byline={article.byline}
            provenance={article.provenance}
            className="mb-3"
          />
          <ArticleHeadline
            headline={article.headline}
            href={detailHref}
            size="xl"
            level={2}
            className="mb-3"
          />
          {article.deck && (
            <p className="font-serif text-lg italic text-ink-muted leading-snug mb-4">
              {article.deck}
            </p>
          )}
          <p className="font-serif text-base leading-relaxed text-ink-soft drop-cap">
            {article.excerpt}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-rule-soft">
          <Link
            href={detailHref}
            className="kicker inline-flex items-center gap-1.5 text-xs text-ink hover:underline"
          >
            Continue reading story
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {article.image && (
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative aspect-[3/2] w-full border border-rule bg-paper-dark">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              loading="eager"
              fetchPriority="high"
              className="object-cover engraving"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          {article.image.caption && (
            <figcaption className="meta mt-2 text-xs italic">
              {article.image.caption}
              {article.image.credit && ` (${article.image.credit})`}
            </figcaption>
          )}
        </div>
      )}
    </article>
  );
}
