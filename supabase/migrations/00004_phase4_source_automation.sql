-- ==============================================================================
-- THE LAW TIMES - DATABASE MIGRATION: 00004_phase4_source_automation.sql
-- Phase 4: Official Legal Source Automation & Ingestion Schema Extensions
-- ==============================================================================

-- 1. Extend public.sources with operational ingestion metadata
ALTER TABLE public.sources
  ADD COLUMN IF NOT EXISTS institution TEXT,
  ADD COLUMN IF NOT EXISTS verified_endpoint TEXT,
  ADD COLUMN IF NOT EXISTS polling_interval_minutes INTEGER NOT NULL DEFAULT 1440, -- default 24h
  ADD COLUMN IF NOT EXISTS rate_limit_rps NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS last_attempted_run TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_successful_run TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_error TEXT,
  ADD COLUMN IF NOT EXISTS attribution_text TEXT,
  ADD COLUMN IF NOT EXISTS config_params JSONB NOT NULL DEFAULT '{}'::jsonb;

-- 2. Extend public.automation_runs with granular telemetry counters
ALTER TABLE public.automation_runs
  ADD COLUMN IF NOT EXISTS trigger_type TEXT NOT NULL DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'scheduled')),
  ADD COLUMN IF NOT EXISTS records_updated INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS records_unchanged INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS records_skipped INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS records_failed INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS duration_ms INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS checkpoint_data JSONB NOT NULL DEFAULT '{}'::jsonb;

-- 3. Extend public.source_records with document storage tracking
ALTER TABLE public.source_records
  ADD COLUMN IF NOT EXISTS raw_document_url TEXT,
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS summary_abstract TEXT;

-- 4. Ingestion Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sources_is_enabled ON public.sources(is_enabled);
CREATE INDEX IF NOT EXISTS idx_source_records_review_status ON public.source_records(review_status);
CREATE INDEX IF NOT EXISTS idx_source_records_source_retrieved ON public.source_records(source_id, retrieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_runs_source_started ON public.automation_runs(source_id, started_at DESC);

-- 5. Seed Candidate Official Sources (if not present)
INSERT INTO public.sources (
  id, name, institution, source_type, access_method, base_url, verified_endpoint, description, is_enabled, polling_interval_minutes, attribution_text
) VALUES
  (
    's0000000-0000-0000-0000-000000000001',
    'Direktori Putusan Mahkamah Agung RI',
    'Mahkamah Agung Republik Indonesia',
    'court',
    'api',
    'https://putusan3.mahkamahagung.go.id',
    'https://putusan3.mahkamahagung.go.id/rest/putusan',
    'Portal resmi publikasi putusan dan yurisprudensi pengadilan se-Indonesia.',
    TRUE,
    720,
    'Sumber resmi: Direktori Putusan Mahkamah Agung Republik Indonesia (putusan3.mahkamahagung.go.id)'
  ),
  (
    's0000000-0000-0000-0000-000000000002',
    'Jaringan Dokumentasi dan Informasi Hukum Nasional (JDIHN)',
    'Badan Pembinaan Hukum Nasional (BPHN)',
    'regulation',
    'api',
    'https://jdihn.go.id',
    'https://api.jdihn.go.id/v1/peraturan',
    'Basis data tunggal dokumen hukum dan regulasi nasional Indonesia.',
    TRUE,
    1440,
    'Sumber resmi: Jaringan Dokumentasi dan Informasi Hukum Nasional (jdihn.go.id)'
  ),
  (
    's0000000-0000-0000-0000-000000000003',
    'Pangkalan Data Kekayaan Intelektual (PDKI)',
    'Direktorat Jenderal Kekayaan Intelektual (DJKI)',
    'intellectual_property',
    'manual',
    'https://pdki-indonesia.dgip.go.id',
    NULL,
    'Pangkalan data publik permohonan dan pendaftaran merek, paten, dan hak cipta. (Akses otomatis memerlukan otorisasi B2B, saat ini menggunakan impor manual).',
    FALSE,
    0,
    'Sumber resmi: DJKI Kementerian Hukum dan HAM RI (pdki-indonesia.dgip.go.id)'
  )
ON CONFLICT (id) DO UPDATE SET
  institution = EXCLUDED.institution,
  verified_endpoint = EXCLUDED.verified_endpoint,
  polling_interval_minutes = EXCLUDED.polling_interval_minutes,
  attribution_text = EXCLUDED.attribution_text;
