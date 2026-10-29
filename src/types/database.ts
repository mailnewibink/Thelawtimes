/**
 * Supabase Database TypeScript Definitions.
 * Reflects schema migrations:
 * - 00001_initial_schema.sql
 * - 00002_row_level_security.sql
 * - 00003_storage_setup.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "reader" | "author" | "editor" | "admin";
export type ArticleContentType =
  | "news"
  | "announcement"
  | "case_summary"
  | "regulation_update"
  | "intellectual_property"
  | "legal_brief";
export type ArticleStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "published"
  | "archived";
export type SourceType =
  | "court"
  | "regulation"
  | "intellectual_property"
  | "government"
  | "publisher"
  | "manual";
export type ReviewStatus = "pending" | "reviewed" | "rejected";
export type EditorialDecision = "approved" | "changes_requested" | "rejected";
export type AutomationStatus = "running" | "success" | "partial" | "failed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      sources: {
        Row: {
          id: string;
          name: string;
          base_url: string | null;
          source_type: SourceType;
          access_method: string | null;
          description: string | null;
          is_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          base_url?: string | null;
          source_type: SourceType;
          access_method?: string | null;
          description?: string | null;
          is_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          base_url?: string | null;
          source_type?: SourceType;
          access_method?: string | null;
          description?: string | null;
          is_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      source_records: {
        Row: {
          id: string;
          source_id: string;
          external_id: string | null;
          canonical_url: string | null;
          title: string;
          record_type: string | null;
          source_date: string | null;
          retrieved_at: string;
          metadata: Json;
          content_hash: string | null;
          review_status: ReviewStatus;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_id: string;
          external_id?: string | null;
          canonical_url?: string | null;
          title: string;
          record_type?: string | null;
          source_date?: string | null;
          retrieved_at?: string;
          metadata?: Json;
          content_hash?: string | null;
          review_status?: ReviewStatus;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string;
          external_id?: string | null;
          canonical_url?: string | null;
          title?: string;
          record_type?: string | null;
          source_date?: string | null;
          retrieved_at?: string;
          metadata?: Json;
          content_hash?: string | null;
          review_status?: ReviewStatus;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      legal_documents: {
        Row: {
          id: string;
          source_record_id: string | null;
          document_type: string;
          document_number: string | null;
          document_year: number | null;
          title: string;
          issuer: string | null;
          court_name: string | null;
          document_date: string | null;
          effective_date: string | null;
          legal_status: string | null;
          document_url: string | null;
          storage_path: string | null;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_record_id?: string | null;
          document_type: string;
          document_number?: string | null;
          document_year?: number | null;
          title: string;
          issuer?: string | null;
          court_name?: string | null;
          document_date?: string | null;
          effective_date?: string | null;
          legal_status?: string | null;
          document_url?: string | null;
          storage_path?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_record_id?: string | null;
          document_type?: string;
          document_number?: string | null;
          document_year?: number | null;
          title?: string;
          issuer?: string | null;
          court_name?: string | null;
          document_date?: string | null;
          effective_date?: string | null;
          legal_status?: string | null;
          document_url?: string | null;
          storage_path?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      cases: {
        Row: {
          id: string;
          title: string;
          slug: string;
          case_reference: string | null;
          court_name: string | null;
          case_type: string | null;
          case_status: string | null;
          outcome_summary: string | null;
          timeline: Json;
          public_visibility: boolean;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          case_reference?: string | null;
          court_name?: string | null;
          case_type?: string | null;
          case_status?: string | null;
          outcome_summary?: string | null;
          timeline?: Json;
          public_visibility?: boolean;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          case_reference?: string | null;
          court_name?: string | null;
          case_type?: string | null;
          case_status?: string | null;
          outcome_summary?: string | null;
          timeline?: Json;
          public_visibility?: boolean;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      case_documents: {
        Row: {
          id: string;
          case_id: string;
          legal_document_id: string;
          relation_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          legal_document_id: string;
          relation_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          legal_document_id?: string;
          relation_type?: string;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          body: string | null;
          content_type: ArticleContentType;
          publication_type: "client_publication" | "general_news";
          status: ArticleStatus;
          is_demo: boolean;
          author_id: string | null;
          featured_image_path: string | null;
          published_at: string | null;
          scheduled_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          source_name: string | null;
          source_url: string | null;
          document_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          body?: string | null;
          content_type?: ArticleContentType;
          publication_type?: "client_publication" | "general_news";
          status?: ArticleStatus;
          is_demo?: boolean;
          author_id?: string | null;
          featured_image_path?: string | null;
          published_at?: string | null;
          scheduled_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          source_name?: string | null;
          source_url?: string | null;
          document_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          body?: string | null;
          content_type?: ArticleContentType;
          publication_type?: "client_publication" | "general_news";
          status?: ArticleStatus;
          is_demo?: boolean;
          author_id?: string | null;
          featured_image_path?: string | null;
          published_at?: string | null;
          scheduled_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          source_name?: string | null;
          source_url?: string | null;
          document_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      article_categories: {
        Row: {
          article_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          article_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          article_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      article_sources: {
        Row: {
          article_id: string;
          source_record_id: string;
          citation_note: string | null;
          created_at: string;
        };
        Insert: {
          article_id: string;
          source_record_id: string;
          citation_note?: string | null;
          created_at?: string;
        };
        Update: {
          article_id?: string;
          source_record_id?: string;
          citation_note?: string | null;
          created_at?: string;
        };
      };
      editorial_reviews: {
        Row: {
          id: string;
          article_id: string;
          reviewer_id: string | null;
          decision: EditorialDecision;
          notes: string | null;
          reviewed_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          reviewer_id?: string | null;
          decision: EditorialDecision;
          notes?: string | null;
          reviewed_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          reviewer_id?: string | null;
          decision?: EditorialDecision;
          notes?: string | null;
          reviewed_at?: string;
        };
      };
      automation_runs: {
        Row: {
          id: string;
          source_id: string | null;
          started_at: string;
          finished_at: string | null;
          status: AutomationStatus;
          records_found: number;
          records_new: number;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_id?: string | null;
          started_at?: string;
          finished_at?: string | null;
          status?: AutomationStatus;
          records_found?: number;
          records_new?: number;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string | null;
          started_at?: string;
          finished_at?: string | null;
          status?: AutomationStatus;
          records_found?: number;
          records_new?: number;
          error_message?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
    };
  };
}
