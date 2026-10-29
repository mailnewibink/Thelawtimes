import Link from "next/link";
import {
  FileText,
  Megaphone,
  Briefcase,
  Scale,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient();

  // Query real operational counts from database
  let publishedArticlesCount = 0;
  let draftsCount = 0;
  let inReviewCount = 0;
  let announcementsCount = 0;
  let casesCount = 0;
  let regulationsCount = 0;
  let recentArticles: Array<{
    id: string;
    title: string;
    status: string;
    content_type: string;
    updated_at: string;
  }> = [];

  if (supabase) {
    const [
      { count: pubCount },
      { count: draftCount },
      { count: revCount },
      { count: annCount },
      { count: caseCount },
      { count: regCount },
      { data: recent },
    ] = await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "in_review"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("content_type", "announcement"),
      supabase.from("cases").select("*", { count: "exact", head: true }),
      supabase.from("legal_documents").select("*", { count: "exact", head: true }),
      supabase
        .from("articles")
        .select("id, title, status, content_type, updated_at")
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);

    publishedArticlesCount = pubCount || 0;
    draftsCount = draftCount || 0;
    inReviewCount = revCount || 0;
    announcementsCount = annCount || 0;
    casesCount = caseCount || 0;
    regulationsCount = regCount || 0;
    recentArticles = recent || [];
  }

  const statCards = [
    { label: "Published Articles", value: publishedArticlesCount, icon: FileText, href: "/admin/articles" },
    { label: "Draft Articles", value: draftsCount, icon: Clock, href: "/admin/articles?status=draft" },
    { label: "Awaiting Review", value: inReviewCount, icon: Clock, href: "/admin/review", alert: inReviewCount > 0 },
    { label: "Announcements", value: announcementsCount, icon: Megaphone, href: "/admin/announcements" },
    { label: "Case Dockets", value: casesCount, icon: Briefcase, href: "/admin/cases" },
    { label: "Legal Instruments", value: regulationsCount, icon: Scale, href: "/admin/regulations" },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Editorial Dashboard"
        description="Operational overview of legal journalism, gazette announcements, and judicial records."
        actions={
          <div className="flex gap-2">
            <Link
              href="/admin/articles/new"
              className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-xs hover:bg-paper hover:text-ink transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Article</span>
            </Link>
          </div>
        }
      />

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="border border-rule bg-paper-light p-3 flex flex-col justify-between hover:border-ink transition-colors"
            >
              <div className="flex items-center justify-between text-ink-muted mb-2">
                <span className="kicker text-[0.625rem]">{stat.label}</span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="font-display text-2xl font-bold text-ink">
                {stat.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Workflow Quick Actions & Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Articles */}
        <section className="lg:col-span-8 border border-rule bg-paper-light p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-rule-soft pb-2">
            <h2 className="kicker text-xs text-ink">Recently Updated Content</h2>
            <Link href="/admin/articles" className="kicker text-[0.625rem] text-ink-muted hover:text-ink inline-flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentArticles.length === 0 ? (
            <div className="py-8 text-center font-serif text-sm text-ink-muted italic">
              No articles recorded in database yet. Click &quot;New Article&quot; to publish your first dispatch.
            </div>
          ) : (
            <div className="divide-y divide-rule-soft">
              {recentArticles.map((art) => (
                <div key={art.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="font-serif text-sm font-semibold text-ink hover:underline truncate block"
                    >
                      {art.title}
                    </Link>
                    <div className="meta text-[0.6875rem] flex items-center gap-2 mt-0.5">
                      <span className="uppercase">{art.content_type}</span>
                      <span>·</span>
                      <span>Updated {formatDate(art.updated_at.substring(0, 10), "short")}</span>
                    </div>
                  </div>
                  <span className="kicker text-[0.625rem] border border-rule px-2 py-0.5 uppercase shrink-0">
                    {art.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Editorial Desk Actions */}
        <section className="lg:col-span-4 border border-rule bg-paper-light p-5 space-y-4">
          <h2 className="kicker text-xs text-ink border-b border-rule-soft pb-2">
            Editorial Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/articles/new"
              className="w-full flex items-center justify-between border border-rule p-2.5 hover:bg-paper-dark transition-colors text-xs font-serif"
            >
              <span>Draft Legal News Story</span>
              <Plus className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/announcements"
              className="w-full flex items-center justify-between border border-rule p-2.5 hover:bg-paper-dark transition-colors text-xs font-serif"
            >
              <span>Issue Official Gazette Notice</span>
              <Megaphone className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/cases"
              className="w-full flex items-center justify-between border border-rule p-2.5 hover:bg-paper-dark transition-colors text-xs font-serif"
            >
              <span>Archive Judicial Docket</span>
              <Briefcase className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/review"
              className="w-full flex items-center justify-between border border-rule p-2.5 hover:bg-paper-dark transition-colors text-xs font-serif"
            >
              <span>Review Submissions Queue</span>
              <Clock className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
