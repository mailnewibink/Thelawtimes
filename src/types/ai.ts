/**
 * The Law Times - Phase 5 AI Intelligence Types
 * Defines data structures for server-side AI provider contracts,
 * structured legal document intelligence, source-grounded claim extraction,
 * and editorial draft assistance.
 */

export type AiTaskType =
  | "extract_metadata"
  | "document_summary"
  | "extract_claims"
  | "extract_entities_timeline"
  | "generate_draft"
  | "verification_checklist";

export type ClaimVerificationStatus = "verified" | "unverified" | "unsupported";

export interface AiClaim {
  claimText: string;
  claimType: "fact" | "procedural" | "holding" | "statutory" | "ruling" | "general";
  supportingSourceDocument?: string;
  pageOrSection?: string;
  supportingExcerpt?: string;
  sourceUrl?: string;
  verificationStatus: ClaimVerificationStatus;
  confidenceNotes?: string;
}

export interface AiDocumentSummary {
  documentType: string;
  facts: string[];
  proceduralHistory: string[];
  issuesDiscussed: string[];
  reasoning: string[];
  decisionOrConclusion: string;
  keyDatesAndProvisions: Array<{ label: string; dateOrRef: string }>;
  missingOrUnclearInfo: string[];
}

export interface AiEntitiesAndTimeline {
  institutions: string[];
  parties: string[];
  timeline: Array<{ date: string; event: string; sourceRef?: string }>;
}

export type DraftTemplateType =
  | "news"
  | "court_report"
  | "regulation_update"
  | "announcement"
  | "intellectual_property";

export interface AiDraftResult {
  template: DraftTemplateType;
  suggestedHeadlines: string[];
  deck: string;
  bodyMarkdown: string;
  relevantDates: string[];
  institutions: string[];
  sourceLinks: Array<{ label: string; url: string }>;
  claims: AiClaim[];
  missingInfo: string[];
  suggestedCategories: string[];
  suggestedTags: string[];
  editorialChecklist: string[];
}

export interface AiChecklistResult {
  criticalStatements: string[];
  flaggedItems: Array<{ item: string; reason: string; verificationRequired: boolean }>;
}

export interface AiTaskInput {
  taskType: AiTaskType;
  sourceRecord: {
    id: string;
    title: string;
    sourceName?: string;
    sourceType?: string;
    canonicalUrl?: string;
    externalId?: string;
    sourceDate?: string;
    metadata?: Record<string, unknown>;
  };
  documentText?: string;
  documentProvenance?: string;
  template?: DraftTemplateType;
  language?: "id" | "en";
}

export interface AiTaskOutput {
  taskType: AiTaskType;
  provider: string;
  model: string;
  summary?: AiDocumentSummary;
  claims?: AiClaim[];
  entitiesTimeline?: AiEntitiesAndTimeline;
  draft?: AiDraftResult;
  checklist?: AiChecklistResult;
  metadata?: Record<string, unknown>;
  inputTokens?: number;
  outputTokens?: number;
  durationMs?: number;
  rawText?: string;
}

export interface AiProviderConfigStatus {
  isConfigured: boolean;
  providerName: "gemini" | "openai" | "mock" | "disabled";
  modelName: string;
  reason?: string;
}
