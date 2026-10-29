import crypto from "crypto";

export type SourceAccessMethod = "api" | "rss" | "html" | "manual" | "disabled";

export interface NormalizedSourceRecord {
  externalId: string;
  title: string;
  recordType?: string;
  sourceDate?: string | null;
  canonicalUrl?: string | null;
  rawDocumentUrl?: string | null;
  summaryAbstract?: string | null;
  metadata: Record<string, unknown>;
  contentHash: string;
}

export interface IngestionBatchResult {
  sourceId: string;
  recordsFound: number;
  records: NormalizedSourceRecord[];
  nextCheckpoint?: Record<string, unknown>;
  hasMore: boolean;
  warnings?: string[];
}

export interface ConnectorValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Common interface for all official source connector adapters.
 */
export interface SourceConnector {
  readonly id: string;
  readonly name: string;
  readonly accessMethod: SourceAccessMethod;

  validateConfig(config: Record<string, unknown>): Promise<ConnectorValidationResult>;
  checkConnectivity(endpoint?: string): Promise<boolean>;
  fetchBatch(params: {
    endpoint?: string;
    batchSize?: number;
    checkpoint?: Record<string, unknown>;
    config?: Record<string, unknown>;
  }): Promise<IngestionBatchResult>;
}

/**
 * Computes deterministic SHA-256 hash of record payload for change detection.
 */
export function computeRecordHash(data: {
  externalId: string;
  title: string;
  date?: string | null;
  url?: string | null;
  rawContent?: string | null;
}): string {
  const normalizedString = [
    data.externalId.trim(),
    data.title.trim().toLowerCase(),
    data.date || "",
    data.url || "",
    data.rawContent || "",
  ].join("||");

  return crypto.createHash("sha256").update(normalizedString).digest("hex");
}

/**
 * Validates external URL for safety (mitigates SSRF against private networks).
 */
export function isSafeOfficialUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    // Must be https or http
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    // Block private/local IP spaces
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.endsWith(".local") ||
      host.endsWith(".internal")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
