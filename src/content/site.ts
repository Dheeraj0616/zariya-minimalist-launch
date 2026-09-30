/**
 * Site-wide copy: brand, navigation, footer. Typed objects so copy can move to
 * a CMS later without refactoring components.
 */

export const site = {
  name: "The Zariya",
  wordmark: "ZARIYA",
  tagline: "Three disciplines. One Zariya.",
  description:
    "An academy for craft, consulting for entrepreneurs, and a selective architecture studio. Starting with coffee.",
  url: "https://thezariya.com",
} as const;

export type NavLink = {
  label: string;
  href: string;
  soon?: boolean;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Academy", href: "/academy" },
  { label: "Consulting", href: "/consulting", soon: true },
  { label: "Architecture", href: "/architecture", soon: true },
];

export const footer = {
  brandLine:
    "Three disciplines under one roof — an academy for craft, consulting for entrepreneurs, and a selective architecture studio.",
  verticals: [
    { label: "Academy", href: "/academy", soon: false },
    { label: "Consulting", href: "/consulting", soon: true },
    { label: "Architecture", href: "/architecture", soon: true },
  ],
  contact: {
    // TODO: replace placeholders with real contact details.
    email: "[PLACEHOLDER: hello@thezariya.com]",
    phone: "[PLACEHOLDER: +91 XXXXX XXXXX (phone / WhatsApp)]",
    location: "[PLACEHOLDER: City, India]",
  },
  socials: [
    // TODO: replace placeholder hrefs with real profiles.
    { label: "Instagram", href: "[PLACEHOLDER: Instagram URL]" },
    { label: "LinkedIn", href: "[PLACEHOLDER: LinkedIn URL]" },
    { label: "X (Twitter)", href: "[PLACEHOLDER: X URL]" },
  ],
  copyright: `© ${new Date().getFullYear()} The Zariya`,
} as const;
