"use client";

import { useState } from "react";
import { Share2, Check, Copy, MessageCircle } from "lucide-react";

interface SocialShareBarProps {
  title: string;
  url: string;
}

export function SocialShareBar({ title, url }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} — ${url}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-rule my-6 text-xs">
      <div className="flex items-center gap-1.5 text-ink-muted kicker font-bold uppercase tracking-wider text-[0.68rem]">
        <Share2 className="w-3.5 h-3.5" />
        <span>Bagikan Artikel</span>
      </div>

      <div className="flex items-center gap-2">
        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-rule bg-paper hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-800 transition-colors text-[0.7rem] kicker uppercase font-bold"
          aria-label="Bagikan ke WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>WhatsApp</span>
        </a>

        {/* Twitter / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 border border-rule bg-paper hover:border-ink transition-colors text-[0.7rem] kicker uppercase font-bold text-ink"
          aria-label="Bagikan ke Twitter / X"
        >
          <span>X / Twitter</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 border border-rule bg-paper hover:border-ink transition-colors text-[0.7rem] kicker uppercase font-bold text-ink"
          aria-label="Bagikan ke LinkedIn"
        >
          <span>LinkedIn</span>
        </a>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2.5 py-1 border border-rule bg-paper hover:border-ink transition-colors text-[0.7rem] kicker uppercase font-bold text-ink"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-700" />
              <span className="text-emerald-700">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Salin Tautan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
