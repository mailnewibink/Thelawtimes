# The Law Times — Digital Broadsheet & Legal Archive

> **A Premium Classic Digital Legal Broadsheet & Documentation Archive for Indonesia.**

This repository contains **Phase 1** (Editorial Frontend & Design System) and **Phase 2** (Supabase Database Architecture, Row Level Security & Typed Repository Services) of **The Law Times**.

---

## 1. Project Overview

The Law Times combines two core functions:
1. **Permanent Legal Documentation Archive:** Public notices, court summons, insolvency announcements, case dockets, and official legal instruments.
2. **Editorial Broadsheet Journalism:** Independent coverage of court decisions, legislation, regulatory decrees, and intellectual property.

### Visual Design System
- **Palette:** Warm ivory newsprint background (`#F3F0E8`), primary near-black ink (`#171715`), muted charcoal secondary copy (`#5F5B54`), and crisp traditional broadsheet rules.
- **Typography:**
  - **Masthead:** Blackletter (`UnifrakturMaguntia`).
  - **Major Headlines & Sections:** High-contrast editorial serif (`Playfair Display`).
  - **Body Copy:** High-legibility editorial serif (`Source Serif 4`) with classic drop caps.
  - **Metadata, Kickers & Navigation:** Compact editorial sans (`Libre Franklin`).
- **Engraved Visuals:** 19th-century steel-engraving and woodcut illustrations in black ink on ivory paper.

---

## 2. Phase 2 Supabase Data Architecture

### Relational Schema & Migrations (`/supabase/migrations/`)
- `00001_initial_schema.sql`: Full normalized relational schema with foreign keys, constraints, and audit trails:
  - `profiles`: Application users with strictly enforced roles (`reader`, `author`, `editor`, `admin`).
  - `categories`: Hierarchical category tree with circular-reference checks.
  - `sources` & `source_records`: Ingestion and attribution registry with deduplication constraints.
  - `legal_documents`: Court filings, decrees, and official gazettes metadata.
  - `cases` & `case_documents`: Judicial dockets with `public_visibility` controls and JSONB timeline structures.
  - `articles`, `article_categories`, `article_sources`: Canonical editorial content with approval status workflow (`draft`, `in_review`, `approved`, `published`, `archived`).
  - `editorial_reviews`: Review notes and decision audit trail.
  - `automation_runs`: Observability for future scheduled source connectors.
  - `audit_logs`: Append-only security audit log.

### Row Level Security (RLS) (`00002_row_level_security.sql`)
- Least-privilege policies enabled across all exposed application tables:
  - **Anonymous/Public Readers:** Read-only access restricted strictly to `status = 'published'` articles, `public_visibility = true` cases, active categories, and source records linked to published content.
  - **Authors:** Can create and edit only their own drafts; cannot self-publish, change author attribution, or elevate roles.
  - **Editors & Admins:** Authorized to approve, edit, and curate content.
  - **Admins:** Server-side authorized access to manage roles and inspect audit logs.

### Private Document Storage (`00003_storage_setup.sql`)
- Private Supabase Storage bucket `legal-documents` (50MB limit per file, restricted MIME types).
- Public access blocked by default; access requires explicit relation to a verified public case record or editor privileges.

### Controlled Development Seed (`/supabase/seed.sql`)
- Seeds initial taxonomies and sample demo records explicitly marked with `is_demo = TRUE`.
- Never seeds admin accounts with hardcoded passwords or fictitious real-world credentials.

---

## 3. Environment Configuration & Setup

Copy the example environment configuration:
```bash
cp .env.example .env.local
```

Configure your Supabase project credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note on Missing Credentials:**
> If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not yet configured, The Law Times will automatically and safely fall back to the local demo dataset with clear `[DEMO]` badges, allowing full frontend inspection without broken pages.

### Applying Supabase Migrations
If using the Supabase CLI locally:
```bash
npx supabase start
npx supabase db reset
```
Or execute the migration scripts sequentially in your Supabase SQL Editor:
1. `supabase/migrations/00001_initial_schema.sql`
2. `supabase/migrations/00002_row_level_security.sql`
3. `supabase/migrations/00003_storage_setup.sql`
4. (Optional development seed) `supabase/seed.sql`

---

## 4. Development & Build Commands

### Prerequisites
- Node.js `v20.9.0` or higher
- npm `v10` or higher

### Install Dependencies
```bash
cd the-law-times
npm install
```

### Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Run Verification Tests
```bash
npx tsx src/test-verification.mts
```

### Type Checking & Linting
```bash
npx tsc --noEmit
npm run lint
```

### Production Build
```bash
npm run build
npm run start
```
