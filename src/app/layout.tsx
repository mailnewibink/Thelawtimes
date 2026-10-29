import type { Metadata, Viewport } from "next";
import { UnifrakturMaguntia, Playfair_Display, Source_Serif_4, Libre_Franklin } from "next/font/google";
import { Suspense } from "react";
import { siteConfig } from "@/lib/site-config";
import { DemoContentNotice } from "@/components/ui/DemoContentNotice";
import { Masthead } from "@/components/navigation/Masthead";
import { EditionHeader } from "@/components/navigation/EditionHeader";
import { PrimaryNavigation } from "@/components/navigation/PrimaryNavigation";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const unifraktur = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-unifraktur",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const franklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: {
    index: !siteConfig.isDemo,
    follow: !siteConfig.isDemo,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f0e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${unifraktur.variable} ${playfair.variable} ${sourceSerif.variable} ${franklin.variable}`}
    >
      <body className="min-h-screen flex flex-col justify-between antialiased selection:bg-ink selection:text-paper">
        <LanguageProvider>
          <div>
            <DemoContentNotice variant="banner" />
            <div className="paper-container">
              <Masthead />
              <EditionHeader />
              <Suspense fallback={<div className="h-10 border-b border-rule" />}>
                <PrimaryNavigation />
                <MobileNavigation />
              </Suspense>
              <main id="main-content" className="mt-6">
                {children}
              </main>
            </div>
          </div>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
