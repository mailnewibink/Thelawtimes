-- ==============================================================================
-- THE LAW TIMES - DATABASE MIGRATION: 00007_publication_requests.sql
-- Phase 7: Publication Services & Client Acquisition
-- ==============================================================================

-- 1. Create table for client publication requests
CREATE TABLE IF NOT EXISTS public.publication_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  applicant_name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  publication_type TEXT NOT NULL CHECK (
    publication_type IN (
      'case_publication',
      'ruling_publication',
      'legal_opinion',
      'ip_publication',
      'sponsored_content'
    )
  ),
  proposed_title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  document_path TEXT,
  document_name TEXT,
  document_size BIGINT,
  document_type TEXT,
  additional_message TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (
    status IN ('submitted', 'contacted', 'under_review', 'approved', 'rejected')
  ),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for efficient administration queries
CREATE INDEX IF NOT EXISTS idx_publication_requests_status_created
  ON public.publication_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_publication_requests_type
  ON public.publication_requests (publication_type);

CREATE INDEX IF NOT EXISTS idx_publication_requests_ref
  ON public.publication_requests (reference_number);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.publication_requests ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Anyone (anonymous or authenticated) can submit a publication request
DROP POLICY IF EXISTS "Public can submit publication requests" ON public.publication_requests;
CREATE POLICY "Public can submit publication requests"
  ON public.publication_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. RLS Policy: Only authenticated staff (editor, admin) can view or modify requests
-- Ensures applicant PII, uploaded files, and internal notes are never readable by the public
DROP POLICY IF EXISTS "Staff can view publication requests" ON public.publication_requests;
CREATE POLICY "Staff can view publication requests"
  ON public.publication_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('editor', 'admin')
        AND profiles.is_active = true
    )
  );

DROP POLICY IF EXISTS "Staff can update publication requests" ON public.publication_requests;
CREATE POLICY "Staff can update publication requests"
  ON public.publication_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('editor', 'admin')
        AND profiles.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('editor', 'admin')
        AND profiles.is_active = true
    )
  );

-- 6. Storage bucket for private submission documents (if storage schema exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('publication_documents', 'publication_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can upload into publication_documents bucket
DROP POLICY IF EXISTS "Public can upload submission documents" ON storage.objects;
CREATE POLICY "Public can upload submission documents"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'publication_documents');

-- Storage RLS: Only editors and admins can download or view submission documents
DROP POLICY IF EXISTS "Staff can read submission documents" ON storage.objects;
CREATE POLICY "Staff can read submission documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'publication_documents' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('editor', 'admin')
        AND profiles.is_active = true
    )
  );
