import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

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

  let articles: Array<{
    id: string;
    title: string;
    slug: string;
    content_type: string;
    status: string;
    is_demo: boolean;
    published_at: string | null;
    updated_at: string;
  }> = [];

  if (supabase) {
    let query = supabase
      .from("articles")
      .select("id, title, slug, content_type, status, is_demo, published_at, updated_at")
      .order("updated_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (type) {
      query = query.eq("content_type", type);
    }
    if (q) {
      query = query.ilike("title", `%${q}%`);
    }

    const { data } = await query;
    articles = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Articles & Newsroom Dispatches"
        description="Manage legal reporting, features, editorial explainers, and drafts."
        breadcrumbs={[{ label: "Articles" }]}
        actions={
          <Link
            href="/admin/articles/new"
            className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-xs hover:bg-paper hover:text-ink transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
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
              placeholder="Filter by headline..."
              className="w-full pl-8 pr-3 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink font-serif"
            />
          </div>
          <button
            type="submit"
            className="kicker border border-rule px-3 py-1.5 hover:bg-paper-dark"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 font-sans">
          <Filter className="w-3.5 h-3.5 text-ink-muted" />
          <Link
            href="/admin/articles"
            className={`px-2 py-1 border ${!status ? "border-ink bg-ink text-paper font-bold" : "border-rule bg-white text-ink"}`}
          >
            All
          </Link>
          <Link
            href="/admin/articles?status=published"
            className={`px-2 py-1 border ${status === "published" ? "border-ink bg-ink text-paper font-bold" : "border-rule bg-white text-ink"}`}
          >
            Published
          </Link>
          <Link
            href="/admin/articles?status=draft"
            className={`px-2 py-1 border ${status === "draft" ? "border-ink bg-ink text-paper font-bold" : "border-rule bg-white text-ink"}`}
          >
            Drafts
          </Link>
          <Link
            href="/admin/articles?status=in_review"
            className={`px-2 py-1 border ${status === "in_review" ? "border-ink bg-ink text-paper font-bold" : "border-rule bg-white text-ink"}`}
          >
            In Review
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Headline</th>
              <th className="p-3">Rubrik / Type</th>
              <th className="p-3">Workflow Status</th>
              <th className="p-3">Demo Flag</th>
              <th className="p-3">Last Updated</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center italic text-ink-muted">
                  No articles found matching query criteria.
                </td>
              </tr>
            ) : (
              articles.map((art) => (
                <tr key={art.id} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="p-3 font-semibold text-ink max-w-sm">
                    <Link href={`/admin/articles/${art.id}/edit`} className="hover:underline">
                      {art.title}
                    </Link>
                  </td>
                  <td className="p-3 uppercase font-sans text-[0.625rem] text-ink-muted">
                    {art.content_type}
                  </td>
                  <td className="p-3">
                    <span
                      className={`kicker text-[0.625rem] px-2 py-0.5 border ${
                        art.status === "published"
                          ? "border-ink bg-ink text-paper"
                          : art.status === "in_review"
                          ? "border-amber-800 bg-amber-100 text-amber-900"
                          : "border-rule text-ink-muted"
                      }`}
                    >
                      {art.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[0.6875rem]">
                    {art.is_demo ? "Demo Item" : "Verified Record"}
                  </td>
                  <td className="p-3 meta text-ink-muted">
                    {formatDate(art.updated_at.substring(0, 10), "short")}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="kicker text-[0.625rem] border border-rule px-2 py-1 hover:border-ink"
                    >
                      Edit
                    </Link>
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
