import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center space-y-6">
      <p aria-hidden="true" className="font-display text-4xl text-ink-muted">
        ❧
      </p>
      <h1 className="font-display text-4xl font-bold uppercase text-ink">
        404 — Record Not Found
      </h1>
      <p className="font-serif text-base text-ink-muted leading-relaxed">
        The legal article, formal announcement, or case archive docket you requested
        could not be located in this edition of The Law Times.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="kicker inline-block border border-ink bg-ink text-paper px-6 py-3 hover:bg-paper hover:text-ink transition-colors"
        >
          Return to Front Page
        </Link>
      </div>
    </div>
  );
}
