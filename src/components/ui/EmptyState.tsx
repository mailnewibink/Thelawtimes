import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

/** Shown when a listing, search or filter yields nothing. */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn("border-y border-rule px-4 py-12 text-center", className)}
    >
      <p aria-hidden="true" className="font-display text-2xl text-ink-muted">
        ❧
      </p>
      <p className="mt-2 font-display text-xl font-bold sm:text-2xl">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-md font-serif text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="kicker mt-5 inline-block border border-ink px-4 py-2.5 hover:bg-ink hover:text-paper"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="kicker mt-5 inline-block cursor-pointer border border-ink px-4 py-2.5 hover:bg-ink hover:text-paper"
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}
