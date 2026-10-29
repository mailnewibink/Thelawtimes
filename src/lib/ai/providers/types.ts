import type { AiTaskInput, AiTaskOutput } from "@/types/ai";

export interface AiProvider {
  readonly id: "gemini" | "openai" | "mock" | "disabled";
  readonly name: string;
  readonly defaultModel: string;
  isAvailable(): boolean;
  executeTask(input: AiTaskInput): Promise<AiTaskOutput>;
}
