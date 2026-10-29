import { createHash } from "node:crypto";
import type { AiProvider } from "./providers/types";
import { GeminiAiProvider } from "./providers/gemini";
import { OpenAiProvider } from "./providers/openai";
import { MockAiProvider } from "./providers/mock";
import { DisabledAiProvider } from "./providers/disabled";
import type { AiProviderConfigStatus, AiTaskInput, AiTaskOutput } from "@/types/ai";
import { getSupabaseServerClient } from "@/lib/supabase/server";

let customProviderInstance: AiProvider | null = null;

/**
 * Allows test suites to inject a specific provider instance (e.g. MockAiProvider).
 */
export function setTestAiProvider(provider: AiProvider | null) {
  customProviderInstance = provider;
}

/**
 * Resolves the active server-side AI Provider based on environment variables.
 */
export function getActiveAiProvider(): AiProvider {
  if (customProviderInstance) {
    return customProviderInstance;
  }

  // 1. Google Gemini
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
    return new GeminiAiProvider(process.env.GEMINI_API_KEY);
  }

  // 2. OpenAI
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "") {
    return new OpenAiProvider(process.env.OPENAI_API_KEY);
  }

  // 3. Explicit Mock or Test / Demo Mode
  if (
    process.env.USE_MOCK_AI === "true" ||
    process.env.NODE_ENV === "test" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  ) {
    return new MockAiProvider();
  }

  // 4. Safe Disabled state
  return new DisabledAiProvider();
}

/**
 * Returns the non-sensitive public configuration status of the AI engine.
 */
export function getAiConfigStatus(): AiProviderConfigStatus {
  const provider = getActiveAiProvider();
  return {
    isConfigured: provider.isAvailable(),
    providerName: provider.id,
    modelName: provider.defaultModel,
    reason:
      provider.id === "disabled"
        ? "No API key configured (GEMINI_API_KEY or OPENAI_API_KEY)."
        : undefined,
  };
}

/**
 * Executes an AI editorial task with audit logging, usage tracking, and claims persistence.
 */
export async function executeAiEditorialTask(
  input: AiTaskInput,
  options?: {
    userId?: string;
    legalDocumentId?: string;
    isConfidentialAllowed?: boolean;
  }
): Promise<AiTaskOutput> {
  const provider = getActiveAiProvider();

  // Input validation & size limits
  const combinedText = `${input.sourceRecord.title} ${input.documentText || ""}`;
  if (combinedText.length > 120_000) {
    throw new Error("Input payload exceeds maximum character limit of 120,000 characters.");
  }

  // Confidential file boundary protection
  if (input.documentProvenance?.includes("confidential") && !options?.isConfidentialAllowed) {
    throw new Error(
      "Document is designated confidential. External AI analysis is prohibited without documented security clearance."
    );
  }

  const inputHash = createHash("sha256").update(combinedText).digest("hex");
  const supabase = await getSupabaseServerClient();

  // 1. Initialize task record in database
  let taskId: string | null = null;
  if (supabase) {
    try {
      const { data: taskRecord, error: insertError } = await (supabase as any)
        .from("ai_tasks")
        .insert({
          task_type: input.taskType,
          source_record_id: input.sourceRecord.id || null,
          legal_document_id: options?.legalDocumentId || null,
          requested_by: options?.userId || null,
          provider: provider.id,
          model: provider.defaultModel,
          status: "processing",
          input_hash: inputHash,
        })
        .select("id")
        .single();

      if (!insertError && taskRecord) {
        taskId = taskRecord.id;
      }
    } catch {
      // If table not present yet or offline, task continues gracefully
    }
  }

  try {
    // 2. Execute task through active provider
    const output = await provider.executeTask(input);

    // 3. Record task completion and persistence
    if (taskId) {
      try {
        await (supabase as any)
          .from("ai_tasks")
          .update({
            status: "completed",
            input_tokens: output.inputTokens || 0,
            output_tokens: output.outputTokens || 0,
            duration_ms: output.durationMs || 0,
            result_json: output,
          })
          .eq("id", taskId);

        // If task extracted claims, persist them into ai_claims
        if (output.claims && output.claims.length > 0 && input.sourceRecord.id) {
          const claimsRows = output.claims.map((c) => ({
            ai_task_id: taskId,
            source_record_id: input.sourceRecord.id,
            claim_text: c.claimText,
            claim_type: c.claimType,
            supporting_excerpt: c.supportingExcerpt || null,
            page_or_section: c.pageOrSection || null,
            source_url: c.sourceUrl || null,
            verification_status: c.verificationStatus,
            confidence_notes: c.confidenceNotes || null,
          }));

          await (supabase as any).from("ai_claims").insert(claimsRows);
        }

        // Audit log entry
        await (supabase as any).from("audit_logs").insert({
          actor_id: options?.userId || null,
          action: "ai.task.complete",
          entity_type: "ai_tasks",
          entity_id: taskId,
          metadata: {
            task_type: input.taskType,
            provider: provider.id,
            model: provider.defaultModel,
            duration_ms: output.durationMs,
            source_record_id: input.sourceRecord.id,
          },
        });
      } catch {
        // Logging fail safe
      }
    }

    return output;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Sanitize any accidental secrets
    const redactedError = errorMsg
      .replace(/key=[^&\s"]+/gi, "key=REDACTED")
      .replace(/sk-[a-zA-Z0-9_-]+/gi, "sk-REDACTED");

    if (taskId) {
      try {
        await (supabase as any)
          .from("ai_tasks")
          .update({
            status: "failed",
            error_redacted: redactedError,
          })
          .eq("id", taskId);
      } catch {
        // fail safe
      }
    }

    throw new Error(redactedError);
  }
}
