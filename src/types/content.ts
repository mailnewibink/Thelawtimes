/**
 * Core content types for The Law Times.
 *
 * Every record carries an explicit `provenance` block. In Phase 1 every record
 * is demonstration content (`isDemo: true`, `verification: "demo"`). Later
 * phases will replace the demo dataset with verified records that use the same
 * shapes, so UI components never need to be rewritten.
 *
 * Convention: a field that has no verified value is `null`. Components must
 * render an explicit "unavailable" state for `null` instead of inventing data.
 */

export type VerificationStatus = "demo" | "unverified" | "verified";

export interface Provenance {
  /** True for fictional / sample records. Must be rendered visibly in the UI. */
  isDemo: boolean;
  verification: VerificationStatus;
  /** Optional free-text note shown alongside the demo marker. */
  note?: string;
}

export interface SourceReference {
  /** Human readable label, e.g. "Official gazette (placeholder)". */
  label: string;
  /** Publisher or institution of the source. `null` when not verified. */
  publisher: string | null;
  /**
   * URL to the source document. Always `null` in Phase 1 — fake links to
   * official documents are never created.
   */
  url: string | null;
  /** ISO date the source was accessed, if known. */
  accessedOn: string | null;
}

export interface ContentImage {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

/* -------------------------------------------------------------------------- */
/* Articles                                                                   */
/* -------------------------------------------------------------------------- */

export type ArticleSection = "legal-news" | "intellectual-property";

export type LegalNewsCategory =
  | "Courts"
  | "Legislation"
  | "Business Law"
  | "Criminal Law"
  | "Civil Law"
  | "Legal Profession";

export type IntellectualPropertyCategory =
  | "Trademarks"
  | "Copyright"
  | "Patents"
  | "Industrial Designs"
  | "Other IP";

export type ArticleCategory = LegalNewsCategory | IntellectualPropertyCategory;

export interface Article {
  id: string;
  slug: string;
  section: ArticleSection;
  category: ArticleCategory;
  headline: string;
  /** Optional secondary headline / deck. */
  deck?: string;
  excerpt: string;
  /** Body paragraphs. Plain text in Phase 1. */
  body: string[];
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  updatedAt: string | null;
  byline: string | null;
  image?: ContentImage;
  sources: SourceReference[];
  featured?: boolean;
  provenance: Provenance;
}

/* -------------------------------------------------------------------------- */
/* Announcements                                                              */
/* -------------------------------------------------------------------------- */

export type AnnouncementType =
  | "Court Summons Notice"
  | "Bankruptcy Notice"
  | "Corporate Notice"
  | "Public Notice"
  | "Auction Notice";

export interface Announcement {
  id: string;
  slug: string;
  title: string;
  type: AnnouncementType;
  summary: string;
  body: string[];
  publishedAt: string;
  /** Related organization or client — only when explicitly supplied. */
  relatedParty: string | null;
  /** Placeholder for an attached document. URL is `null` until verified. */
  document: { label: string; url: string | null } | null;
  provenance: Provenance;
}

/* -------------------------------------------------------------------------- */
/* Cases                                                                      */
/* -------------------------------------------------------------------------- */

export type CaseCategory =
  | "Civil"
  | "Commercial"
  | "Bankruptcy & PKPU"
  | "Intellectual Property"
  | "Administrative"
  | "Industrial Relations";

export type CaseStatus =
  | "Open"
  | "Under Review"
  | "Adjourned"
  | "Closed";

export interface CaseTimelineEntry {
  /** ISO date, or `null` if the date is not verified. */
  date: string | null;
  title: string;
  description: string;
}

export interface CaseDocument {
  label: string;
  kind: string;
  url: string | null;
}

export interface CaseRecord {
  id: string;
  slug: string;
  title: string;
  /** Official reference number. `null` unless verified. */
  reference: string | null;
  /** Internal archive reference — always a clearly non-official identifier. */
  archiveId: string;
  court: string | null;
  category: CaseCategory;
  caseType: string | null;
  status: CaseStatus | null;
  year: number;
  summary: string[];
  timeline: CaseTimelineEntry[];
  documents: CaseDocument[];
  relatedAnnouncementSlugs: string[];
  relatedArticleSlugs: string[];
  lastUpdated: string;
  provenance: Provenance;
}

/* -------------------------------------------------------------------------- */
/* Regulations                                                                */
/* -------------------------------------------------------------------------- */

export type RegulationType =
  | "Law"
  | "Government Regulation"
  | "Presidential Regulation"
  | "Ministerial Regulation"
  | "Agency Regulation"
  | "Regional Regulation";

export type RegulationStatus = "In Force" | "Amended" | "Revoked" | "Draft";

export interface Regulation {
  id: string;
  slug: string;
  title: string;
  type: RegulationType;
  /** Regulation number — `null` unless verified. */
  number: string | null;
  year: number | null;
  issuingInstitution: string | null;
  publishedAt: string;
  effectiveDate: string | null;
  status: RegulationStatus | null;
  summary: string;
  body: string[];
  source: SourceReference;
  provenance: Provenance;
}
