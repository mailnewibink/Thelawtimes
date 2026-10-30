import type { Metadata, Viewport } from "next";
import { UnifrakturMaguntia, Playfair_Display, Source_Serif_4, Libre_Franklin } from "next/font/google";
import { Suspense } from "react";
import { siteConfig } from "@/lib/site-config";
import { DemoContentNotice } from "@/components/ui/DemoContentNotice";
import { Masthead } from "@/components/navigation/Masthead";
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
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}/images/photos/supreme-court.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/photos/supreme-court.jpg`],
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
  // Schema.org Website & Organization structured data
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/images/photos/supreme-court.jpg`,
        },
        sameAs: [
          "https://twitter.com",
          "https://linkedin.com",
        ],
        description: siteConfig.description,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        inLanguage: "id-ID",
      },
    ],
  };

  return (
    <html
      lang="id"
      className={`${unifraktur.variable} ${playfair.variable} ${sourceSerif.variable} ${franklin.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between antialiased selection:bg-ink selection:text-paper">
        <LanguageProvider>
          <div>
            <DemoContentNotice variant="banner" />
            <div className="paper-container">
              <Masthead />
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
