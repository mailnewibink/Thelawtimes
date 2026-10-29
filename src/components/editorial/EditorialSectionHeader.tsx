import Link from "next/link";
import { cn } from "@/lib/utils";

interface EditorialSectionHeaderProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  action?: { label: string; href: string };
  level?: 2 | 3;
  className?: string;
}

/**
 * Editorial section divider reminiscent of broadsheet section heads.
 * Strong top/bottom rules, optional kicker and section jump link.
 */
export function EditorialSectionHeader({
  title,
  subtitle,
  kicker,
  action,
  level = 2,
  className,
}: EditorialSectionHeaderProps) {
  const Heading = `h${level}` as const;

  return (
    <header className={cn("border-b-2 border-t-[3px] border-ink py-2", className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          {kicker && <p className="kicker text-ink-muted">{kicker}</p>}
          <Heading className="font-display text-xl font-bold uppercase tracking-tight text-ink sm:text-2xl">
            {title}
          </Heading>
          {subtitle && (
            <p className="font-serif text-xs italic text-ink-muted sm:text-sm">{subtitle}</p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="kicker mt-1 inline-flex items-center gap-1 self-start border-b border-ink pb-0.5 text-xs text-ink hover:text-ink-muted sm:mt-0 sm:self-auto"
          >
            {action.label}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </header>
  );
}
