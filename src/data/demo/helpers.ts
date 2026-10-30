import type { Provenance, SourceReference } from "@/types/content";

/**
 * Shared helpers for The Law Times dataset.
 *
 * Menghasilkan rujukan dan penanda integritas editorial berbahasa Indonesia.
 */

export const DEMO_PROVENANCE: Provenance = {
  isDemo: true,
  verification: "demo",
  note: "Dokumentasi arsip dan warta hukum The Law Times.",
};

/** A placeholder source with no URL. */
export function placeholderSource(label: string): SourceReference {
  return {
    label,
    publisher: "Redaksi The Law Times",
    url: null,
    accessedOn: null,
  };
}

/**
 * Standard Indonesian editorial body copy.
 */
export function demoBody(topic: string, extra: string[] = []): string[] {
  return [
    `JAKARTA — Pembahasan mendalam mengenai ${topic} menjadi salah satu fokus perhatian para advokat, kurator, dan akademisi hukum seiring dinamika perkembangan regulasi serta yurisprudensi peradilan di Indonesia.`,
    ...extra,
    "Penerapan asas kepastian hukum dan transparansi peradilan menuntut pemahaman yang utuh terhadap setiap tahapan administrasi perkara maupun substansi hukum materiil yang berlaku.",
    "Dewan Redaksi The Law Times menyajikan ulasan ini sebagai bagian dari komitmen edukasi publik dan dokumentasi informasi hukum yang terstruktur, objektif, dan dapat dipertanggungjawabkan.",
  ];
}
