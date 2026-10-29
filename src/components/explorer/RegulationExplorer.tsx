"use client";

import { useState, useMemo } from "react";
import type { Regulation } from "@/types/content";
import { SearchInput } from "@/components/ui/SearchInput";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { RegulationListItem } from "@/components/editorial/RegulationListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { matchesQuery } from "@/lib/utils";

interface RegulationExplorerProps {
  initialRegulations: Regulation[];
  types: readonly string[];
}

export function RegulationExplorer({
  initialRegulations,
  types,
}: RegulationExplorerProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    return initialRegulations.filter((reg) => {
      const matchesType = !type || reg.type === type;
      const matchesSearch = matchesQuery(query, [
        reg.title,
        reg.number,
        reg.issuingInstitution,
        reg.summary,
        ...reg.body,
      ]);
      return matchesType && matchesSearch;
    });
  }, [initialRegulations, query, type]);

  const counts = useMemo(() => {
    const res: Record<string, number> = {};
    for (const t of types) {
      res[t] = initialRegulations.filter((r) => r.type === t).length;
    }
    return res;
  }, [initialRegulations, types]);

  return (
    <div className="space-y-8">
      <div className="bg-paper-light border border-rule p-4 sm:p-6 space-y-4">
        <SearchInput
          label="Search Regulatory Updates & Decrees"
          placeholder="Filter by regulation topic, type, or institution..."
          value={query}
          onChange={setQuery}
        />
        <CategoryFilter
          label="Filter by Instrument Level"
          options={types}
          value={type}
          onChange={setType}
          counts={counts}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Regulations Found"
          description="No regulatory items matched your search filters."
          action={{
            label: "Reset Search",
            onClick: () => {
              setQuery("");
              setType("");
            },
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-rule-soft">
            {filtered.map((reg) => (
              <RegulationListItem key={reg.id} regulation={reg} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
