"use client";

import { useState } from "react";
import type { Regulation } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { DemoBadge } from "@/components/ui/DemoContentNotice";
import { FieldValue } from "@/components/ui/FieldValue";
interface PaginatedRegulationListingProps {
  regulations: Regulation[];
  itemsPerPage?: number;
}

export function PaginatedRegulationListing({
  regulations,
  itemsPerPage = 6,
}: PaginatedRegulationListingProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(regulations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = regulations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="divide-y divide-rule-soft border-y border-rule">
        {currentItems.map((reg) => (
          <article
            key={reg.id}
            className="py-5 first:pt-3 last:pb-3 hover:bg-paper-light/30 transition-colors p-2"
          >
            {/* Header tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[0.625rem] font-bold uppercase tracking-wider bg-ink text-paper px-1.5 py-0.5">
                  {reg.type || "REGULASI"}
                </span>
                {reg.provenance?.isDemo && <DemoBadge />}
              </div>
              <time
                dateTime={reg.publishedAt}
                className="font-sans text-[0.625rem] uppercase tracking-wider text-ink-muted"
              >
                {formatDate(reg.publishedAt, "short")}
              </time>
            </div>

            {/* Title */}
            <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold leading-snug text-ink mb-2">
              {reg.title}
            </h3>

            {/* Structured Metadata Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-paper border border-rule-soft p-2.5 text-xs mb-3 font-serif">
              <div>
                <span className="font-sans font-semibold text-ink-muted uppercase text-[0.625rem] block mb-0.5">
                  Nomor & Tahun
                </span>
                <FieldValue
                  value={reg.number ? `${reg.number}${reg.year ? ` Tahun ${reg.year}` : ""}` : null}
                  unavailableText="Menunggu Verifikasi"
                />
              </div>
              <div>
                <span className="font-sans font-semibold text-ink-muted uppercase text-[0.625rem] block mb-0.5">
                  Lembaga Penerbit
                </span>
                <FieldValue
                  value={reg.issuingInstitution}
                  unavailableText="Kementerian / Lembaga Terkait"
                />
              </div>
              <div>
                <span className="font-sans font-semibold text-ink-muted uppercase text-[0.625rem] block mb-0.5">
                  Status Berlaku
                </span>
                <FieldValue
                  value={reg.status || "Berlaku Penuh"}
                  unavailableText="Status Dalam Peninjauan"
                />
              </div>
            </div>

            {/* Summary */}
            <p className="font-serif text-xs sm:text-sm text-ink-soft leading-relaxed line-clamp-3 mb-3">
              {reg.summary}
            </p>

            {/* Footer with source attribution */}
            <div className="pt-2 border-t border-rule-soft/60 flex items-center justify-between text-[0.6875rem] text-ink-muted">
              <span className="italic">
                Sumber Rujukan: {reg.source.label}
              </span>
              <span className="font-sans font-semibold text-ink uppercase tracking-wider text-[0.625rem] flex items-center gap-1">
                Lembaran Negara RI
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => {
          setCurrentPage(p);
          window.scrollTo({ top: 300, behavior: "smooth" });
        }}
        label="Navigasi Lembaran Regulasi"
      />
    </div>
  );
}
