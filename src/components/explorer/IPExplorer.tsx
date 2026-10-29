"use client";

import { useState, useMemo } from "react";
import type { Article } from "@/types/content";
import { SearchInput } from "@/components/ui/SearchInput";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { ArticleListItem } from "@/components/editorial/ArticleListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { matchesQuery } from "@/lib/utils";

interface IPExplorerProps {
  initialArticles: Article[];
  categories: readonly string[];
}

export function IPExplorer({ initialArticles, categories }: IPExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

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

  const counts = useMemo(() => {
    const res: Record<string, number> = {};
    for (const cat of categories) {
      res[cat] = initialArticles.filter((a) => a.category === cat).length;
    }
    return res;
  }, [initialArticles, categories]);

  return (
    <div className="space-y-8">
      <div className="bg-paper-light border border-rule p-4 sm:p-6 space-y-4">
        <SearchInput
          label="Search Intellectual Property Coverage"
          placeholder="Search trademarks, patent basics, copyright topics..."
          value={query}
          onChange={setQuery}
        />
        <CategoryFilter
          label="Filter by IP Regime"
          options={categories}
          value={category}
          onChange={setCategory}
          counts={counts}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No IP Articles Found"
          description="No intellectual property articles matched your search query."
          action={{
            label: "Reset Search",
            onClick: () => {
              setQuery("");
              setCategory("");
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
            <ArticleListItem
              key={art.id}
              article={art}
              showImage={!!art.image}
              className="border-b border-rule-soft pb-6 last:border-b-0 md:last:border-b"
            />
          ))}
        </div>
      )}
    </div>
  );
}
