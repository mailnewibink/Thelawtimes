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
              className="py-5 first:pt-3 last:pb-3 grid grid-cols-1 sm:grid-cols-12 gap-4 group"
            >
              {/* Optional Thumbnail */}
              {article.image && (
                <div className="sm:col-span-4 flex flex-col space-y-1">
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] border border-rule bg-paper-dark overflow-hidden">
                    <Image
                      src={article.image.src}
                      alt={article.image.alt}
                      fill
                      sizes="(min-width: 640px) 25vw, 100vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    {isClient && highlightClientBadge && (
                      <div className="absolute top-0 left-0 bg-ink text-paper text-[0.5625rem] font-bold px-1.5 py-0.5 uppercase tracking-widest">
                        Publikasi Klien
                      </div>
                    )}
                  </div>
                  <div className="text-[0.58rem] font-sans text-ink-muted/80 flex items-center justify-between px-0.5">
                    <span className="truncate max-w-[65%]">{article.image.credit ? `Sumber: ${article.image.credit}` : ""}</span>
                    <span className="italic shrink-0">Foto hanya ilustrasi</span>
                  </div>
                </div>
              )}

              {/* Text content */}
              <div className={article.image ? "sm:col-span-8 flex flex-col justify-between" : "sm:col-span-12 flex flex-col justify-between"}>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {isClient && highlightClientBadge && (
                      <span className="bg-ink text-paper text-[0.5625rem] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                        PUBLIKASI PERKARA
                      </span>
                    )}
                    <span className="font-sans text-[0.625rem] uppercase tracking-wider font-semibold text-accent">
                      {article.category || "HUKUM"}
                    </span>
                    <span className="text-rule font-serif text-xs">•</span>
                    <time
                      dateTime={article.publishedAt}
                      className="font-sans text-[0.625rem] uppercase tracking-wider text-ink-muted"
                    >
                      {formatDate(article.publishedAt, "short")}
                    </time>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold leading-snug text-ink mb-2 group-hover:underline decoration-1 underline-offset-2">
                    <Link href={`/artikel/${article.slug}`}>
                      {article.headline}
                    </Link>
                  </h3>

                  <p className="font-serif text-xs sm:text-sm text-ink-soft leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-[0.6875rem] text-ink-muted font-sans border-t border-rule-soft/50">
                  <span className="italic">
                    Oleh: {article.byline || "Redaksi The Law Times"}
                  </span>
                  <Link
                    href={`/artikel/${article.slug}`}
                    className="font-semibold text-ink hover:underline flex items-center gap-1 uppercase tracking-wider text-[0.625rem]"
                  >
                    Baca Lengkap <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
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
