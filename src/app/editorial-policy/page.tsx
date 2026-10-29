import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "Editorial guidelines and journalistic integrity standards of The Law Times.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Standards & Governance</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-ink mb-2">
          Editorial Policy
        </h1>
        <p className="font-serif text-base italic text-ink-muted">
          Principles governing news gathering, case documentation, and source verification.
        </p>
      </header>
      <div className="prose-news text-ink-soft space-y-4">
        <p>
          The Law Times is committed to providing objective, accurate, and dignified coverage of the
          legal sphere in Indonesia. Our reporting is independent of commercial, political, or private interests.
        </p>
        <h2 className="kicker text-sm text-ink pt-2">1. Separation of Editorial and Legal Notices</h2>
        <p>
          Formal announcements, summons, and statutory notices are clearly distinguished from editorial
          reporting. Editorial desks hold no advisory or client relationship with parties placing official notices.
        </p>
        <h2 className="kicker text-sm text-ink pt-2">2. Verification Standards</h2>
        <p>
          No factual assertion regarding court findings, bankruptcy proceedings, or regulatory actions is
          published without cross-checking against official gazettes or certified court transcripts.
        </p>
      </div>
    </div>
  );
}
