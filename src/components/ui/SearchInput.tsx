"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

/** Accessible search field with a visible label and clear button. */
export function SearchInput({ value, onChange, label, placeholder, className }: SearchInputProps) {
  const id = useId();
  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={id} className="kicker mb-1.5 block text-ink-muted">
        {label}
      </label>
      <div className="relative flex items-center border-b-2 border-ink bg-paper-light focus-within:bg-white">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute left-3 h-4 w-4 fill-none stroke-ink"
          strokeWidth="1.6"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M13 13l4.5 4.5" strokeLinecap="round" />
        </svg>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="h-12 w-full bg-transparent pl-10 pr-12 font-serif text-base text-ink placeholder:text-ink-muted/80 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 flex h-10 w-10 cursor-pointer items-center justify-center text-ink-muted hover:text-ink"
            aria-label="Clear search"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
