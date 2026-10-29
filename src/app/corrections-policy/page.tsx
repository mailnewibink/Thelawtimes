import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corrections Policy",
  description: "Standards and public reporting procedure for factual corrections in The Law Times.",
};

export default function CorrectionsPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Accountability</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-ink mb-2">
          Corrections Policy
        </h1>
        <p className="font-serif text-base italic text-ink-muted">
          Our standard for acknowledging and transparently correcting errors.
        </p>
      </header>
      <div className="prose-news text-ink-soft space-y-4">
        <p>
          Accuracy is the foundation of our work. When substantive factual errors occur in our reporting
          or archived documentation, The Law Times promptly corrects the record.
        </p>
        <h2 className="kicker text-sm text-ink pt-2">Correction Protocol</h2>
        <p>
          Substantive errors are corrected within the body of the article, and an explicit editor&apos;s note
          is appended at the foot of the record detailing the nature of the error and the timestamp of correction.
        </p>
      </div>
    </div>
  );
}
