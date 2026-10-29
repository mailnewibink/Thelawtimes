import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface FieldValueProps {
  value: string | number | null | undefined;
  /** Text shown when the value is missing. Defaults to "Not available". */
  unavailableText?: string;
  className?: string;
}

/**
 * Renders a record field, or an explicit "unavailable" state when the value
 * has not been verified. Never invent a value to fill the gap.
 */
export function FieldValue({ value, unavailableText, className }: FieldValueProps) {
  if (value === null || value === undefined || value === "") {
    return (
      <span className={cn("italic text-ink-muted", className)}>
        {unavailableText ?? siteConfig.unavailableLabel}
        <span className="sr-only"> (unverified)</span>
      </span>
    );
  }
  return <span className={className}>{value}</span>;
}

interface FieldListProps {
  fields: Array<{ label: string; value: string | number | null | undefined; unavailableText?: string }>;
  className?: string;
  columns?: 1 | 2 | 3;
}

/** Definition list of record fields with consistent unavailable handling. */
export function FieldList({ fields, className, columns = 2 }: FieldListProps) {
  const cols = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3" }[columns];
  return (
    <dl className={cn("grid grid-cols-1 gap-x-6 gap-y-3", cols, className)}>
      {fields.map((f) => (
        <div key={f.label} className="border-t border-rule-soft pt-2">
          <dt className="kicker text-ink-muted">{f.label}</dt>
          <dd className="mt-0.5 font-serif text-[0.9375rem]">
            <FieldValue value={f.value} unavailableText={f.unavailableText} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
