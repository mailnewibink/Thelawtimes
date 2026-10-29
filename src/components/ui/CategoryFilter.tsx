"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  label: string;
  options: readonly string[];
  /** Selected option, or `""` for "All". */
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
  /** Optional result counts per option. */
  counts?: Record<string, number>;
  className?: string;
}

/**
 * Row of toggle buttons for filtering a listing by category.
 * Uses `aria-pressed` so the selected state is announced to screen readers.
 */
export function CategoryFilter({
  label,
  options,
  value,
  onChange,
  allLabel = "All",
  counts,
  className,
}: CategoryFilterProps) {
  const all = ["", ...options];
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="kicker mb-1.5 text-ink-muted">{label}</legend>
      <div className="-mx-1 flex flex-wrap gap-1.5 px-1">
        {all.map((option) => {
          const selected = option === value;
          const count = counts && option ? counts[option] ?? 0 : undefined;
          return (
            <button
              key={option || "all"}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={cn(
                "min-h-10 cursor-pointer border px-3 py-1.5 font-sans text-[0.8125rem] leading-tight transition-colors",
                selected
                  ? "border-ink bg-ink text-paper"
                  : "border-rule-soft bg-paper-light text-ink hover:border-ink",
              )}
            >
              {option || allLabel}
              {count !== undefined && (
                <span className={cn("ml-1.5 text-xs", selected ? "text-paper/75" : "text-ink-muted")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface SelectFilterProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
  id: string;
  className?: string;
}

/** Compact native select for filters with many or ordered options (e.g. year). */
export function SelectFilter({
  label,
  options,
  value,
  onChange,
  allLabel = "All",
  id,
  className,
}: SelectFilterProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="kicker mb-1.5 block text-ink-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full cursor-pointer border-b-2 border-ink bg-paper-light px-3 font-serif text-base text-ink"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
