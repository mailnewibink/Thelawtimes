import Link from "next/link";
import { siteConfig, footerNavigation } from "@/lib/site-config";
import { PaperDivider } from "@/components/ui/PaperDivider";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-[3px] border-ink bg-paper pt-8 pb-12">
      <div className="paper-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-5">
            <h2 className="font-blackletter text-3xl text-ink font-normal mb-2">
              {siteConfig.name}
            </h2>
            <p className="font-serif text-xs leading-relaxed text-ink-muted mb-4 max-w-sm">
              An independent editorial record and documentation service for Indonesian
              legal affairs, official announcements, regulatory instruments, and court notices.
            </p>
            <div className="kicker text-[0.625rem] text-ink-muted">
              Published in {siteConfig.location} · Broadhseet Editorial Standard
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="kicker text-xs text-ink mb-3">Editorial & Ethics</h3>
            <ul className="space-y-1.5 font-serif text-xs text-ink-muted">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ink hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="kicker text-xs text-ink mb-3">Notice on Factual Integrity</h3>
            <p className="font-serif text-xs leading-relaxed text-ink-muted mb-3">
              The Law Times strictly adheres to factual verification standards. In Phase 1,
              all displayed records and articles are sample material intended to preview
              layout architecture. Fictional cases and notices carry no legal force.
            </p>
            <p className="meta text-[0.6875rem]">
              Corrections inquiries:{" "}
              <Link href="/contact" className="underline text-ink">
                editorial desk
              </Link>
            </p>
          </div>
        </div>

        <PaperDivider variant="hairline" className="mb-4" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 meta text-[0.6875rem] text-ink-muted">
          <p>© 2026 {siteConfig.name}. All rights reserved.</p>
          <p>Phase 1 Editorial Prototype · Next.js & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
