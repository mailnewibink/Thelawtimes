import { cn } from "@/lib/utils";

/** Compact inline marker attached to every demo record. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "kicker inline-flex items-center gap-1 border border-ink px-1.5 py-0.5 text-[0.625rem] leading-none tracking-[0.16em] text-ink",
        className,
      )}
    >
      <span aria-hidden="true">◆</span> Demo
      <span className="sr-only"> content — fictional sample, not an authentic record</span>
    </span>
  );
}

type NoticeVariant = "banner" | "panel" | "stamp";

interface DemoContentNoticeProps {
  variant?: NoticeVariant;
  /** Overrides the default message. */
  message?: string;
  className?: string;
}

const DEFAULT_MESSAGE =
  "This edition contains fictional demonstration content created to preview the design of The Law Times. No article, announcement, case record or regulation shown here is authentic, and none has legal force.";

/**
 * Prominent notice that the surrounding content is fictional.
 *
 * - `banner`: site-wide strip.
 * - `panel`: boxed notice at the top of a listing or detail page.
 * - `stamp`: conspicuous label for detail pages of individual demo records.
 */
export function DemoContentNotice({
  variant = "panel",
  message,
  className,
}: DemoContentNoticeProps) {
  if (variant === "banner") {
    return (
      <div
        role="note"
        aria-label="Demo content notice"
        className={cn("bg-ink text-paper", className)}
      >
        <p className="paper-container py-1.5 text-center font-sans text-[0.6875rem] leading-snug tracking-wide sm:text-xs">
          <strong className="font-bold uppercase tracking-[0.14em]">Demonstration edition</strong>
          <span aria-hidden="true"> · </span>
          <span>All content is fictional sample material and is not authentic legal information.</span>
        </p>
      </div>
    );
  }

  if (variant === "stamp") {
    return (
      <div
        role="note"
        className={cn(
          "inline-block -rotate-1 border-[3px] border-double border-ink px-4 py-2 text-center",
          className,
        )}
      >
        <p className="kicker text-xs tracking-[0.2em] sm:text-sm">
          {message ?? "Demo content — not an actual legal record"}
        </p>
      </div>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Demo content notice"
      className={cn("border-y-2 border-ink bg-paper-light px-4 py-3 sm:px-5", className)}
    >
      <p className="kicker mb-1">Notice to readers · Demo content</p>
      <p className="font-serif text-sm leading-relaxed text-ink-soft">{message ?? DEFAULT_MESSAGE}</p>
    </aside>
  );
}
