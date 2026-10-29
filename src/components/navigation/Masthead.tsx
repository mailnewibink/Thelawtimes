import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { PaperDivider } from "@/components/ui/PaperDivider";

export function Masthead() {
  return (
    <header className="pt-4 pb-2 sm:pt-6 sm:pb-3 text-center select-none">
      {/* Top micro bar */}
      <div className="flex items-center justify-between meta text-[0.6875rem] sm:text-xs mb-3 px-1 text-ink-muted">
        <span className="font-serif italic">Indonesian Legal Editorial & Public Documentation</span>
        <span className="hidden sm:inline font-sans uppercase tracking-[0.2em] text-[0.625rem]">Digital Broadsheet</span>
        <span className="font-serif italic">First Published 2026</span>
      </div>

      <PaperDivider variant="double" className="mb-2" />

      {/* Main Masthead Title matching the visual reference */}
      <div className="py-1">
        <h1 className="font-blackletter text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-ink font-normal my-0 leading-[1.05]">
          <Link href="/" className="hover:opacity-95 transition-opacity">
            {siteConfig.name}
          </Link>
        </h1>
      </div>

      <PaperDivider variant="thick" className="mt-2" />
    </header>
  );
}
