import type {
  SourceConnector,
  ConnectorValidationResult,
  IngestionBatchResult,
} from "../types";

/**
 * Adapter representing manual file-based imports (e.g. for PDKI / DJKI or bespoke gazettes).
 * Explicitly marks automated polling as disabled.
 */
export class ManualImportConnector implements SourceConnector {
  readonly id = "manual-import";
  readonly name = "Manual Document & Gazette Import";
  readonly accessMethod = "manual" as const;

  async validateConfig(): Promise<ConnectorValidationResult> {
    return { valid: true };
  }

  async checkConnectivity(): Promise<boolean> {
    return true; // Manual connector is always available locally
  }

  async fetchBatch(): Promise<IngestionBatchResult> {
    return {
      sourceId: "s0000000-0000-0000-0000-000000000003",
      recordsFound: 0,
      records: [],
      hasMore: false,
      warnings: ["Source operates via manual CSV/JSON import; automated batch fetching is disabled."],
    };
  }
}
