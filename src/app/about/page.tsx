import type { Metadata } from "next";
import { PaperDivider } from "@/components/ui/PaperDivider";

export const metadata: Metadata = {
  title: "About The Law Times",
  description:
    "Editorial scope, legal documentation archives, factual integrity standards, and publishing mission of The Law Times.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Editorial Profile</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-ink mb-3">
          About The Law Times
        </h1>
        <p className="font-serif text-lg italic text-ink-muted leading-relaxed">
          A digital broadsheet dedicated to Indonesian legal documentation, public gazette
          announcements, judicial archives, and rigorous editorial analysis.
        </p>
      </header>

      <div className="prose-news text-ink-soft space-y-6">
        <section className="space-y-3">
          <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
            Scope & Dual Purpose
          </h2>
          <p>
            The Law Times was conceived to serve two complementary legal functions:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-serif text-sm sm:text-base">
            <li>
              <strong>A Formal Legal Archive:</strong> Providing an immutable, structured public
              repository for court summons, insolvency announcements, auction notices,
              and formal corporate legal disclosures.
            </li>
            <li>
              <strong>Editorial Legal Journalism:</strong> Delivering balanced, in-depth reporting
              on courtroom proceedings, landmark precedents, legislative debates, ministerial
              regulations, and intellectual property developments.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
            Access to Primary Source References
          </h2>
          <p>
            Every editorial article and gazette announcement published in The Law Times is
            grounded in primary source verification. In our full operational deployment, each
            published record is linked to official government gazettes, filed court transcripts,
            or verified client notices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
            Editorial Review & Correction Standards
          </h2>
          <p>
            Factual accuracy is paramount in legal journalism. The Law Times operates under a strict
            non-partisan editorial charter. Factual errors brought to our attention are corrected
            transparently, with substantive revisions logged in public correction notices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="kicker text-sm text-ink border-b border-rule pb-1">
            Phase 1 Demonstration Status
          </h2>
          <p>
            The current release constitutes Phase 1 of The Law Times: establishing the visual
            design system, classic newspaper aesthetic, responsive layout architecture, and
            content taxonomies. All articles, notices, case records, and regulations currently
            accessible on this website are fictional demonstration materials.
          </p>
        </section>
      </div>

      <PaperDivider variant="double" />
    </div>
  );
}
