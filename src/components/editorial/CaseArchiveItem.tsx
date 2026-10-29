import Link from "next/link";
import type { CaseRecord } from "@/types/content";
import { CaseStatusLabel } from "./CaseStatusLabel";
import { DemoBadge } from "@/components/ui/DemoContentNotice";
import { FieldValue } from "@/components/ui/FieldValue";
import { cn } from "@/lib/utils";

interface CaseArchiveItemProps {
  caseRecord: CaseRecord;
  className?: string;
}

export function CaseArchiveItem({ caseRecord, className }: CaseArchiveItemProps) {
  return (
    <article
      className={cn(
        "border-b border-rule-soft pb-4 sm:pb-5 pt-3 flex flex-col justify-between hover:bg-paper-light/50 transition-colors p-2",
        className
      )}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="kicker text-[0.625rem] text-ink-muted">
              {caseRecord.category} · {caseRecord.year}
            </span>
            <span className="font-mono text-xs text-ink-muted">
              [{caseRecord.archiveId}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            {caseRecord.provenance.isDemo && <DemoBadge />}
            <CaseStatusLabel status={caseRecord.status} />
          </div>
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-ink mb-2">
          <Link href={`/case-archive/${caseRecord.slug}`} className="headline-link">
            {caseRecord.title}
          </Link>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 meta text-xs mb-3">
          <div>
            <span className="font-semibold text-ink">Official Ref: </span>
            <FieldValue value={caseRecord.reference} unavailableText="Unassigned / Not verified" />
          </div>
          <div>
            <span className="font-semibold text-ink">Court: </span>
            <FieldValue value={caseRecord.court} unavailableText="Not specified" />
          </div>
        </div>

        {caseRecord.summary[0] && (
          <p className="font-serif text-sm leading-relaxed text-ink-soft line-clamp-2">
            {caseRecord.summary[0]}
          </p>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-rule-soft/60 flex items-center justify-between">
        <span className="meta text-[0.6875rem] text-ink-muted">
          Updated: {caseRecord.lastUpdated}
        </span>
        <Link
          href={`/case-archive/${caseRecord.slug}`}
          className="kicker text-xs text-ink hover:underline inline-flex items-center gap-1"
        >
          View Case Record
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
