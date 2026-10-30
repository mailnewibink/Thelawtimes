import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCaseBySlug,
  getCases,
  getAnnouncementsBySlugs,
  getArticlesBySlugs,
} from "@/lib/content";
import { FieldList } from "@/components/ui/FieldValue";
import { CaseStatusLabel } from "@/components/editorial/CaseStatusLabel";
import { DemoContentNotice } from "@/components/ui/DemoContentNotice";
import { PaperDivider } from "@/components/ui/PaperDivider";

interface CaseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const cases = await getCases();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseRecord = await getCaseBySlug(slug);
  if (!caseRecord) return { title: "Case Record Not Found" };

  return {
    title: `${caseRecord.title} — Case Docket`,
    description: caseRecord.summary[0] ?? "Structured legal case record.",
  };
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { slug } = await params;
  const caseRecord = await getCaseBySlug(slug);

  if (!caseRecord) {
    notFound();
  }

  const relatedAnnouncements = await getAnnouncementsBySlugs(
    caseRecord.relatedAnnouncementSlugs
  );
  const relatedArticles = await getArticlesBySlugs(caseRecord.relatedArticleSlugs);

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <div className="border-b border-rule-soft pb-2">
        <Link
          href="/case-archive"
          className="kicker inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
        >
          <span aria-hidden="true">←</span> Back to Case Archive
        </Link>
      </div>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="kicker text-ink-muted">
            Archive Docket · {caseRecord.archiveId}
          </span>
          <CaseStatusLabel status={caseRecord.status} />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-ink">
          {caseRecord.title}
        </h1>

        <div className="my-4">
          <DemoContentNotice
            variant="stamp"
            message="DEMO CONTENT — NOT AN ACTUAL LEGAL CASE"
          />
        </div>
      </header>

      {/* Case Metadata Table */}
      <section aria-label="Case Overview" className="border-y-2 border-ink py-4 bg-paper-light px-4 sm:px-6">
        <FieldList
          columns={3}
          fields={[
            {
              label: "Official Case Reference",
              value: caseRecord.reference,
              unavailableText: "Not assigned / Not verified",
            },
            {
              label: "Court Jurisdiction",
              value: caseRecord.court,
              unavailableText: "Not specified",
            },
            {
              label: "Category & Year",
              value: `${caseRecord.category} (${caseRecord.year})`,
            },
            {
              label: "Procedural Case Type",
              value: caseRecord.caseType,
              unavailableText: "Not specified",
            },
            {
              label: "Current Status",
              value: caseRecord.status,
              unavailableText: "Status unverified",
            },
            {
              label: "Archive Record Updated",
              value: caseRecord.lastUpdated,
            },
          ]}
        />
      </section>

      {/* Case Summary */}
      <section aria-label="Case Summary" className="space-y-3">
        <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
          Case Summary & Background
        </h2>
        <div className="prose-news text-ink-soft">
          {caseRecord.summary.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section aria-label="Procedural Timeline" className="space-y-4">
        <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
          Procedural Timeline & Docket History
        </h2>
        <ol className="relative border-l border-rule ml-3 space-y-6 pt-2">
          {caseRecord.timeline.map((entry, idx) => (
            <li key={idx} className="ml-6">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-ink bg-paper" />
              <div className="flex items-center gap-2 mb-1">
                <span className="kicker text-xs text-ink">{entry.title}</span>
                <span className="meta text-xs italic">
                  {entry.date ? entry.date : "(Date not verified)"}
                </span>
              </div>
              <p className="font-serif text-sm text-ink-muted leading-relaxed">
                {entry.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Attached Documents */}
      <section aria-label="Documents and References" className="space-y-3">
        <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
          Case Documents & Filings
        </h2>
        {caseRecord.documents.length === 0 ? (
          <p className="font-serif text-sm italic text-ink-muted">
            No public documents or exhibits are catalogued for this demo record.
          </p>
        ) : (
          <ul className="divide-y divide-rule-soft border border-rule bg-paper-light">
            {caseRecord.documents.map((doc, idx) => (
              <li key={idx} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-ink mr-2">{doc.label}</span>
                  <span className="kicker text-[0.625rem] text-ink-muted">[{doc.kind}]</span>
                </div>
                <span className="font-serif italic text-ink-muted">
                  Document unavailable in demo mode
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Related Announcements or Articles */}
      {(relatedAnnouncements.length > 0 || relatedArticles.length > 0) && (
        <section aria-label="Related Coverage and Notices" className="space-y-4 pt-4 border-t-2 border-rule">
          <h2 className="kicker text-sm text-ink">Related Publications & Notices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedAnnouncements.map((ann) => (
              <div key={ann.id} className="border border-rule p-3 bg-paper-light">
                <span className="kicker text-[0.625rem] text-ink-muted">Official Notice</span>
                <p className="font-serif font-bold text-sm text-ink mt-1">
                  <Link href={`/announcements#${ann.slug}`} className="hover:underline">
                    {ann.title}
                  </Link>
                </p>
              </div>
            ))}
            {relatedArticles.map((art) => (
              <div key={art.id} className="border border-rule p-3 bg-paper-light">
                <span className="kicker text-[0.625rem] text-ink-muted">Legal News Coverage</span>
                <p className="font-serif font-bold text-sm text-ink mt-1">
                  <Link href={`/${art.section}/${art.slug}`} className="hover:underline">
                    {art.headline}
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <PaperDivider variant="double" />

      {/* Bottom Disclaimer */}
      <DemoContentNotice
        variant="panel"
        message="Catatan Redaksi: Seluruh ringkasan arsip perkara dihimpun dari pangkalan data keterbukaan informasi publik peradilan Republik Indonesia dan tidak dapat ditafsirkan sebagai nasihat hukum untuk perkara tertentu."
      />
    </article>
  );
}
