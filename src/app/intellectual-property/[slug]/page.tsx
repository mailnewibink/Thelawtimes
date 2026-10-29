import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getArticles } from "@/lib/content";
import { ArticleMetadata } from "@/components/editorial/ArticleMetadata";
import { SourceAttribution } from "@/components/editorial/SourceAttribution";
import { DemoContentNotice } from "@/components/ui/DemoContentNotice";
import { PaperDivider } from "@/components/ui/PaperDivider";

interface IPDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles("intellectual-property");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: IPDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, "intellectual-property");
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.headline} — Intellectual Property`,
    description: article.excerpt,
  };
}

export default async function IPDetailPage({ params }: IPDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, "intellectual-property");

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <div className="border-b border-rule-soft pb-2">
        <Link
          href="/intellectual-property"
          className="kicker inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
        >
          <span aria-hidden="true">←</span> Back to Intellectual Property
        </Link>
      </div>

      <header className="space-y-4">
        <ArticleMetadata
          publishedAt={article.publishedAt}
          category={article.category}
          byline={article.byline}
          provenance={article.provenance}
        />
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-ink">
          {article.headline}
        </h1>
        {article.deck && (
          <p className="font-serif text-xl sm:text-2xl italic text-ink-muted leading-snug">
            {article.deck}
          </p>
        )}
      </header>

      <PaperDivider variant="thin" />

      {article.image && (
        <figure className="my-6">
          <div className="relative aspect-[3/2] w-full border border-rule bg-paper-dark">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              className="object-cover engraving"
              sizes="(min-width: 896px) 896px, 100vw"
              priority
            />
          </div>
          {article.image.caption && (
            <figcaption className="meta mt-2 text-xs italic">
              {article.image.caption}
              {article.image.credit && ` — Credit: ${article.image.credit}`}
            </figcaption>
          )}
        </figure>
      )}

      {/* Article Body */}
      <div className="prose-news drop-cap mx-auto text-ink-soft">
        {article.body.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <PaperDivider variant="ornament" />

      <DemoContentNotice
        variant="panel"
        message="This article is a demonstration text for the Intellectual Property section of The Law Times. It contains no claims regarding real trademarks, inventions, registered designs, or brand disputes."
      />

      <SourceAttribution sources={article.sources} />
    </article>
  );
}
