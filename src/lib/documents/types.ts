/**
 * The Law Times - Document Intelligence Extraction Types
 */

export type ExtractionStatus = "success" | "partial" | "unsupported" | "empty" | "error";

export interface DocumentExtractionResult {
  text: string;
  characterCount: number;
  pageCountEstimate?: number;
  status: ExtractionStatus;
  mimeType: string;
  provenance: string;
  isConfidential: boolean;
  warning?: string;
  extractedAt: string;
}

export interface DocumentExtractionOptions {
  maxCharacters?: number;
  maxSizeBytes?: number;
  isConfidentialAllowed?: boolean;
  provenance?: string;
}
