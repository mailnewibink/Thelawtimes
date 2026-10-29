import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Editorial Desk",
  description: "Contact information for inquiries, corrections, and gazette notice submissions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Communications</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-ink mb-2">
          Contact The Law Times
        </h1>
        <p className="font-serif text-base italic text-ink-muted">
          Reaching the editorial room, announcements desk, and archives department.
        </p>
      </header>
      <div className="prose-news text-ink-soft space-y-6">
        <div className="border border-rule bg-paper-light p-6 space-y-4">
          <h2 className="kicker text-sm text-ink">Editorial Offices</h2>
          <p className="font-serif text-sm">
            <strong>Location:</strong> Jakarta, Republic of Indonesia<br />
            <strong>Editorial Inquiries:</strong> desk@thelawtimes.local (placeholder)<br />
            <strong>Legal Notice Submissions:</strong> gazette@thelawtimes.local (placeholder)
          </p>
        </div>
        <p className="meta text-xs">
          Please note that Phase 1 does not process live legal filings or submissions through web forms.
        </p>
      </div>
    </div>
  );
}
