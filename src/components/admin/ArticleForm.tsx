"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  AlertCircle,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const PUBLICATION_TYPES = [
  { id: "client_publication", label: "Publikasi Perkara" },
  { id: "article_opinion", label: "Artikel & Opini" },
  { id: "legal_knowledge", label: "Pengetahuan Hukum" },
  { id: "general_news", label: "Berita The Law Times" },
] as const;

export const CATEGORY_OPTIONS = [
  { id: "Perkara & Putusan", label: "Perkara & Putusan" },
  { id: "Merek & HKI", label: "Merek & HKI" },
  { id: "Berita Hukum", label: "Berita Hukum" },
  { id: "Regulasi", label: "Regulasi" },
  { id: "Pengetahuan Hukum", label: "Pengetahuan Hukum" },
] as const;

interface ArticleFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    publicationType: string;
    category: string;
    status: "draft" | "published";
    author: string;
    publishedAt: string;
    featuredImagePath?: string;
    seoTitle?: string;
    seoDescription?: string;
    focusKeyword?: string;
  };
  isEditing?: boolean;
}

export function ArticleForm({
  initialData,
  isEditing = false,
}: ArticleFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [publicationType, setPublicationType] = useState(
    initialData?.publicationType || "general_news"
  );
  const [category, setCategory] = useState(
    initialData?.category || "Berita Hukum"
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "draft"
  );
  const [author, setAuthor] = useState(
    initialData?.author || "Redaksi The Law Times"
  );
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt || new Date().toISOString().split("T")[0]
  );
  const [featuredImagePath, setFeaturedImagePath] = useState(
    initialData?.featuredImagePath || "/images/courthouse.jpg"
  );

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seoDescription || ""
  );
  const [focusKeyword, setFocusKeyword] = useState(
    initialData?.focusKeyword || ""
  );

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(slugify(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg("");

    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        // Fallback for local demo preview
        setFeaturedImagePath("/images/courthouse.jpg");
        setSuccessMsg("Mode demo: Menggunakan gambar default peradilan.");
        setUploadingImage(false);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("article-images")
        .getPublicUrl(filePath);

      setFeaturedImagePath(publicUrlData.publicUrl);
      setSuccessMsg("Gambar berhasil diunggah.");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mengunggah gambar."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (submitStatus: "draft" | "published") => {
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    if (!title.trim()) {
      setErrorMsg("Judul artikel wajib diisi.");
      setSaving(false);
      return;
    }

    if (!slug.trim()) {
      setErrorMsg("Slug artikel wajib diisi.");
      setSaving(false);
      return;
    }

    const payload = {
      title,
      slug: slugify(slug),
      excerpt,
      body,
      content_type: "news",
      publication_type: publicationType,
      status: submitStatus,
      featured_image_path: featuredImagePath,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      published_at: submitStatus === "published" ? publishedAt : null,
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        if (isEditing && initialData?.id) {
          const { error } = await (supabase as any)
            .from("articles")
            .update(payload)
            .eq("id", initialData.id);

          if (error) throw error;
        } else {
          const { error } = await (supabase as any)
            .from("articles")
            .insert({
              ...payload,
              is_demo: false,
            });

          if (error) throw error;
        }
      }

      setSuccessMsg(
        submitStatus === "published"
          ? "Artikel berhasil diterbitkan!"
          : "Draft artikel berhasil disimpan!"
      );
      setStatus(submitStatus);

      setTimeout(() => {
        router.push("/admin/articles");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan artikel."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(status);
      }}
      className="space-y-6"
    >
      {/* Alert Notices */}
      {errorMsg && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-900 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Form Inputs (Left) and Publishing Metadata (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Article Content */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title */}
          <div className="border border-rule bg-paper-light p-4 space-y-3">
            <div>
              <label
                htmlFor="article-title"
                className="block font-serif font-bold text-xs uppercase tracking-wider text-ink mb-1"
              >
                Judul Artikel (Title) *
              </label>
              <input
                id="article-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Masukkan judul artikel hukum..."
                className="w-full px-3 py-2 border border-rule bg-white text-ink font-serif text-base focus:outline-none focus:border-ink"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="article-slug"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                Slug URL (Otomatis dibuat, dapat disesuaikan) *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-muted font-mono">
                  /artikel/
                </span>
                <input
                  id="article-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 border border-rule bg-white text-ink font-mono text-xs focus:outline-none focus:border-ink"
                  required
                />
              </div>
            </div>
          </div>

          {/* Excerpt / Short Description */}
          <div className="border border-rule bg-paper-light p-4">
            <label
              htmlFor="article-excerpt"
              className="block font-serif font-bold text-xs uppercase tracking-wider text-ink mb-1"
            >
              Deskripsi Singkat / Excerpt *
            </label>
            <p className="font-serif italic text-xs text-ink-muted mb-2">
              Ringkasan artikel yang ditampilkan di halaman depan, arsip rubrik, dan pratinjau media sosial.
            </p>
            <textarea
              id="article-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Tulis ringkasan singkat artikel..."
              className="w-full px-3 py-2 border border-rule bg-white text-ink font-serif text-xs focus:outline-none focus:border-ink leading-relaxed"
              required
            />
          </div>

          {/* Body Rich Text Editor */}
          <div className="border border-rule bg-paper-light p-4">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="article-body"
                className="block font-serif font-bold text-xs uppercase tracking-wider text-ink"
              >
                Isi Artikel (Article Body) *
              </label>
              <span className="font-sans text-[0.625rem] text-ink-muted uppercase tracking-wider">
                Mendukung Paragraf & Teks Terstruktur
              </span>
            </div>
            <textarea
              id="article-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              placeholder="Tulis naskah lengkap artikel hukum di sini. Pisahkan antar-paragraf dengan baris baru ganda..."
              className="w-full px-3 py-2 border border-rule bg-white text-ink font-serif text-sm focus:outline-none focus:border-ink leading-relaxed"
              required
            />
          </div>

          {/* SEO Optimization Box */}
          <div className="border border-rule bg-paper-light p-4 space-y-3">
            <div className="border-b border-rule pb-1.5 mb-2">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-ink">
                Pengaturan SEO & Meta Metadata
              </h3>
            </div>

            <div>
              <label
                htmlFor="seo-title"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                SEO Title (Judul Penelusuran)
              </label>
              <input
                id="seo-title"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Kosongkan jika ingin memakai judul artikel..."
                className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label
                htmlFor="seo-desc"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                Meta Description (Deskripsi Cuplikan Google)
              </label>
              <textarea
                id="seo-desc"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="Kosongkan jika ingin memakai ringkasan excerpt..."
                className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label
                htmlFor="seo-keyword"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                Focus Keyword (Opsional)
              </label>
              <input
                id="seo-keyword"
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="misal: Merek Dagang, Putusan Kasasi, UU Hak Cipta"
                className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy, Image, Status & Actions */}
        <div className="lg:col-span-4 space-y-5">
          {/* Action Box */}
          <div className="border-2 border-ink bg-paper p-4 space-y-3">
            <div className="border-b border-rule pb-1.5">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-ink">
                Status Publikasi
              </h3>
            </div>

            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-ink-muted">Status Saat Ini:</span>
              <strong className="uppercase tracking-wider">
                {status === "published" ? "Diterbitkan" : "Draft"}
              </strong>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSubmit("published")}
                className="w-full bg-ink text-paper py-2 px-3 text-xs font-bold uppercase tracking-wider hover:bg-ink-soft transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Terbitkan Artikel (Publish)</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => handleSubmit("draft")}
                className="w-full border border-ink bg-white text-ink py-2 px-3 text-xs font-bold uppercase tracking-wider hover:bg-paper-dark transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>Simpan Sebagai Draft</span>
              </button>

              {isEditing && slug && (
                <Link
                  href={`/artikel/${slug}`}
                  target="_blank"
                  className="w-full text-center border border-rule py-1.5 px-3 text-xs text-ink-muted hover:text-ink hover:underline flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview di Website</span>
                </Link>
              )}
            </div>
          </div>

          {/* Publication Type & Category */}
          <div className="border border-rule bg-paper-light p-4 space-y-3">
            <div className="border-b border-rule pb-1.5">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-ink">
                Kategori & Jenis Publikasi
              </h3>
            </div>

            {/* Publication Type */}
            <div>
              <label
                htmlFor="pub-type"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                Jenis Publikasi *
              </label>
              <select
                id="pub-type"
                value={publicationType}
                onChange={(e) => setPublicationType(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink font-serif"
              >
                {PUBLICATION_TYPES.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="cat-type"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                Rubrik Kategori *
              </label>
              <select
                id="cat-type"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink font-serif"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label
                htmlFor="article-author"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                Penulis / Byline *
              </label>
              <input
                id="article-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink"
                required
              />
            </div>

            {/* Publication Date */}
            <div>
              <label
                htmlFor="pub-date"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                Tanggal Publikasi *
              </label>
              <input
                id="pub-date"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink"
                required
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="border border-rule bg-paper-light p-4 space-y-3">
            <div className="border-b border-rule pb-1.5">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-ink">
                Gambar Utama (Featured Image)
              </h3>
            </div>

            <div>
              <label className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1">
                Unggah Berkas Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full text-xs text-ink-muted file:mr-2 file:py-1 file:px-2 file:border file:border-rule file:text-xs file:bg-white hover:file:bg-paper"
              />
            </div>

            <div>
              <label
                htmlFor="img-path"
                className="block font-sans text-[0.6875rem] uppercase tracking-wider text-ink-muted mb-1"
              >
                Atau Jalur / URL Gambar
              </label>
              <input
                id="img-path"
                type="text"
                value={featuredImagePath}
                onChange={(e) => setFeaturedImagePath(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
