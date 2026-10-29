import Link from "next/link";
import type { Announcement } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { DemoBadge } from "@/components/ui/DemoContentNotice";
import { cn } from "@/lib/utils";

interface AnnouncementNoticeProps {
  announcement: Announcement;
  compact?: boolean;
  className?: string;
}

export function AnnouncementNotice({
  announcement,
  compact = false,
  className,
}: AnnouncementNoticeProps) {
  return (
    <article
      className={cn(
        "notice-frame p-4 sm:p-5 relative flex flex-col justify-between transition-shadow hover:shadow-sm",
        className
      )}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule-soft pb-2 mb-3">
          <span className="kicker text-[0.625rem] text-ink-muted">
            {announcement.type}
          </span>
          <div className="flex items-center gap-2">
            {announcement.provenance.isDemo && <DemoBadge />}
            <time className="meta text-xs" dateTime={announcement.publishedAt}>
              {formatDate(announcement.publishedAt, "short")}
            </time>
          </div>
        </div>

        <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-ink mb-2">
          <Link href={`/announcements#${announcement.slug}`} className="headline-link">
            {announcement.title}
          </Link>
        </h3>

        {!compact && (
          <p className="font-serif text-sm leading-relaxed text-ink-soft mb-3">
            {announcement.summary}
          </p>
        )}

        {announcement.relatedParty && (
          <p className="meta text-xs">
            <strong className="font-semibold text-ink">Related Party: </strong>
            {announcement.relatedParty}
          </p>
        )}
      </div>

      <div className="mt-4 pt-2 border-t border-rule-soft flex items-center justify-between text-xs">
        {announcement.document ? (
          <span className="font-serif italic text-ink-muted">
            Document attached ({announcement.document.label})
          </span>
        ) : (
          <span className="font-serif italic text-ink-muted">No external file</span>
        )}
        <span className="kicker text-[0.625rem] text-ink">Formal Notice</span>
      </div>
    </article>
  );
}
