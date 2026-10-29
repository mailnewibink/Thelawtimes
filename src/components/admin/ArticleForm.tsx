"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ArticleContentType, ArticleStatus } from "@/types/database";

interface ArticleFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    contentType: ArticleContentType;
    status: ArticleStatus;
    categoryId?: string;
    featuredImagePath?: string;
    isDemo: boolean;
  };
  categories: Array<{ id: string; name: string }>;
  isEditing?: boolean;
}

export function ArticleForm({
  initialData,
  categories,
  isEditing = false,
}: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [contentType, setContentType] = useState<ArticleContentType>(
    initialData?.contentType || "news"
  );
  const [status, setStatus] = useState<ArticleStatus>(
    initialData?.status || "draft"
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [featuredImagePath, setFeaturedImagePath] = useState(
    initialData?.featuredImagePath || ""
  );
  const [isDemo, setIsDemo] = useState(initialData?.isDemo ?? true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    if (!title.trim()) {
      setErrorMsg("Title is mandatory.");
      setSaving(false);
      return;
    }

    if (!slug.trim()) {
      setErrorMsg("Slug is mandatory.");
      setSaving(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        throw new Error("Supabase client is not available.");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const articlePayload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        body: body.trim() || null,
        content_type: contentType,
        status: status,
        author_id: user?.id || null,
        featured_image_path: featuredImagePath.trim() || null,
        is_demo: isDemo,
        published_at: status === "published" ? new Date().toISOString() : null,
      };

      if (isEditing && initialData?.id) {
        const { error } = await (supabase as any)
          .from("articles")
          .update(articlePayload)
          .eq("id", initialData.id);

        if (error) throw error;

        // Update category relation if provided
        if (categoryId) {
          await (supabase as any)
            .from("article_categories")
            .upsert({ article_id: initialData.id, category_id: categoryId });
        }

        setSuccessMsg("Article saved successfully.");
      } else {
        const { data: newArticle, error } = await (supabase as any)
          .from("articles")
          .insert(articlePayload)
          .select("id")
          .single();

        if (error) throw error;

        if (categoryId && newArticle) {
          await (supabase as any)
            .from("article_categories")
            .insert({ article_id: (newArticle as any).id, category_id: categoryId });
        }

        router.push("/admin/articles");
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-3 border border-red-800 bg-red-50 text-red-900 text-xs font-serif flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 border border-ink bg-paper-dark text-ink text-xs font-serif">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Editorial Fields */}
        <div className="lg:col-span-8 space-y-4">
          <div className="border border-rule bg-paper-light p-4 space-y-3">
            <div>
              <label htmlFor="article-title" className="kicker block text-xs text-ink-muted mb-1">
                Headline / Title *
              </label>
              <input
                id="article-title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter editorial headline..."
                className="w-full border border-rule px-3 py-2 font-display text-lg font-bold bg-white text-ink focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label htmlFor="article-slug" className="kicker block text-xs text-ink-muted mb-1">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="article-slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="w-full border border-rule px-3 py-1.5 font-mono text-xs bg-white text-ink focus:outline-none focus:border-ink"
                />
                <button
                  type="button"
                  onClick={() => setSlug(slugify(title))}
                  className="kicker border border-rule px-2 py-1.5 text-[0.625rem] hover:bg-paper-dark shrink-0"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="article-excerpt" className="kicker block text-xs text-ink-muted mb-1">
                Editorial Summary / Deck
              </label>
              <textarea
                id="article-excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Concise secondary deck for front page listing..."
                className="w-full border border-rule px-3 py-1.5 font-serif text-sm bg-white text-ink focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label htmlFor="article-body" className="kicker block text-xs text-ink-muted mb-1">
                Article Body (Paragraphs separated by blank lines)
              </label>
              <textarea
                id="article-body"
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter legal report body text..."
                className="w-full border border-rule p-3 font-serif text-sm leading-relaxed bg-white text-ink focus:outline-none focus:border-ink"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-rule bg-paper-light p-4 space-y-4">
            <h3 className="kicker text-xs text-ink border-b border-rule-soft pb-1">
              Publishing Controls
            </h3>

            <div>
              <label htmlFor="article-status" className="kicker block text-xs text-ink-muted mb-1">
                Workflow Status
              </label>
              <select
                id="article-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                className="w-full border border-rule px-2.5 py-1.5 font-sans text-xs bg-white text-ink"
              >
                <option value="draft">Draft</option>
                <option value="in_review">In Review (Submit)</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label htmlFor="article-type" className="kicker block text-xs text-ink-muted mb-1">
                Content Type
              </label>
              <select
                id="article-type"
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ArticleContentType)}
                className="w-full border border-rule px-2.5 py-1.5 font-sans text-xs bg-white text-ink"
              >
                <option value="news">Legal News</option>
                <option value="announcement">Official Announcement</option>
                <option value="intellectual_property">Intellectual Property</option>
                <option value="regulation_update">Regulation Update</option>
                <option value="case_summary">Case Summary</option>
                <option value="legal_brief">Legal Brief</option>
              </select>
            </div>

            <div>
              <label htmlFor="article-category" className="kicker block text-xs text-ink-muted mb-1">
                Editorial Category
              </label>
              <select
                id="article-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-rule px-2.5 py-1.5 font-sans text-xs bg-white text-ink"
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="article-image" className="kicker block text-xs text-ink-muted mb-1">
                Featured Image Path
              </label>
              <input
                id="article-image"
                type="text"
                value={featuredImagePath}
                onChange={(e) => setFeaturedImagePath(e.target.value)}
                placeholder="/images/courthouse.jpg"
                className="w-full border border-rule px-2.5 py-1.5 font-mono text-xs bg-white text-ink"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-rule-soft">
              <input
                id="isDemo"
                type="checkbox"
                checked={isDemo}
                onChange={(e) => setIsDemo(e.target.checked)}
                className="h-4 w-4 border-rule accent-ink"
              />
              <label htmlFor="isDemo" className="font-serif text-xs text-ink">
                Mark explicitly as Demo Content
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full kicker border border-ink bg-ink text-paper py-2.5 px-4 text-xs hover:bg-paper hover:text-ink transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Record..." : isEditing ? "Save Updates" : "Create Article"}</span>
            </button>

            <Link
              href="/admin/articles"
              className="w-full kicker border border-rule p-2 text-xs text-center text-ink hover:bg-paper-dark transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Discard & Back to Articles</span>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
