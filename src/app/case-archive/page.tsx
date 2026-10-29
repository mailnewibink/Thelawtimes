import type { Metadata } from "next";
import { getCases, CASE_CATEGORIES } from "@/lib/content";
import { CaseArchiveExplorer } from "@/components/explorer/CaseArchiveExplorer";
import { DemoContentNotice } from "@/components/ui/DemoContentNotice";

export const metadata: Metadata = {
  title: "Court & Case Documentation Archive",
  description:
    "Structured public documentation of court matters, legal disputes, procedural timelines, and judicial filings handled and archived by The Law Times.",
};

export default async function CaseArchivePage() {
  const cases = await getCases();

  return (
    <div className="space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Section IV · Archive</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-ink mb-3">
          Court & Case Documentation Archive
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-soft max-w-2xl leading-relaxed">
          Permanent digital records and case dockets. All records catalogued below
          feature structured case details, verified procedural timelines, and supporting filings.
        </p>
      </header>

      <DemoContentNotice
        variant="panel"
        message="NOTICE: All case records listed below are fictional demonstration samples. No real court dockets, judicial numbers, or rulings are referenced. Do not mistake these records for authentic litigation histories."
      />

      <CaseArchiveExplorer
        initialCases={cases}
        categories={CASE_CATEGORIES}
      />
    </div>
  );
}
