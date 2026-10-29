"use client";

import { useState, useMemo } from "react";
import type { CaseRecord } from "@/types/content";
import { SearchInput } from "@/components/ui/SearchInput";
import { CategoryFilter, SelectFilter } from "@/components/ui/CategoryFilter";
import { CaseArchiveItem } from "@/components/editorial/CaseArchiveItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { matchesQuery } from "@/lib/utils";

interface CaseArchiveExplorerProps {
  initialCases: CaseRecord[];
  categories: readonly string[];
}

export function CaseArchiveExplorer({
  initialCases,
  categories,
}: CaseArchiveExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");

  const years = useMemo(() => {
    const list = Array.from(new Set(initialCases.map((c) => c.year.toString()))).sort(
      (a, b) => Number(b) - Number(a)
    );
    return list;
  }, [initialCases]);

  const filtered = useMemo(() => {
    return initialCases.filter((c) => {
      const matchesCat = !category || c.category === category;
      const matchesYr = !year || c.year.toString() === year;
      const matchesSearch = matchesQuery(query, [
        c.title,
        c.archiveId,
        c.reference,
        c.court,
        c.caseType,
        ...c.summary,
      ]);
      return matchesCat && matchesYr && matchesSearch;
    });
  }, [initialCases, query, category, year]);

  const counts = useMemo(() => {
    const res: Record<string, number> = {};
    for (const cat of categories) {
      res[cat] = initialCases.filter((c) => c.category === cat).length;
    }
    return res;
  }, [initialCases, categories]);

  return (
    <div className="space-y-8">
      <div className="bg-paper-light border border-rule p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-3">
            <SearchInput
              label="Search Archive (Title, Ref, Court, Docket)"
              placeholder="Search by case title or archive reference (e.g. DEMO-ARCHIVE)..."
              value={query}
              onChange={setQuery}
            />
          </div>
          <div>
            <SelectFilter
              id="year-filter"
              label="Filing Year"
              options={years}
              value={year}
              onChange={setYear}
              allLabel="All Years"
            />
          </div>
        </div>

        <CategoryFilter
          label="Filter by Legal Jurisdiction / Category"
          options={categories}
          value={category}
          onChange={setCategory}
          counts={counts}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Case Records Found"
          description="No case record matched your search filters. Try widening your criteria or clearing filters."
          action={{
            label: "Reset Search",
            onClick: () => {
              setQuery("");
              setCategory("");
              setYear("");
            },
          }}
        />
      ) : (
        <div className="space-y-4">
          <p className="kicker text-ink-muted">
            Displaying {filtered.length} Case Documentation Record{filtered.length > 1 ? "s" : ""}
          </p>
          <div className="divide-y divide-rule-soft">
            {filtered.map((c) => (
              <CaseArchiveItem key={c.id} caseRecord={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
