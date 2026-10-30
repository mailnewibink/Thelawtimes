/**
 * Site-wide configuration.
 *
 * `NEXT_PUBLIC_SITE_URL` sets the canonical origin for production.
 * `NEXT_PUBLIC_DEMO_MODE` defaults to "true": while the site only contains
 * fictional demo content, search engines are asked not to index it.
 * Set it to "false" only once verified content replaces the demo dataset.
 */
export const siteConfig = {
  name: "The Law Times",
  tagline: "Legal News & Announcements",
  location: "Jakarta",
  description:
    "The Law Times is an Indonesian legal publication and documentation archive covering legal news, official announcements, court and case records, regulation updates and intellectual property developments.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  isDemo: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  /** Shown in place of any value that has not been verified. */
  unavailableLabel: "Not available",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const primaryNavigation: NavItem[] = [
  { label: "Halaman Utama", href: "/" },
  { label: "Perkara & Putusan", href: "/perkara" },
  { label: "Publikasi Perkara", href: "/publikasi-perkara" },
  { label: "Merek & HKI", href: "/merek-hki" },
  { label: "Berita Hukum", href: "/berita-hukum" },
  { label: "Regulasi", href: "/regulasi" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

export const footerNavigation: NavItem[] = [
  { label: "Tentang The Law Times", href: "/tentang-kami" },
  { label: "Publikasi Perkara", href: "/publikasi-perkara" },
  { label: "Rubrik Perkara & Putusan", href: "/perkara" },
  { label: "Berita Hukum", href: "/berita-hukum" },
  { label: "Merek & HKI", href: "/merek-hki" },
  { label: "Regulasi", href: "/regulasi" },
  { label: "Kebijakan Redaksi", href: "/kebijakan-redaksi" },
  { label: "Kebijakan Ralat", href: "/corrections-policy" },
  { label: "Privasi", href: "/privacy-policy" },
  { label: "Kontak", href: "/contact" },
];

/** Static, non-demo routes listed in the sitemap. */
export const staticRoutes = [
  "/",
  "/perkara",
  "/publikasi-perkara",
  "/berita-hukum",
  "/merek-hki",
  "/regulasi",
  "/tentang-kami",
  "/kebijakan-redaksi",
  "/editorial-policy",
  "/corrections-policy",
  "/privacy-policy",
  "/contact",
] as const;
