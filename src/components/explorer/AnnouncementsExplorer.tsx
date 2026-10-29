"use client";

import { useState, useMemo } from "react";
import type { Announcement } from "@/types/content";
import { SearchInput } from "@/components/ui/SearchInput";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { AnnouncementNotice } from "@/components/editorial/AnnouncementNotice";
import { EmptyState } from "@/components/ui/EmptyState";
import { matchesQuery } from "@/lib/utils";

interface AnnouncementsExplorerProps {
  initialAnnouncements: Announcement[];
  types: readonly string[];
}

export function AnnouncementsExplorer({
  initialAnnouncements,
  types,
}: AnnouncementsExplorerProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    return initialAnnouncements.filter((ann) => {
      const matchesType = !type || ann.type === type;
      const matchesSearch = matchesQuery(query, [
        ann.title,
        ann.summary,
        ann.relatedParty,
        ...ann.body,
      ]);
      return matchesType && matchesSearch;
    });
  }, [initialAnnouncements, query, type]);

  const counts = useMemo(() => {
    const res: Record<string, number> = {};
    for (const t of types) {
      res[t] = initialAnnouncements.filter((a) => a.type === t).length;
    }
    return res;
  }, [initialAnnouncements, types]);

  return (
    <div className="space-y-8">
      <div className="bg-paper-light border border-rule p-4 sm:p-6 space-y-4">
        <SearchInput
          label="Search Formal Notices & Announcements"
          placeholder="Filter by notice keyword, organization name, or topic..."
          value={query}
          onChange={setQuery}
        />
        <CategoryFilter
          label="Filter by Notice Type"
          options={types}
          value={type}
          onChange={setType}
          counts={counts}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Legal Announcements Found"
          description="No official notice matched your query or selected type filter."
          action={{
            label: "Reset Search",
            onClick: () => {
              setQuery("");
              setType("");
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((ann) => (
            <div key={ann.id} id={ann.slug}>
              <AnnouncementNotice announcement={ann} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
