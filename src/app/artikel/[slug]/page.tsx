import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getArticles } from "@/lib/content";
import { ArticleMetadata } from "@/components/editorial/ArticleMetadata";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { SocialShareBar } from "@/components/editorial/SocialShareBar";
import { ArticleListItem } from "@/components/editorial/ArticleListItem";
import { siteConfig } from "@/lib/site-config";
import { Scale, FileText, ExternalLink, ArrowLeft } from "lucide-react";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan — The Law Times" };

  const canonicalUrl = `${siteConfig.url}/artikel/${article.slug}`;
  const title = article.seoTitle || `${article.headline} — The Law Times`;
  const description = article.seoDescription || article.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "id_ID",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || undefined,
      images: article.image?.src
        ? [
            {
              url: article.image.src.startsWith("http")
                ? article.image.src
                : `${siteConfig.url}${article.image.src}`,
              alt: article.image.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles();
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.publicationType === article.publicationType))
    .slice(0, 3);

  const canonicalUrl = `${siteConfig.url}/artikel/${article.slug}`;
  const isClientPub = article.publicationType === "client_publication";

  // JSON-LD Structured Data: NewsArticle + BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${canonicalUrl}#article`,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteConfig.url}/#website`,
        },
        headline: article.headline,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        mainEntityOfPage: canonicalUrl,
        author: {
          "@type": "Organization",
          name: article.byline || "Dewan Redaksi The Law Times",
          url: siteConfig.url,
        },
        publisher: {
          "@type": "NewsMediaOrganization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/images/courthouse.jpg`,
          },
        },
        image: article.image?.src
          ? [
              article.image.src.startsWith("http")
                ? article.image.src
                : `${siteConfig.url}${article.image.src}`,
            ]
          : undefined,
        inLanguage: "id-ID",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isClientPub ? "Perkara & Putusan" : "Berita Hukum",
            item: `${siteConfig.url}${isClientPub ? "/perkara" : "/berita-hukum"}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.headline,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back to section link */}
      <div className="border-b border-rule-soft pb-2 flex items-center justify-between text-xs">
        <Link
          href={isClientPub ? "/perkara" : "/berita-hukum"}
          className="kicker inline-flex items-center gap-1.5 text-ink-muted hover:text-ink font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isClientPub ? "Kembali ke Publikasi Perkara" : "Kembali ke Berita Hukum"}</span>
        </Link>

        <span className="text-[0.68rem] kicker uppercase font-mono text-ink-muted">
          ID: {article.slug}
        </span>
      </div>

      {/* Client Publication Transparency Notice */}
      {isClientPub && (
        <div className="border-l-4 border-ink bg-paper-dark/40 p-4 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-ink font-bold uppercase tracking-wider text-[0.7rem] kicker">
            <Scale className="w-4 h-4 text-accent" />
            <span>Publikasi Khusus Klien & Perkara Terkait</span>
          </div>
          <p className="text-ink-muted text-[0.75rem] leading-relaxed">
            Artikel ini diterbitkan sebagai saluran resmi pengumuman hukum, keterbukaan sengketa, dan putusan
            perkara peradilan terkait klien. Materi ini disajikan untuk kepentingan transparansi dan catatan publik resmi.
          </p>
        </div>
      )}

      {/* Article Header */}
      <header className="space-y-4">
        <ArticleMetadata
          publishedAt={article.publishedAt}
          category={article.category}
          byline={article.byline}
          publicationType={article.publicationType}
          provenance={article.provenance}
        />

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-ink">
          {article.headline}
        </h1>

        {article.deck && (
          <p className="font-serif text-xl sm:text-2xl italic text-ink-muted leading-snug">
            {article.deck}
          </p>
        )}
      </header>

      {/* Social Sharing Bar */}
      <SocialShareBar title={article.headline} url={canonicalUrl} />

      <PaperDivider variant="thin" />

      {/* Featured Image */}
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
              {article.image.credit && ` — Kredit: ${article.image.credit}`}
            </figcaption>
          )}
        </figure>
      )}

      {/* Article Body */}
      <div className="prose-news drop-cap mx-auto text-ink-soft space-y-4">
        {article.body.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Supporting Documents & Official Sources Box */}
      {(article.sourceUrl || article.documentUrl || article.sources.length > 0) && (
        <div className="border border-rule bg-paper-dark/20 p-4 space-y-3 my-8 text-xs">
          <div className="border-b border-rule pb-1.5 flex items-center justify-between">
            <span className="kicker uppercase font-bold text-[0.68rem] text-ink flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span>Rujukan Sumber Resmi & Dokumen Pendukung</span>
            </span>
          </div>

          <div className="space-y-2">
            {article.sourceName && (
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Sumber Publikasi:</span>
                {article.sourceUrl ? (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent hover:underline inline-flex items-center gap-1"
                  >
                    <span>{article.sourceName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-medium text-ink">{article.sourceName}</span>
                )}
              </div>
            )}

            {article.documentUrl && (
              <div className="flex items-center justify-between pt-1 border-t border-rule/60">
                <span className="text-ink-muted">Lampiran Dokumen Resmi:</span>
                <a
                  href={article.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent hover:underline inline-flex items-center gap-1"
                >
                  <span>Buka Berkas Resmi (PDF)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {article.sources.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between pt-1 border-t border-rule/60">
                <span className="text-ink-muted">{s.label}:</span>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent hover:underline inline-flex items-center gap-1"
                  >
                    <span>{s.publisher || "Tautan Resmi"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-medium text-ink">{s.publisher || "Arsip Redaksi"}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Sharing Bar (Bottom) */}
      <SocialShareBar title={article.headline} url={canonicalUrl} />

      <PaperDivider variant="ornament" />

      {/* Related Publications */}
      {relatedArticles.length > 0 && (
        <section aria-label="Artikel Terkait" className="space-y-6 pt-4">
          <h2 className="font-serif font-bold text-xl text-ink border-b-2 border-ink pb-2">
            Publikasi Terkait Lainnya
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleListItem key={rel.id} article={rel} compact showImage />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
