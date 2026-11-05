import { formatDate } from "@/lib/utils";
import { DemoBadge } from "@/components/ui/DemoContentNotice";
import type { Provenance } from "@/types/content";
import { cn } from "@/lib/utils";

interface ArticleMetadataProps {
  publishedAt: string;
  category?: string;
  byline?: string | null;
  publicationType?: "client_publication" | "general_news";
  provenance?: Provenance;
  className?: string;
}

export function ArticleMetadata({
  publishedAt,
  category,
  byline,
  publicationType,
  provenance,
  className,
}: ArticleMetadataProps) {
  return (
    <div className={cn("meta flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] sm:text-xs", className)}>
      {provenance?.isDemo && <DemoBadge />}
      {publicationType === "client_publication" && (
        <>
          <span className="px-1.5 py-0.5 bg-ink text-paper text-[0.6rem] kicker uppercase font-bold tracking-wider">
            Publikasi Klien
          </span>
          <span aria-hidden="true" className="text-rule-soft">·</span>
        </>
      )}
      {category && (
        <>
          <span className="font-semibold uppercase tracking-wider text-ink">{category}</span>
          <span aria-hidden="true" className="text-rule-soft">·</span>
        </>
      )}
      <time dateTime={publishedAt} className="whitespace-nowrap shrink-0">{formatDate(publishedAt, "short")}</time>
      {byline && (
        <>
          <span aria-hidden="true" className="text-rule-soft">·</span>
          <span className="truncate max-w-[200px] sm:max-w-none">Oleh {byline}</span>
        </>
      )}
    </div>
  );
}
