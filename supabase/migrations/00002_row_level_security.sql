-- ==============================================================================
-- THE LAW TIMES - DATABASE MIGRATION: 00002_row_level_security.sql
-- Phase 2: Least-Privilege Row Level Security (RLS) Policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- HELPER FUNCTIONS FOR ROLE-BASED ACCESS CONTROL (SECURITY DEFINER)
-- ------------------------------------------------------------------------------
-- These helper functions run with table owner privileges to safely verify the
-- caller's assigned role in public.profiles without causing recursive RLS loops.

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

-- ------------------------------------------------------------------------------
-- 1. ENABLE RLS ON ALL APPLICATION TABLES
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. POLICIES: PROFILES
-- ------------------------------------------------------------------------------
-- Users can view their own profile. Editors and admins can view active profiles.
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_editor_or_admin());

-- Users can update their own full_name only (never change role or is_active)
CREATE POLICY "Users can update their own profile name"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND is_active = (SELECT is_active FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can update any profile (roles, active status)
CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. POLICIES: CATEGORIES
-- ------------------------------------------------------------------------------
-- Public/anonymous can read active categories
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE OR public.is_editor_or_admin());

-- Editors and Admins can manage categories
CREATE POLICY "Editors and admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 4. POLICIES: SOURCES
-- ------------------------------------------------------------------------------
-- Public can read enabled sources (needed for source attribution on published items)
CREATE POLICY "Public can view enabled sources"
  ON public.sources FOR SELECT
  USING (is_enabled = TRUE OR public.is_editor_or_admin());

CREATE POLICY "Editors and admins can manage sources"
  ON public.sources FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 5. POLICIES: SOURCE RECORDS
-- ------------------------------------------------------------------------------
-- Source records are not public by default. Only source records linked to published
-- articles, or visible to editors/admins, can be selected.
CREATE POLICY "View source records linked to published articles"
  ON public.source_records FOR SELECT
  USING (
    public.is_editor_or_admin()
    OR id IN (
      SELECT asrc.source_record_id
      FROM public.article_sources asrc
      JOIN public.articles a ON a.id = asrc.article_id
      WHERE a.status = 'published' AND a.published_at IS NOT NULL
    )
  );

CREATE POLICY "Editors and admins can manage source records"
  ON public.source_records FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 6. POLICIES: LEGAL DOCUMENTS
-- ------------------------------------------------------------------------------
-- Public can view legal document metadata if linked to a published case or article,
-- or if designated public. Unpublished/confidential case documents remain private.
CREATE POLICY "Public can view public legal documents"
  ON public.legal_documents FOR SELECT
  USING (
    public.is_editor_or_admin()
    OR id IN (
      SELECT cd.legal_document_id
      FROM public.case_documents cd
      JOIN public.cases c ON c.id = cd.case_id
      WHERE c.public_visibility = TRUE
    )
  );

CREATE POLICY "Editors and admins can manage legal documents"
  ON public.legal_documents FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 7. POLICIES: CASES
-- ------------------------------------------------------------------------------
-- Public can view cases ONLY when public_visibility = TRUE
CREATE POLICY "Public can view visible cases"
  ON public.cases FOR SELECT
  USING (public_visibility = TRUE OR public.is_editor_or_admin());

CREATE POLICY "Editors and admins can manage cases"
  ON public.cases FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 8. POLICIES: CASE DOCUMENTS
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view case documents for visible cases"
  ON public.case_documents FOR SELECT
  USING (
    public.is_editor_or_admin()
    OR case_id IN (
      SELECT c.id FROM public.cases c WHERE c.public_visibility = TRUE
    )
  );

CREATE POLICY "Editors and admins can manage case documents"
  ON public.case_documents FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 9. POLICIES: ARTICLES
-- ------------------------------------------------------------------------------
-- Public can view articles ONLY if status = 'published' and published_at is set
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  USING (
    (status = 'published' AND published_at IS NOT NULL)
    OR (auth.uid() = author_id)
    OR public.is_editor_or_admin()
  );

-- Authors can insert their own draft articles
CREATE POLICY "Authors can create draft articles"
  ON public.articles FOR INSERT
  WITH CHECK (
    public.is_author_or_above()
    AND author_id = auth.uid()
    AND status = 'draft'
  );

-- Authors can update their own draft articles (cannot self-publish or change author_id)
CREATE POLICY "Authors can update own draft articles"
  ON public.articles FOR UPDATE
  USING (auth.uid() = author_id AND status IN ('draft', 'in_review'))
  WITH CHECK (
    auth.uid() = author_id
    AND (
      -- If user is author only, they cannot set status to 'published' or 'approved'
      public.is_editor_or_admin()
      OR status IN ('draft', 'in_review')
    )
  );

-- Editors and Admins have full access to manage articles
CREATE POLICY "Editors and admins can manage all articles"
  ON public.articles FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 10. POLICIES: ARTICLE CATEGORIES & SOURCES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view article categories of visible articles"
  ON public.article_categories FOR SELECT
  USING (
    public.is_editor_or_admin()
    OR article_id IN (
      SELECT a.id FROM public.articles a
      WHERE (a.status = 'published' AND a.published_at IS NOT NULL) OR a.author_id = auth.uid()
    )
  );

CREATE POLICY "Authors, editors, and admins can manage article categories"
  ON public.article_categories FOR ALL
  USING (
    public.is_editor_or_admin()
    OR article_id IN (
      SELECT a.id FROM public.articles a
      WHERE a.author_id = auth.uid() AND a.status IN ('draft', 'in_review')
    )
  );

CREATE POLICY "Public can view article sources of visible articles"
  ON public.article_sources FOR SELECT
  USING (
    public.is_editor_or_admin()
    OR article_id IN (
      SELECT a.id FROM public.articles a
      WHERE (a.status = 'published' AND a.published_at IS NOT NULL) OR a.author_id = auth.uid()
    )
  );

CREATE POLICY "Authors, editors, and admins can manage article sources"
  ON public.article_sources FOR ALL
  USING (
    public.is_editor_or_admin()
    OR article_id IN (
      SELECT a.id FROM public.articles a
      WHERE a.author_id = auth.uid() AND a.status IN ('draft', 'in_review')
    )
  );

-- ------------------------------------------------------------------------------
-- 11. POLICIES: EDITORIAL REVIEWS
-- ------------------------------------------------------------------------------
-- Only editors and admins can view or create review notes
CREATE POLICY "Editors and admins can manage editorial reviews"
  ON public.editorial_reviews FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 12. POLICIES: AUTOMATION RUNS
-- ------------------------------------------------------------------------------
-- Only editors and admins can inspect automation run logs
CREATE POLICY "Editors and admins can view automation runs"
  ON public.automation_runs FOR ALL
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 13. POLICIES: AUDIT LOGS
-- ------------------------------------------------------------------------------
-- Only admins can view audit logs. Nobody can update or delete audit logs.
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Service and authenticated users can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL OR actor_id IS NULL);
