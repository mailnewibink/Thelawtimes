import Link from "next/link";
import { Plus, Search, ExternalLink } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";
import { isDummyArticle } from "@/lib/repositories/articles";

interface AdminArticlesPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
  }>;
}

export default async function AdminArticlesPage({ searchParams }: AdminArticlesPageProps) {
  const { q, status, type } = await searchParams;
  const supabase = await getSupabaseServerClient();

  let dbArticles: Array<{
    id: string;
    title: string;
    slug: string;
    content_type: string;
    publication_type?: string | null;
    status: string;
    is_demo: boolean;
    published_at: string | null;
    updated_at: string;
  }> = [];

  if (supabase) {
    let query = supabase
      .from("articles")
      .select("id, title, slug, content_type, publication_type, status, is_demo, published_at, updated_at")
      .order("updated_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (type) {
      query = query.eq("publication_type", type);
    }
    if (q) {
      query = query.ilike("title", `%${q}%`);
    }

    const { data } = await query;
    dbArticles = ((data as any) || []).filter((r: any) => !isDummyArticle(r));
  }

  // Merge real verified dataset so authentic Indonesian content is always accessible in CMS
  const { demoArticles } = await import("@/data/demo/articles");
  const combined = [...dbArticles];
  const seenIds = new Set(combined.map((a) => a.id));

  for (const a of demoArticles) {
    if (!isDummyArticle(a) && !seenIds.has(a.id)) {
      const isNewContent = a.id.startsWith("art-edu-") || a.id.startsWith("art-hki-");
      combined.push({
        id: a.id,
        title: a.headline,
        slug: a.slug,
        content_type: a.section === "intellectual-property" ? "intellectual_property" : "news",
        publication_type:
          a.publicationType ||
          (a.section === "intellectual-property" ? "intellectual_property" : "general_news"),
        status: isNewContent ? "draft" : "published",
        is_demo: false,
        published_at: isNewContent ? null : a.publishedAt,
        updated_at: a.updatedAt || a.publishedAt,
      });
      seenIds.add(a.id);
    }
  }

  let articles = combined;
  if (status) {
    articles = articles.filter((a) => a.status === status);
  }
  if (type) {
    articles = articles.filter((a) => a.publication_type === type);
  }
  if (q) {
    const queryLower = q.toLowerCase();
    articles = articles.filter((a) => a.title.toLowerCase().includes(queryLower));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manajemen Artikel & Warta"
        description="Kelola seluruh artikel, publikasi perkara klien, simpan draft, pratinjau, dan terbitkan warta."
        breadcrumbs={[{ label: "Articles" }]}
        actions={
          <Link
            href="/admin/articles/new"
            className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3.5 py-2 text-xs hover:bg-paper hover:text-ink transition-colors font-bold uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </Link>
        }
      />

      {/* Filter / Search Bar */}
      <div className="border border-rule bg-paper-light p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <form method="GET" className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-muted" />
            <input
              type="search"
              name="q"
              defaultValue={q || ""}
              placeholder="Cari berdasarkan judul warta..."
              className="w-full pl-8 pr-3 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink font-serif"
            />
          </div>
          {status && <input type="hidden" name="status" value={status} />}
          {type && <input type="hidden" name="type" value={type} />}
          <button
            type="submit"
            className="border border-rule px-3 py-1.5 hover:border-ink hover:bg-paper font-sans font-semibold uppercase text-[0.625rem]"
          >
            Cari
          </button>
        </form>

        {/* Filter links */}
        <div className="flex items-center gap-2 font-sans text-xs">
          <span className="text-ink-muted">Filter:</span>
          <Link
            href="/admin/articles"
            className={`px-2 py-0.5 border ${
              !status && !type
                ? "bg-ink text-paper border-ink"
                : "border-rule bg-white hover:border-ink"
            }`}
          >
            Semua
          </Link>
          <Link
            href="/admin/articles?status=published"
            className={`px-2 py-0.5 border ${
              status === "published"
                ? "bg-ink text-paper border-ink"
                : "border-rule bg-white hover:border-ink"
            }`}
          >
            Diterbitkan
          </Link>
          <Link
            href="/admin/articles?status=draft"
            className={`px-2 py-0.5 border ${
              status === "draft"
                ? "bg-ink text-paper border-ink"
                : "border-rule bg-white hover:border-ink"
            }`}
          >
            Draft
          </Link>
          <Link
            href="/admin/articles?type=client_publication"
            className={`px-2 py-0.5 border ${
              type === "client_publication"
                ? "bg-ink text-paper border-ink"
                : "border-rule bg-white hover:border-ink"
            }`}
          >
            Publikasi Perkara
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <div className="border border-rule bg-white overflow-hidden">
        <table className="w-full text-left text-xs font-serif">
          <thead className="bg-paper-dark/60 font-sans uppercase tracking-wider text-[0.625rem] border-b border-rule text-ink-muted">
            <tr>
              <th className="py-2.5 px-4">Judul Artikel</th>
              <th className="py-2.5 px-4">Jenis</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Terakhir Diperbarui</th>
              <th className="py-2.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-ink-muted">
                  Tidak ada artikel yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              articles.map((art) => (
                <tr key={art.id} className="hover:bg-paper-light/50 transition-colors">
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="font-bold text-ink hover:underline text-sm block"
                    >
                      {art.title}
                    </Link>
                    <span className="font-mono text-[0.6875rem] text-ink-muted">
                      /artikel/{art.slug}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-sans text-[0.6875rem]">
                    {art.publication_type === "client_publication" ? (
                      <span className="font-bold text-accent">
                        Publikasi Perkara
                      </span>
                    ) : (
                      <span className="text-ink-muted">
                        Berita The Law Times
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[0.625rem] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
                        art.status === "published"
                          ? "bg-green-100 text-green-900 border border-green-300"
                          : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                    >
                      {art.status === "published" ? "Diterbitkan" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-sans text-[0.6875rem] text-ink-muted">
                    {formatDate(art.updated_at, "short")}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/artikel/${art.slug}`}
                        target="_blank"
                        className="text-ink-muted hover:text-ink p-1"
                        title="Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/articles/${art.id}/edit`}
                        className="border border-rule px-2 py-0.5 text-[0.6875rem] hover:border-ink hover:bg-paper"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
