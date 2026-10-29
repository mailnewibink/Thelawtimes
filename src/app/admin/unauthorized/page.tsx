import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="max-w-md w-full border-2 border-ink p-8 bg-paper-light text-center space-y-4">
        <div className="w-12 h-12 rounded-full border border-ink flex items-center justify-center mx-auto text-ink">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase text-ink">
          Access Restricted
        </h1>
        <p className="font-serif text-sm text-ink-muted leading-relaxed">
          Your account does not possess the editorial credentials required to access
          The Law Times Content Management System.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="kicker inline-block border border-ink bg-ink text-paper px-4 py-2 hover:bg-paper hover:text-ink transition-colors"
          >
            Return to Broadsheet
          </Link>
        </div>
      </div>
    </div>
  );
}
