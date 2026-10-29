/** Small, dependency-free utility helpers. */

/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats an ISO calendar date (YYYY-MM-DD) for display.
 * The date is interpreted as a calendar date (UTC) so it never shifts by a day
 * depending on the reader's time zone.
 */
export function formatDate(
  iso: string,
  style: "long" | "short" = "long",
): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  }).format(date);
}

export function sortByDateDesc<T>(items: readonly T[], getDate: (item: T) => string): T[] {
  return [...items].sort((a, b) => getDate(b).localeCompare(getDate(a)));
}

/** Lower-cases and strips diacritics/punctuation for forgiving search. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when every term in `query` appears in at least one of `fields`. */
export function matchesQuery(
  query: string,
  fields: Array<string | null | undefined>,
): boolean {
  const q = normalizeText(query);
  if (!q) return true;
  const haystack = normalizeText(fields.filter(Boolean).join(" "));
  return q.split(" ").every((term) => haystack.includes(term));
}

export interface PageResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(items: readonly T[], page: number, perPage: number): PageResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
    totalItems: items.length,
  };
}

/** Converts a label into a URL-safe slug, e.g. "Business Law" → "business-law". */
export function slugify(value: string): string {
  return normalizeText(value).replace(/&/g, "and").replace(/\s+/g, "-");
}
