import type { CaseStatus } from "@/types/content";
import { cn } from "@/lib/utils";

interface CaseStatusLabelProps {
  status: CaseStatus | null;
  className?: string;
}

export function CaseStatusLabel({ status, className }: CaseStatusLabelProps) {
  if (!status) {
    return (
      <span
        className={cn(
          "kicker inline-block border border-rule-soft bg-paper-dark/60 px-1.5 py-0.5 text-[0.625rem] text-ink-muted",
          className
        )}
      >
        Status unverified
      </span>
    );
  }

  const statusStyles: Record<CaseStatus, string> = {
    Open: "border-ink bg-ink text-paper",
    "Under Review": "border-ink bg-paper-light text-ink",
    Adjourned: "border-rule-soft bg-paper text-ink-muted",
    Closed: "border-rule-soft bg-paper-dark text-ink-muted line-through",
  };

  return (
    <span
      className={cn(
        "kicker inline-block border px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wider",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
