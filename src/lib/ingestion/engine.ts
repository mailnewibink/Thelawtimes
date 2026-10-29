import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { sourceRegistry } from "./registry";

export interface IngestionRunReport {
  runId: string;
  sourceId: string;
  status: "success" | "partial" | "failed";
  recordsFound: number;
  recordsNew: number;
  recordsUpdated: number;
  recordsUnchanged: number;
  recordsFailed: number;
  durationMs: number;
  errorMessage?: string;
}

/**
 * Orchestrates a complete ingestion cycle for a specified source.
 * Idempotently upserts records into `source_records`.
 */
export async function runSourceIngestion({
  sourceId,
  triggerType = "manual",
  batchSize = 10,
}: {
  sourceId: string;
  triggerType?: "manual" | "scheduled";
  batchSize?: number;
}): Promise<IngestionRunReport> {
  const startTime = Date.now();
  // Use admin client if available, or fall back to server client
  const supabase = getSupabaseAdminClient() || (await getSupabaseServerClient());

  let recordsFound = 0;
  let recordsNew = 0;
  let recordsUpdated = 0;
  let recordsUnchanged = 0;
  let recordsFailed = 0;

  if (!supabase) {
    return {
      runId: "dry-run",
      sourceId,
      status: "failed",
      recordsFound: 0,
      recordsNew: 0,
      recordsUpdated: 0,
      recordsUnchanged: 0,
      recordsFailed: 0,
      durationMs: 0,
      errorMessage: "Supabase client unconfigured.",
    };
  }

  // 1. Fetch Source metadata
  const { data: source, error: sourceError } = await (supabase as any)
    .from("sources")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (sourceError || !source) {
    return {
      runId: "dry-run",
      sourceId,
      status: "failed",
      recordsFound: 0,
      recordsNew: 0,
      recordsUpdated: 0,
      recordsUnchanged: 0,
      recordsFailed: 0,
      durationMs: Date.now() - startTime,
      errorMessage: sourceError?.message || "Source record not found.",
    };
  }

  // 2. Create Automation Run log (status = 'running')
  const { data: runLog } = await (supabase as any)
    .from("automation_runs")
    .insert({
      source_id: sourceId,
      status: "running",
      trigger_type: triggerType,
      records_found: 0,
      records_new: 0,
    })
    .select("id")
    .single();

  const runId = runLog?.id || "run-" + Date.now();

  try {
    // 3. Resolve Connector
    let connector = sourceRegistry.get("ma-putusan");
    if (source.source_type === "regulation") {
      connector = sourceRegistry.get("jdihn-regulation");
    } else if (source.access_method === "manual") {
      connector = sourceRegistry.get("manual-import");
    }

    if (!connector) {
      throw new Error(`No connector adapter found for source type: ${source.source_type}`);
    }

    // 4. Fetch batch of records
    const batchResult = await connector.fetchBatch({
      endpoint: source.verified_endpoint || source.base_url,
      batchSize,
      checkpoint: source.config_params?.checkpoint || {},
    });

    recordsFound = batchResult.recordsFound;

    // 5. Idempotent Upsert & Deduplication
    for (const rec of batchResult.records) {
      try {
        // Check existing record by external_id
        const { data: existing } = await (supabase as any)
          .from("source_records")
          .select("id, content_hash, review_status")
          .eq("source_id", sourceId)
          .eq("external_id", rec.externalId)
          .maybeSingle();

        if (!existing) {
          // Brand new record
          await (supabase as any).from("source_records").insert({
            source_id: sourceId,
            external_id: rec.externalId,
            canonical_url: rec.canonicalUrl,
            title: rec.title,
            record_type: rec.recordType,
            source_date: rec.sourceDate ? new Date(rec.sourceDate).toISOString() : null,
            raw_document_url: rec.rawDocumentUrl,
            summary_abstract: rec.summaryAbstract,
            metadata: rec.metadata,
            content_hash: rec.contentHash,
            review_status: "pending", // Always non-public pending
            is_demo: false,
          });
          recordsNew++;
        } else if (existing.content_hash !== rec.contentHash) {
          // Changed record -> update metadata, preserve review_status if already reviewed
          await (supabase as any)
            .from("source_records")
            .update({
              title: rec.title,
              canonical_url: rec.canonicalUrl,
              raw_document_url: rec.rawDocumentUrl,
              summary_abstract: rec.summaryAbstract,
              metadata: rec.metadata,
              content_hash: rec.contentHash,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          recordsUpdated++;
        } else {
          // Unchanged
          recordsUnchanged++;
        }
      } catch (err) {
        console.error("[IngestionEngine] Error upserting record:", rec.externalId, err);
        recordsFailed++;
      }
    }

    const durationMs = Date.now() - startTime;
    const finalStatus = recordsFailed > 0 && recordsNew === 0 ? "failed" : recordsFailed > 0 ? "partial" : "success";

    // 6. Update Automation Run & Source timestamps
    await (supabase as any)
      .from("automation_runs")
      .update({
        finished_at: new Date().toISOString(),
        status: finalStatus,
        records_found: recordsFound,
        records_new: recordsNew,
        records_updated: recordsUpdated,
        records_unchanged: recordsUnchanged,
        records_failed: recordsFailed,
        duration_ms: durationMs,
        checkpoint_data: batchResult.nextCheckpoint || {},
      })
      .eq("id", runId);

    await (supabase as any)
      .from("sources")
      .update({
        last_attempted_run: new Date().toISOString(),
        last_successful_run: finalStatus !== "failed" ? new Date().toISOString() : source.last_successful_run,
        last_error: recordsFailed > 0 ? `${recordsFailed} records failed to upsert` : null,
      })
      .eq("id", sourceId);

    return {
      runId,
      sourceId,
      status: finalStatus,
      recordsFound,
      recordsNew,
      recordsUpdated,
      recordsUnchanged,
      recordsFailed,
      durationMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error during ingestion.";
    const durationMs = Date.now() - startTime;

    await (supabase as any)
      .from("automation_runs")
      .update({
        finished_at: new Date().toISOString(),
        status: "failed",
        error_message: errorMsg,
        duration_ms: durationMs,
      })
      .eq("id", runId);

    await (supabase as any)
      .from("sources")
      .update({
        last_attempted_run: new Date().toISOString(),
        last_error: errorMsg,
      })
      .eq("id", sourceId);

    return {
      runId,
      sourceId,
      status: "failed",
      recordsFound,
      recordsNew,
      recordsUpdated,
      recordsUnchanged,
      recordsFailed,
      durationMs,
      errorMessage: errorMsg,
    };
  }
}
