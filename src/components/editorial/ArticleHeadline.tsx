import Link from "next/link";
import { cn } from "@/lib/utils";

interface ArticleHeadlineProps {
  headline: string;
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ArticleHeadline({
  headline,
  href,
  size = "md",
  level = 2,
  className,
}: ArticleHeadlineProps) {
  const Heading = `h${level}` as const;

  const sizeClasses = {
    sm: "font-serif text-base sm:text-lg font-bold leading-snug",
    md: "font-display text-lg sm:text-xl font-bold leading-snug",
    lg: "font-display text-2xl sm:text-3xl font-bold leading-tight",
    xl: "font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight",
  };

  return (
    <Heading className={cn(sizeClasses[size], "text-ink", className)}>
      {href ? (
        <Link href={href} className="headline-link">
          {headline}
        </Link>
      ) : (
        headline
      )}
    </Heading>
  );
}
