-- ==============================================================================
-- THE LAW TIMES - DEVELOPMENT SEED SCRIPT (seed.sql)
-- Phase 2 Controlled Development Seed Mechanism
--
-- GUIDELINES:
-- 1. All sample data is explicitly marked with is_demo = TRUE.
-- 2. No authentic court case numbers, party names, or trade secrets are fabricated.
-- 3. Does NOT seed admin accounts with hardcoded passwords.
-- ==============================================================================

-- 1. Categories
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

-- 2. Sources (Registry)
INSERT INTO public.sources (id, name, base_url, source_type, description, is_enabled)
VALUES
  ('s0000000-0000-0000-0000-000000000001', 'Mahkamah Agung RI (Registry Placeholder)', 'https://putusan3.mahkamahagung.go.id', 'court', 'Official Indonesian Supreme Court decision portal placeholder', TRUE),
  ('s0000000-0000-0000-0000-000000000002', 'JDIHN Portal (Registry Placeholder)', 'https://jdihn.go.id', 'regulation', 'National Legal Documentation and Information Network placeholder', TRUE),
  ('s0000000-0000-0000-0000-000000000003', 'DJKI Kemenkumham (Registry Placeholder)', 'https://pdki-indonesia.dgip.go.id', 'intellectual_property', 'Directorate General of Intellectual Property portal placeholder', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Published Articles (Demo Content)
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

-- 4. Article Categories
INSERT INTO public.article_categories (article_id, category_id)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- 5. Cases (Publicly Visible Demo Records)
INSERT INTO public.cases (
  id,
  title,
  slug,
  case_reference,
  court_name,
  case_type,
  case_status,
  outcome_summary,
  public_visibility,
  is_demo
)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'Demonstration Record: Commercial Contract Matter',
    'demo-commercial-contract-matter',
    NULL,
    'Commercial Court (Placeholder)',
    'Commercial',
    'Under Review',
    'This is a fictional archive record about a commercial contract dispute. It is not an actual legal case and does not describe any real party, court, filing, ruling or outcome.',
    TRUE,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;
