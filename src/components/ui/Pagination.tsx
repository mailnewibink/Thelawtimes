"use client";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
  className?: string;
}

/** Numbered pagination with previous/next controls. Hidden when one page. */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  label = "Pagination",
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const base =
    "flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-3 font-sans text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label={label} className={cn("border-t-[3px] border-ink pt-4", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          <button
            type="button"
            className={cn(base, "hover:underline")}
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <span aria-hidden="true">←&nbsp;</span>Previous
          </button>
        </li>
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                base,
                p === page ? "bg-ink text-paper" : "border border-transparent hover:border-ink",
              )}
            >
              {p}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={cn(base, "hover:underline")}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next<span aria-hidden="true">&nbsp;→</span>
          </button>
        </li>
      </ul>
      <p className="meta mt-2 text-center" aria-live="polite">
        Page {page} of {totalPages}
      </p>
    </nav>
  );
}
