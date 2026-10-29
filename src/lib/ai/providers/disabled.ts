import type { AiProvider } from "./types";
import type { AiTaskInput, AiTaskOutput } from "@/types/ai";

/**
 * Fallback provider when no server-side AI credentials (e.g. GEMINI_API_KEY, OPENAI_API_KEY) are configured.
 * Safely alerts editors with actionable instructions without crashing or exposing secrets.
 */
export class DisabledAiProvider implements AiProvider {
  readonly id = "disabled" as const;
  readonly name = "AI Provider Disabled";
  readonly defaultModel = "none";

  isAvailable(): boolean {
    return false;
  }

  async executeTask(_input?: AiTaskInput): Promise<AiTaskOutput> {
    void _input;
    throw new Error(
      "AI Intelligence is currently unconfigured. To enable AI editorial assistance, configure GEMINI_API_KEY or OPENAI_API_KEY in your server environment variables."
    );
  }
}
