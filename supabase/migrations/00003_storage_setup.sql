-- ==============================================================================
-- THE LAW TIMES - DATABASE MIGRATION: 00003_storage_setup.sql
-- Phase 2: Private Document Storage Bucket Configuration & Access Policies
-- ==============================================================================

-- 1. Create the private 'legal-documents' bucket if it does not already exist
-- By setting public = false, direct anonymous URL access without signed URLs/authorization is blocked.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'legal-documents',
  'legal-documents',
  FALSE,
  52428800, -- 50 MB max per document
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/tiff',
    'image/jpeg',
    'image/png'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = FALSE,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/tiff',
      'image/jpeg',
      'image/png'
    ];

-- 2. Storage Policies for 'legal-documents'

-- READ / DOWNLOAD Policy:
-- Authorized editors, admins, or users requesting files associated with verified public documents
CREATE POLICY "Authorized access to legal documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'legal-documents'
    AND (
      -- Editors and admins can access any document in the bucket
      public.is_editor_or_admin()
      OR
      -- Publicly accessible files must be explicitly registered with a public case record
      name IN (
        SELECT ld.storage_path
        FROM public.legal_documents ld
        JOIN public.case_documents cd ON cd.legal_document_id = ld.id
        JOIN public.cases c ON c.id = cd.case_id
        WHERE c.public_visibility = TRUE AND ld.storage_path IS NOT NULL
      )
    )
  );

-- UPLOAD Policy:
-- Only editors and admins may upload official legal documents into storage
CREATE POLICY "Editors and admins can upload legal documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'legal-documents'
    AND public.is_editor_or_admin()
  );

-- UPDATE / DELETE Policy:
-- Restricted strictly to administrators
CREATE POLICY "Admins can update or delete legal documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'legal-documents'
    AND public.is_admin()
  );
