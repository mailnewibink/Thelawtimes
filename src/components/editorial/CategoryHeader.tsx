import { cn } from "@/lib/utils";
import { Breadcrumbs, BreadcrumbItem } from "@/components/navigation/Breadcrumbs";

interface CategoryHeaderProps {
  kicker?: string;
  title: string;
  description: string;
  editionInfo?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

export function CategoryHeader({
  kicker,
  title,
  description,
  editionInfo = "LEMBARAN RESMI & DOKUMENTASI HUKUM",
  breadcrumbs,
  className,
}: CategoryHeaderProps) {
  return (
    <header className={cn("pt-2 pb-4", className)}>
      {/* Breadcrumb line */}
      <div className="mb-3">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Top broadsheet double rules */}
      <div className="h-[5px] border-y border-ink mb-3" />

      {/* Header layout */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 pb-3">
        <div>
          {kicker && (
            <p className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-accent mb-1">
              {kicker}
            </p>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight uppercase leading-none">
            {title}
          </h1>
        </div>

        <div className="max-w-md md:text-right">
          <p className="font-sans text-[0.625rem] tracking-[0.18em] font-semibold text-ink-muted uppercase mb-1">
            {editionInfo}
          </p>
          <p className="font-serif text-xs sm:text-sm text-ink-soft italic leading-snug">
            {description}
          </p>
        </div>
      </div>

      {/* Decorative center star and bottom thin rule */}
      <div className="relative flex items-center justify-center my-1">
        <div className="w-full border-t border-rule" />
        <span className="absolute bg-paper px-3 font-serif text-xs text-ink/70">
          ✱
        </span>
      </div>
    </header>
  );
}
