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
  { label: "Front Page", href: "/" },
  { label: "Legal News", href: "/legal-news" },
  { label: "Official Announcements", href: "/announcements" },
  { label: "Court & Case Archive", href: "/case-archive" },
  { label: "Regulation Watch", href: "/regulation-watch" },
  { label: "Intellectual Property", href: "/intellectual-property" },
  { label: "About", href: "/about" },
];

export const footerNavigation: NavItem[] = [
  { label: "About The Law Times", href: "/about" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Corrections Policy", href: "/corrections-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact", href: "/contact" },
];

/** Static, non-demo routes listed in the sitemap. */
export const staticRoutes = [
  "/",
  "/legal-news",
  "/announcements",
  "/case-archive",
  "/regulation-watch",
  "/intellectual-property",
  "/about",
  "/editorial-policy",
  "/corrections-policy",
  "/privacy-policy",
  "/contact",
] as const;
