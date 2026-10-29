"use client";

import { useState, useMemo } from "react";
import type { Article } from "@/types/content";
import { SearchInput } from "@/components/ui/SearchInput";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { ArticleListItem } from "@/components/editorial/ArticleListItem";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { matchesQuery, paginate } from "@/lib/utils";

interface NewsExplorerProps {
  initialArticles: Article[];
  categories: readonly string[];
}

const ITEMS_PER_PAGE = 6;

export function NewsExplorer({ initialArticles, categories }: NewsExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return initialArticles.filter((art) => {
      const matchesCat = !category || art.category === category;
      const matchesSearch = matchesQuery(query, [
        art.headline,
        art.deck,
        art.excerpt,
        art.byline,
        ...art.body,
      ]);
      return matchesCat && matchesSearch;
    });
  }, [initialArticles, query, category]);

  // Compute counts per category
  const counts = useMemo(() => {
    const res: Record<string, number> = {};
    for (const cat of categories) {
      res[cat] = initialArticles.filter((a) => a.category === cat).length;
    }
    return res;
  }, [initialArticles, categories]);

  const pagedResult = useMemo(() => {
    return paginate(filtered, page, ITEMS_PER_PAGE);
  }, [filtered, page]);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setPage(1);
  };

  const handleQueryChange = (newQ: string) => {
    setQuery(newQ);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-paper-light border border-rule p-4 sm:p-6 space-y-4">
        <SearchInput
          label="Search Legal News & Reporting"
          placeholder="Type keywords (e.g. docket, contract, court)..."
          value={query}
          onChange={handleQueryChange}
        />
        <CategoryFilter
          label="Filter by Topic"
          options={categories}
          value={category}
          onChange={handleCategoryChange}
          counts={counts}
        />
      </div>

      {/* Listing Content */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Legal News Found"
          description="No articles matched your search query or selected topic filter. Try clearing your filters."
          action={{
            label: "Reset Filters",
            onClick: () => {
              setQuery("");
              setCategory("");
              setPage(1);
            },
          }}
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedResult.items.map((art) => (
              <ArticleListItem
                key={art.id}
                article={art}
                showImage={!!art.image}
                className="border-b border-rule-soft pb-6 last:border-b-0 md:last:border-b"
              />
            ))}
          </div>

          <Pagination
            page={pagedResult.page}
            totalPages={pagedResult.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
