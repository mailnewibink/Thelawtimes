import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection disclosures for The Law Times.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Legal Disclosures</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-ink mb-2">
          Privacy Policy
        </h1>
      </header>
      <div className="prose-news text-ink-soft space-y-4">
        <p>
          The Law Times respects reader privacy and complies with applicable Indonesian statutory
          provisions concerning personal data protection.
        </p>
        <p>
          In Phase 1, this site operates as a demonstration frontend with no user tracking, advertising cookies,
          or account databases.
        </p>
      </div>
    </div>
  );
}
