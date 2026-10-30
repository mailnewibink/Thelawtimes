-- Migration 00008: Consultation Requests table
CREATE TABLE IF NOT EXISTS consultation_requests (
  id TEXT PRIMARY KEY,
  reference_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  company_or_brand TEXT,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  service_type TEXT NOT NULL,
  needs_description TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'Baru',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_service ON consultation_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created ON consultation_requests(created_at DESC);
