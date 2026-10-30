import Link from "next/link";
import {
  FileText,
  Clock,
  Rss,
  Inbox,
  Plus,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";
import { getPublicationRequestStats } from "@/lib/repositories/publication-requests";

export default async function AdminDashboardPage() {
  const [supabase, pubStats] = await Promise.all([
    getSupabaseServerClient(),
    getPublicationRequestStats(),
  ]);

  let publishedArticlesCount = 0;
  let draftsCount = 0;
  let externalNewsCount = 0;
  let recentArticles: Array<{
    id: string;
    title: string;
    status: string;
    content_type: string;
    publication_type?: string | null;
    updated_at: string;
    slug: string;
  }> = [];

  if (supabase) {
    const [
      { count: pubCount },
      { count: draftCount },
      { count: extCount },
      { data: recent },
    ] = await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      (supabase as any).from("source_records").select("*", { count: "exact", head: true }).eq("record_type", "external_news"),
      supabase
        .from("articles")
        .select("id, title, status, content_type, publication_type, updated_at, slug")
        .order("updated_at", { ascending: false })
        .limit(6),
    ]);

    publishedArticlesCount = pubCount || 0;
    draftsCount = draftCount || 0;
    externalNewsCount = extCount || 0;
    recentArticles = (recent as any) || [];
  }

  const statCards = [
    {
      label: "Total Published Articles",
      value: publishedArticlesCount,
      icon: FileText,
      href: "/admin/articles?status=published",
    },
    {
      label: "Total Drafts",
      value: draftsCount,
      icon: Clock,
      href: "/admin/articles?status=draft",
    },
    {
      label: "External News Items",
      value: externalNewsCount,
      icon: Rss,
      href: "/admin/sources",
    },
    {
      label: "Publication Requests",
      value: pubStats.total,
      subValue: pubStats.submitted > 0 ? `${pubStats.submitted} Masuk Baru` : undefined,
      icon: Inbox,
      href: "/admin/publication-requests",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Editorial Dashboard"
        description="Ringkasan operasional manajemen publikasi artikel dan agregasi warta hukum eksternal."
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

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="border border-rule bg-paper-light p-5 hover:border-ink transition-colors block group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs uppercase tracking-wider font-semibold text-ink-muted">
                  {card.label}
                </span>
                <Icon className="w-4 h-4 text-ink-muted group-hover:text-ink transition-colors" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-ink">
                  {card.value}
                </span>
                {"subValue" in card && card.subValue && (
                  <span className="text-[0.6875rem] font-sans font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 border border-amber-300">
                    {card.subValue}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recently Published & Edited Articles */}
      <div className="border border-rule bg-paper-light p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div>
            <h2 className="font-serif font-bold text-base text-ink">
              Artikel Terbaru di Sistem
            </h2>
            <p className="font-serif text-xs text-ink-muted italic">
              Warta artikel yang baru saja diterbitkan atau diperbarui oleh tim redaksi.
            </p>
          </div>
          <Link
            href="/admin/articles"
            className="kicker text-xs text-ink hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            Lihat Semua Artikel <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-muted font-serif">
            Belum ada artikel di database. Klik tombol &quot;Tulis Artikel Baru&quot; untuk memulai.
          </div>
        ) : (
          <div className="divide-y divide-rule-soft">
            {recentArticles.map((art) => (
              <div
                key={art.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[0.625rem] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
                        art.status === "published"
                          ? "bg-green-100 text-green-900 border border-green-300"
                          : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                    >
                      {art.status === "published" ? "Diterbitkan" : "Draft"}
                    </span>
                    <span className="text-[0.625rem] font-sans text-ink-muted uppercase tracking-wider">
                      {art.publication_type === "client_publication"
                        ? "Publikasi Perkara"
                        : "Berita The Law Times"}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-ink hover:underline">
                    <Link href={`/admin/articles/${art.id}/edit`}>
                      {art.title}
                    </Link>
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs shrink-0 font-sans">
                  <span className="text-ink-muted text-[0.6875rem]">
                    {formatDate(art.updated_at, "short")}
                  </span>
                  <Link
                    href={`/artikel/${art.slug}`}
                    target="_blank"
                    className="text-ink hover:underline flex items-center gap-1 text-[0.6875rem] font-semibold"
                  >
                    <span>Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link
                    href={`/admin/articles/${art.id}/edit`}
                    className="border border-rule px-2.5 py-1 text-xs hover:border-ink hover:bg-paper"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
