import type { SourceReference } from "@/types/content";
import { cn } from "@/lib/utils";

interface SourceAttributionProps {
  sources: SourceReference[];
  className?: string;
}

export function SourceAttribution({ sources, className }: SourceAttributionProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <aside
      aria-label="Source attributions"
      className={cn("border-t-2 border-rule bg-paper-light p-4 text-xs", className)}
    >
      <h4 className="kicker text-[0.625rem] text-ink mb-2">Editorial Sources & References</h4>
      <ul className="space-y-1.5 font-serif text-ink-muted">
        {sources.map((src, idx) => (
          <li key={idx} className="flex items-start gap-1.5">
            <span aria-hidden="true" className="text-ink">❧</span>
            <span>
              <strong>{src.label}</strong>
              {src.publisher && ` — Issued by ${src.publisher}`}
              {src.url ? (
                <>
                  {" "}
                  ·{" "}
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-ink hover:text-ink-muted"
                  >
                    View Document
                  </a>
                </>
              ) : (
                <span className="italic ml-1 text-ink-muted">
                  (Official document link not attached in demo mode)
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
