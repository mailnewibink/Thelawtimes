-- ==============================================================================
-- THE LAW TIMES - DATABASE MIGRATION: 00005_phase5_ai_editorial.sql
-- Phase 5: AI-Assisted Editorial & Legal Document Intelligence
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. AI TASKS (Tracking AI Runs, Cost/Usage Metrics & Structured Results)
-- ------------------------------------------------------------------------------
-- Task types:
-- 'extract_metadata', 'document_summary', 'extract_claims', 
-- 'extract_entities_timeline', 'generate_draft', 'verification_checklist'
--
-- Allowed statuses:
-- 'pending', 'processing', 'completed', 'failed', 'rejected'
CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT NOT NULL CHECK (
    task_type IN (
      'extract_metadata',
      'document_summary',
      'extract_claims',
      'extract_entities_timeline',
      'generate_draft',
      'verification_checklist'
    )
  ),
  source_record_id UUID REFERENCES public.source_records(id) ON DELETE SET NULL,
  legal_document_id UUID REFERENCES public.legal_documents(id) ON DELETE SET NULL,
  requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'rejected')),
  input_hash TEXT,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  error_redacted TEXT,
  result_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_tasks_source_record ON public.ai_tasks(source_record_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_document ON public.ai_tasks(legal_document_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_requested_by ON public.ai_tasks(requested_by);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_created_at ON public.ai_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON public.ai_tasks(status);

DROP TRIGGER IF EXISTS trg_ai_tasks_updated_at ON public.ai_tasks;
CREATE TRIGGER trg_ai_tasks_updated_at
  BEFORE UPDATE ON public.ai_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 2. AI CLAIMS (Grounded Claim-to-Source Mapping & Verification States)
-- ------------------------------------------------------------------------------
-- Verification statuses: 'verified', 'unverified', 'unsupported'
CREATE TABLE IF NOT EXISTS public.ai_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_task_id UUID NOT NULL REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
  source_record_id UUID REFERENCES public.source_records(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  supporting_excerpt TEXT,
  page_or_section TEXT,
  source_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'unverified', 'unsupported')),
  confidence_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_claims_task ON public.ai_claims(ai_task_id);
CREATE INDEX IF NOT EXISTS idx_ai_claims_source ON public.ai_claims(source_record_id);
CREATE INDEX IF NOT EXISTS idx_ai_claims_status ON public.ai_claims(verification_status);

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_claims ENABLE ROW LEVEL SECURITY;

-- AI Tasks: Only authorized editors and admins can view and create AI task records
CREATE POLICY "Editors and admins can view ai_tasks"
  ON public.ai_tasks FOR SELECT
  USING (public.is_editor_or_admin());

CREATE POLICY "Editors and admins can insert ai_tasks"
  ON public.ai_tasks FOR INSERT
  WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins can update ai_tasks"
  ON public.ai_tasks FOR UPDATE
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- AI Claims: Only authorized editors and admins can view and insert claims
CREATE POLICY "Editors and admins can view ai_claims"
  ON public.ai_claims FOR SELECT
  USING (public.is_editor_or_admin());

CREATE POLICY "Editors and admins can insert ai_claims"
  ON public.ai_claims FOR INSERT
  WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors and admins can update ai_claims"
  ON public.ai_claims FOR UPDATE
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());
