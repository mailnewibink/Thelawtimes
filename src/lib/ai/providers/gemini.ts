import type { AiProvider } from "./types";
import type { AiTaskInput, AiTaskOutput } from "@/types/ai";
import { buildTaskPrompt } from "../prompts";

/**
 * Production-ready Google Gemini AI Provider.
 * Enforces JSON mode, system instruction isolation, strict timeouts, and error secret redaction.
 */
export class GeminiAiProvider implements AiProvider {
  readonly id = "gemini" as const;
  readonly name = "Google Gemini Intelligence";
  readonly defaultModel: string;
  private apiKey: string;

  constructor(apiKey?: string, model = "gemini-2.5-flash") {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.defaultModel = model;
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async executeTask(input: AiTaskInput): Promise<AiTaskOutput> {
    if (!this.isAvailable()) {
      throw new Error("Gemini API key is not configured on the server.");
    }

    const { systemPrompt, userPrompt } = buildTaskPrompt(input);
    const startTime = Date.now();
    const model = this.defaultModel;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text();
        // Redact any potential query params or keys from message
        const sanitized = errorBody.replace(/key=[^&\s"]+/gi, "key=REDACTED");
        throw new Error(`Gemini API error (${response.status}): ${sanitized.slice(0, 300)}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Empty response received from Gemini model.");
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(`Model output was not valid JSON: ${String(parseErr)}`);
      }

      const inputTokens = data?.usageMetadata?.promptTokenCount || 0;
      const outputTokens = data?.usageMetadata?.candidatesTokenCount || 0;
      const durationMs = Date.now() - startTime;

      return {
        taskType: input.taskType,
        provider: "gemini",
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
      const redacted = msg.replace(/key=[^&\s"]+/gi, "key=REDACTED");
      throw new Error(`Gemini processing failed: ${redacted}`);
    }
  }
}
