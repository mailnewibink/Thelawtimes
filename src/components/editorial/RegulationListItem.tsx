import type { Regulation } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { DemoBadge } from "@/components/ui/DemoContentNotice";
import { FieldValue } from "@/components/ui/FieldValue";
import { cn } from "@/lib/utils";

interface RegulationListItemProps {
  regulation: Regulation;
  className?: string;
}

export function RegulationListItem({ regulation, className }: RegulationListItemProps) {
  return (
    <article
      className={cn(
        "border-b border-rule-soft pb-4 pt-3 flex flex-col justify-between hover:bg-paper-light/50 transition-colors p-2",
        className
      )}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="kicker text-[0.625rem] text-ink-muted">
            {regulation.type}
          </span>
          <div className="flex items-center gap-2">
            {regulation.provenance.isDemo && <DemoBadge />}
            <span className="meta text-xs">
              {formatDate(regulation.publishedAt, "short")}
            </span>
          </div>
        </div>

        <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-ink mb-2">
          {regulation.title}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 meta text-xs mb-3">
          <div>
            <span className="font-semibold text-ink">Number: </span>
            <FieldValue value={regulation.number} unavailableText="Unverified" />
          </div>
          <div>
            <span className="font-semibold text-ink">Institution: </span>
            <FieldValue value={regulation.issuingInstitution} unavailableText="Not specified" />
          </div>
          <div>
            <span className="font-semibold text-ink">Status: </span>
            <FieldValue value={regulation.status} unavailableText="Status unverified" />
          </div>
        </div>

        <p className="font-serif text-sm leading-relaxed text-ink-soft">
          {regulation.summary}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-rule-soft/60 flex items-center justify-between meta text-xs">
        <span className="italic text-ink-muted">
          Source: {regulation.source.label}
        </span>
        <span className="kicker text-[0.625rem] text-ink">Regulation Watch</span>
      </div>
    </article>
  );
}
