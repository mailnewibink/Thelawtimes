import type { Provenance, SourceReference } from "@/types/content";

/**
 * Shared helpers for the Phase 1 demo dataset.
 *
 * Everything produced here is explicitly fictional. These helpers exist so that
 * the demo marker and placeholder sources are consistent across all records.
 */

export const DEMO_PROVENANCE: Provenance = {
  isDemo: true,
  verification: "demo",
  note: "Fictional sample record created for Phase 1 layout demonstration.",
};

/** A placeholder source with no URL — Phase 1 never links to fake documents. */
export function placeholderSource(label: string): SourceReference {
  return {
    label,
    publisher: null,
    url: null,
    accessedOn: null,
  };
}

/**
 * Standard placeholder body copy. It describes the purpose of the record rather
 * than asserting any legal fact.
 */
export function demoBody(topic: string, extra: string[] = []): string[] {
  return [
    `This is fictional demonstration copy for a story about ${topic}. It exists only to show how a full article is typeset in The Law Times and does not describe any real event, person, institution, ruling or regulation.`,
    ...extra,
    "In a later phase, this space will carry verified reporting prepared by the editorial desk. Each factual statement will be tied to a primary source listed in the source panel, and any correction will be recorded transparently in accordance with the Corrections Policy.",
    "Readers should not rely on this sample text for any legal purpose. For advice about a specific matter, consult a qualified legal professional.",
  ];
}
