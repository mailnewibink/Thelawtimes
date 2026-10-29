-- ==============================================================================
-- THE LAW TIMES - DATABASE MIGRATION: 00006_simplified_publication_model.sql
-- Simplified Implementation: Legal News Portal & Client Publication Model
-- ==============================================================================

-- 1. Add publication_type, SEO fields, source metadata, and document attachment URL
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS publication_type TEXT NOT NULL DEFAULT 'general_news'
    CHECK (publication_type IN ('client_publication', 'general_news')),
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS source_name TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 2. Performance indexes for publication type and public listing
CREATE INDEX IF NOT EXISTS idx_articles_publication_type
  ON public.articles (publication_type, status, published_at DESC);

-- 3. Update existing records if appropriate:
-- Announcements and case summaries default to client_publication
UPDATE public.articles
SET publication_type = 'client_publication'
WHERE content_type IN ('announcement', 'case_summary')
  AND publication_type = 'general_news';
