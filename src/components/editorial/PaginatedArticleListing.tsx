"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { ArrowRight } from "lucide-react";

interface PaginatedArticleListingProps {
  articles: Article[];
  itemsPerPage?: number;
  highlightClientBadge?: boolean;
}

export function PaginatedArticleListing({
  articles,
  itemsPerPage = 6,
  highlightClientBadge = true,
}: PaginatedArticleListingProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="divide-y divide-rule-soft border-y border-rule">
        {currentArticles.map((article) => {
          const isClient = article.publicationType === "client_publication";
          return (
            <article
              key={article.id}
              className="py-3.5 sm:py-5 first:pt-2.5 last:pb-2.5 group"
            >
              <div className="flex gap-3 sm:gap-4 items-start justify-between">
                <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
                  {/* Category + Date */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {isClient && highlightClientBadge && (
                      <span className="bg-ink text-paper text-[0.625rem] font-bold px-1.5 py-0.2 uppercase tracking-wider kicker">
                        PUBLIKASI PERKARA
                      </span>
                    )}
                    <span className="font-sans text-[0.6875rem] sm:text-xs uppercase tracking-wider font-bold text-accent kicker">
                      {article.category || "HUKUM"}
                    </span>
                    <span className="text-rule-soft" aria-hidden="true">·</span>
                    <time
                      dateTime={article.publishedAt}
                      className="font-sans text-[0.6875rem] sm:text-xs uppercase tracking-wider text-ink-muted"
                    >
                      {formatDate(article.publishedAt, "short")}
                    </time>
                  </div>

                  {/* Headline */}
                  <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold leading-snug text-ink mb-1 group-hover:underline decoration-1 underline-offset-2">
                    <Link href={`/artikel/${article.slug}`}>
                      {article.headline}
                    </Link>
                  </h3>

                  {/* Short description (max 2 lines mobile, 3 lines desktop) */}
                  <p className="font-serif text-xs sm:text-sm text-ink-soft leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Byline and read link */}
                  <div className="pt-1.5 flex items-center justify-between text-[0.6875rem] text-ink-muted font-sans border-t border-rule-soft/40">
                    <span className="italic truncate max-w-[65%]">
                      Oleh: {article.byline || "Redaksi The Law Times"}
                    </span>
                    <Link
                      href={`/artikel/${article.slug}`}
                      className="font-semibold text-ink hover:underline flex items-center gap-1 uppercase tracking-wider text-[0.625rem] shrink-0"
                    >
                      Baca Lengkap <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Proportional Thumbnail on the right */}
                {article.image && (
                  <div className="flex flex-col space-y-0.5 shrink-0 mt-0.5">
                    <div className="relative w-24 h-20 sm:w-32 sm:h-24 border border-rule bg-paper-dark overflow-hidden">
                      <Image
                        src={article.image.src}
                        alt={article.image.alt}
                        fill
                        sizes="(min-width: 640px) 128px, 96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[0.55rem] font-sans text-ink-muted/70 italic text-right hidden sm:block">
                      Foto ilustrasi
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination component */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => {
          setCurrentPage(p);
          window.scrollTo({ top: 300, behavior: "smooth" });
        }}
        label="Navigasi Lembaran Warta"
      />
    </div>
  );
}
