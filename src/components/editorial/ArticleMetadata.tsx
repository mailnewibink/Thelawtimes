import { formatDate } from "@/lib/utils";
import { DemoBadge } from "@/components/ui/DemoContentNotice";
import type { Provenance } from "@/types/content";
import { cn } from "@/lib/utils";

interface ArticleMetadataProps {
  publishedAt: string;
  category?: string;
  byline?: string | null;
  provenance?: Provenance;
  className?: string;
}

export function ArticleMetadata({
  publishedAt,
  category,
  byline,
  provenance,
  className,
}: ArticleMetadataProps) {
  return (
    <div className={cn("meta flex flex-wrap items-center gap-x-2 gap-y-1 text-xs", className)}>
      {provenance?.isDemo && <DemoBadge />}
      {category && (
        <>
          <span className="font-semibold uppercase tracking-wider text-ink">{category}</span>
          <span aria-hidden="true" className="text-rule-soft">·</span>
        </>
      )}
      <time dateTime={publishedAt}>{formatDate(publishedAt, "short")}</time>
      {byline && (
        <>
          <span aria-hidden="true" className="text-rule-soft">·</span>
          <span>By {byline}</span>
        </>
      )}
    </div>
  );
}
