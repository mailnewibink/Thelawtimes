import type { AiProvider } from "./types";
import type { AiTaskInput, AiTaskOutput } from "@/types/ai";
import { buildTaskPrompt } from "../prompts";

/**
 * OpenAI-compatible AI Provider.
 * Enforces JSON mode, system role isolation, and secret redaction.
 */
export class OpenAiProvider implements AiProvider {
  readonly id = "openai" as const;
  readonly name = "OpenAI Legal Intelligence";
  readonly defaultModel: string;
  private apiKey: string;

  constructor(apiKey?: string, model = "gpt-4o-mini") {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || "";
    this.defaultModel = model;
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async executeTask(input: AiTaskInput): Promise<AiTaskOutput> {
    if (!this.isAvailable()) {
      throw new Error("OpenAI API key is not configured on the server.");
    }

    const { systemPrompt, userPrompt } = buildTaskPrompt(input);
    const startTime = Date.now();
    const model = this.defaultModel;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text();
        const sanitized = errorBody.replace(/sk-[a-zA-Z0-9_-]+/gi, "sk-REDACTED");
        throw new Error(`OpenAI API error (${response.status}): ${sanitized.slice(0, 300)}`);
      }

      const data = await response.json();
      const rawText = data?.choices?.[0]?.message?.content;

      if (!rawText) {
        throw new Error("Empty response received from OpenAI model.");
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(`Model output was not valid JSON: ${String(parseErr)}`);
      }

      const inputTokens = data?.usage?.prompt_tokens || 0;
      const outputTokens = data?.usage?.completion_tokens || 0;
      const durationMs = Date.now() - startTime;

      return {
        taskType: input.taskType,
        provider: "openai",
        model,
        summary: parsed.summary as any,
        claims: parsed.claims as any,
        entitiesTimeline: parsed.entitiesTimeline as any,
        draft: parsed.draft as any,
        checklist: parsed.checklist as any,
        metadata: parsed.metadata as any,
        rawText,
        inputTokens,
        outputTokens,
        durationMs,
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      const msg = err instanceof Error ? err.message : String(err);
      const sanitized = msg.replace(/sk-[a-zA-Z0-9_-]+/gi, "sk-REDACTED");
      throw new Error(`OpenAI processing failed: ${sanitized}`);
    }
  }
}
