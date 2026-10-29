-- ==============================================================================
-- THE LAW TIMES: GABUNGAN SEMUA MIGRASI (PASTE KE SUPABASE SQL EDITOR)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABEL PROFILES & TRIGGER
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'reader' CHECK (role IN ('reader', 'author', 'editor', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'reader',
    TRUE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. TABEL CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_no_self_parent CHECK (parent_id IS NULL OR parent_id <> id)
);

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. TABEL SOURCES
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_url TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('court', 'regulation', 'intellectual_property', 'government', 'publisher', 'manual')),
  access_method TEXT,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_sources_updated_at ON public.sources;
CREATE TRIGGER trg_sources_updated_at
  BEFORE UPDATE ON public.sources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. TABEL SOURCE RECORDS
CREATE TABLE IF NOT EXISTS public.source_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE RESTRICT,
  external_id TEXT,
  canonical_url TEXT,
  title TEXT NOT NULL,
  record_type TEXT,
  source_date TIMESTAMPTZ,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_hash TEXT,
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'reviewed', 'rejected')),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_source_records_source_external
  ON public.source_records (source_id, external_id)
  WHERE external_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_source_records_canonical_url
  ON public.source_records (canonical_url)
  WHERE canonical_url IS NOT NULL;

DROP TRIGGER IF EXISTS trg_source_records_updated_at ON public.source_records;
CREATE TRIGGER trg_source_records_updated_at
  BEFORE UPDATE ON public.source_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. TABEL LEGAL DOCUMENTS
CREATE TABLE IF NOT EXISTS public.legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_record_id UUID REFERENCES public.source_records(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL,
  document_number TEXT,
  document_year INTEGER,
  title TEXT NOT NULL,
  issuer TEXT,
  court_name TEXT,
  document_date DATE,
  effective_date DATE,
  legal_status TEXT,
  document_url TEXT,
  storage_path TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_legal_documents_updated_at ON public.legal_documents;
CREATE TRIGGER trg_legal_documents_updated_at
  BEFORE UPDATE ON public.legal_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. TABEL CASES
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  case_reference TEXT,
  court_name TEXT,
  case_type TEXT,
  case_status TEXT,
  outcome_summary TEXT,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  public_visibility BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_cases_updated_at ON public.cases;
CREATE TRIGGER trg_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. TABEL CASE DOCUMENTS
CREATE TABLE IF NOT EXISTS public.case_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  legal_document_id UUID NOT NULL REFERENCES public.legal_documents(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL DEFAULT 'related',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_case_document UNIQUE (case_id, legal_document_id)
);

-- 9. TABEL ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('news', 'announcement', 'case_summary', 'regulation_update', 'intellectual_property', 'legal_brief')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived')),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  featured_image_path TEXT,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_articles_updated_at ON public.articles;
CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. TABEL RELASI ARTIKEL
CREATE TABLE IF NOT EXISTS public.article_categories (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (article_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.article_sources (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  source_record_id UUID NOT NULL REFERENCES public.source_records(id) ON DELETE CASCADE,
  citation_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (article_id, source_record_id)
);

-- 11. TABEL EDITORIAL REVIEWS
CREATE TABLE IF NOT EXISTS public.editorial_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'changes_requested', 'rejected')),
  notes TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. TABEL AUTOMATION RUNS
CREATE TABLE IF NOT EXISTS public.automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'partial', 'failed')),
  records_found INTEGER NOT NULL DEFAULT 0,
  records_new INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. TABEL AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. INDEKS-INDEKS PERFORMA
CREATE INDEX IF NOT EXISTS idx_articles_status_published_at ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_content_type ON public.articles(content_type);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_cases_visibility ON public.cases(public_visibility);
CREATE INDEX IF NOT EXISTS idx_cases_reference ON public.cases(case_reference);
CREATE INDEX IF NOT EXISTS idx_legal_documents_type ON public.legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_documents_issuer ON public.legal_documents(issuer);

-- 15. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 'anon';
  END IF;

  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid() AND is_active = TRUE;

  RETURN COALESCE(v_role, 'reader');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.current_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.current_user_role() IN ('editor', 'admin');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_author_or_above()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.current_user_role() IN ('author', 'editor', 'admin');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 16. AKTIFKAN RLS DI SEMUA TABEL
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 17. POLICIES (ATURAN HAK AKSES)
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = TRUE OR public.is_editor_or_admin());

DROP POLICY IF EXISTS "Public can view enabled sources" ON public.sources;
CREATE POLICY "Public can view enabled sources" ON public.sources FOR SELECT USING (is_enabled = TRUE OR public.is_editor_or_admin());

DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING ((status = 'published' AND published_at IS NOT NULL) OR (auth.uid() = author_id) OR public.is_editor_or_admin());

DROP POLICY IF EXISTS "Public can view visible cases" ON public.cases;
CREATE POLICY "Public can view visible cases" ON public.cases FOR SELECT USING (public_visibility = TRUE OR public.is_editor_or_admin());

DROP POLICY IF EXISTS "Public can view public legal documents" ON public.legal_documents;
CREATE POLICY "Public can view public legal documents" ON public.legal_documents FOR SELECT USING (public.is_editor_or_admin() OR id IN (SELECT cd.legal_document_id FROM public.case_documents cd JOIN public.cases c ON c.id = cd.case_id WHERE c.public_visibility = TRUE));

DROP POLICY IF EXISTS "Public can view article categories of visible articles" ON public.article_categories;
CREATE POLICY "Public can view article categories of visible articles" ON public.article_categories FOR SELECT USING (public.is_editor_or_admin() OR article_id IN (SELECT a.id FROM public.articles a WHERE (a.status = 'published' AND a.published_at IS NOT NULL) OR a.author_id = auth.uid()));

DROP POLICY IF EXISTS "Public can view article sources of visible articles" ON public.article_sources;
CREATE POLICY "Public can view article sources of visible articles" ON public.article_sources FOR SELECT USING (public.is_editor_or_admin() OR article_id IN (SELECT a.id FROM public.articles a WHERE (a.status = 'published' AND a.published_at IS NOT NULL) OR a.author_id = auth.uid()));

-- 18. DEFAULT SEED DATA (Kategori & Contoh Artikel)
INSERT INTO public.categories (id, name, slug, description, sort_order)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Courts', 'courts', 'Courtroom proceedings, judicial benches, and docket updates', 1),
  ('c0000000-0000-0000-0000-000000000002', 'Legislation', 'legislation', 'Statutory enactments, bills, and parliament reviews', 2),
  ('c0000000-0000-0000-0000-000000000003', 'Business Law', 'business-law', 'Corporate compliance, mergers, and financial law', 3),
  ('c0000000-0000-0000-0000-000000000004', 'Civil Law', 'civil-law', 'Contracts, torts, and civil dispute resolution', 4),
  ('c0000000-0000-0000-0000-000000000005', 'Criminal Law', 'criminal-law', 'Criminal jurisprudence and procedural guidelines', 5),
  ('c0000000-0000-0000-0000-000000000006', 'Legal Profession', 'legal-profession', 'Bar associations, ethics, and practice administration', 6),
  ('c0000000-0000-0000-0000-000000000007', 'Trademarks', 'trademarks', 'Brand registrations, marks, and classification primers', 7),
  ('c0000000-0000-0000-0000-000000000008', 'Copyright', 'copyright', 'Literary, artistic, and software copyright regimes', 8),
  ('c0000000-0000-0000-0000-000000000009', 'Patents', 'patents', 'Invention specifications and patent claims', 9)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.articles (
  id,
  title,
  slug,
  excerpt,
  body,
  content_type,
  status,
  is_demo,
  featured_image_path,
  published_at
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'A Reader’s Guide to the Court Docket: How Hearings Are Scheduled and Reported',
    'sample-feature-reading-a-court-docket',
    'This fictional lead story demonstrates the front-page feature layout: a strong headline, a concise deck, a supporting illustration, and transparent sourcing.',
    'A feature of this kind would normally explain, step by step, how a reader can follow a matter from filing to decision. Here the paragraphs are placeholders so that the typographic rhythm can be reviewed without asserting any procedural fact.\n\nIn a later phase, this space will carry verified reporting prepared by the editorial desk. Each factual statement will be tied to a primary source listed in the source panel.\n\nReaders should not rely on this sample text for any legal purpose.',
    'news',
    'published',
    TRUE,
    '/images/courthouse.jpg',
    '2026-10-28 09:00:00+00'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Understanding Trademark Classes: A Sample Primer',
    'sample-ip-trademark-classes-explainer',
    'A fictional primer showing how trademark coverage will appear. No mark, owner or registration is referenced.',
    'This fictional record demonstrates how Intellectual Property articles appear in The Law Times. It makes no claim about any real work, author, brand or trademark dispute.\n\nIn later phases, verified updates from the IP Gazette will populate this section.',
    'intellectual_property',
    'published',
    TRUE,
    '/images/invention.jpg',
    '2026-10-27 10:30:00+00'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.article_categories (article_id, category_id)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;
