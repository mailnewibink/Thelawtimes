import type { Announcement } from "@/types/content";
import { DEMO_PROVENANCE } from "./helpers";

/**
 * DEMO ANNOUNCEMENTS — fictional sample notices for Phase 1.
 *
 * These are NOT legal notices. They carry no legal force, do not constitute a
 * court order or summons, and refer to no real person or organization.
 */
const demoNoticeBody = (kind: string): string[] => [
  `This is a fictional ${kind} created solely to demonstrate the formal notice layout of The Law Times. It has no legal force or effect and is not an official publication of any court, authority or party.`,
  "In a later phase, authentic notices supplied by a verified client or authority will appear in this format, accompanied by the original document, its issuing body and the date of publication.",
  "If you believe you have received a genuine legal notice, verify it directly with the issuing authority or consult a qualified legal professional.",
];

export const demoAnnouncements: Announcement[] = [
  {
    id: "ann-001",
    slug: "sample-public-notice-layout",
    title: "Sample Public Notice — Formal Layout Demonstration",
    type: "Public Notice",
    summary:
      "A fictional public notice illustrating the bordered, formal presentation used for official announcements.",
    body: demoNoticeBody("public notice"),
    publishedAt: "2026-10-28",
    relatedParty: null,
    document: { label: "Original notice document (placeholder)", url: null },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "ann-002",
    slug: "sample-summons-notice-layout",
    title: "Sample Court Summons Notice — Not a Real Summons",
    type: "Court Summons Notice",
    summary:
      "Demonstrates how a summons-type notice would be typeset. No person is summoned and no court is involved.",
    body: demoNoticeBody("court summons notice"),
    publishedAt: "2026-10-27",
    relatedParty: null,
    document: { label: "Summons document (placeholder)", url: null },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "ann-003",
    slug: "sample-corporate-notice-layout",
    title: "Sample Corporate Notice — General Meeting Announcement Format",
    type: "Corporate Notice",
    summary:
      "A fictional corporate notice showing where the related organization would be named when explicitly supplied.",
    body: demoNoticeBody("corporate notice"),
    publishedAt: "2026-10-25",
    relatedParty: "Example Organization (fictional placeholder)",
    document: null,
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "ann-004",
    slug: "sample-bankruptcy-notice-layout",
    title: "Sample Bankruptcy Notice — Format Demonstration Only",
    type: "Bankruptcy Notice",
    summary:
      "Illustrates the structure of an insolvency-related notice. It concerns no real debtor, creditor or curator.",
    body: demoNoticeBody("bankruptcy notice"),
    publishedAt: "2026-10-22",
    relatedParty: null,
    document: { label: "Notice document (placeholder)", url: null },
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "ann-005",
    slug: "sample-auction-notice-layout",
    title: "Sample Auction Notice — Layout Demonstration",
    type: "Auction Notice",
    summary:
      "A fictional auction notice used to show how dates and document placeholders are presented.",
    body: demoNoticeBody("auction notice"),
    publishedAt: "2026-10-18",
    relatedParty: null,
    document: null,
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "ann-006",
    slug: "sample-public-notice-correction-format",
    title: "Sample Notice of Correction — Format for Amended Announcements",
    type: "Public Notice",
    summary:
      "Shows how an amended or corrected announcement would be published. Entirely fictional.",
    body: demoNoticeBody("notice of correction"),
    publishedAt: "2026-10-12",
    relatedParty: null,
    document: null,
    provenance: DEMO_PROVENANCE,
  },
];
