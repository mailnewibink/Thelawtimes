import { cn } from "@/lib/utils";

type DividerVariant = "hairline" | "thin" | "thick" | "double" | "ornament";

interface PaperDividerProps {
  variant?: DividerVariant;
  className?: string;
}

/**
 * Printed-newspaper style horizontal rule.
 * Decorative — hidden from assistive technology.
 */
export function PaperDivider({ variant = "thin", className }: PaperDividerProps) {
  if (variant === "ornament") {
    return (
      <div
        role="presentation"
        aria-hidden="true"
        className={cn("flex items-center gap-3 text-ink", className)}
      >
        <span className="h-px flex-1 bg-rule" />
        <span className="font-display text-sm leading-none">✦</span>
        <span className="h-px flex-1 bg-rule" />
      </div>
    );
  }

  const styles: Record<Exclude<DividerVariant, "ornament">, string> = {
    hairline: "border-t border-rule-soft",
    thin: "border-t border-rule",
    thick: "border-t-[3px] border-ink",
    double: "h-[6px] border-y border-ink",
  };

  return <hr aria-hidden="true" className={cn("m-0 border-0", styles[variant], className)} />;
}
