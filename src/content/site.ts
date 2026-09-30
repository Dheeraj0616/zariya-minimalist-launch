/**
 * Site-wide copy: brand, navigation, footer. Typed objects so copy can move to
 * a CMS later without refactoring components.
 */

export const site = {
  name: "Zariya",
  wordmark: "ZARIYA",
  tagline: "Many crafts. One house.",
  description:
    "Zariya brings disciplines together under one roof — starting with the Zariya Academy and its Barista Method course.",
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
    "Zariya is a house of many crafts — an academy that trains baristas through its Barista Method, with consulting and architecture on the way.",
  verticals: [
    { label: "Academy", href: "/academy", soon: false },
    { label: "Consulting", href: "/consulting", soon: true },
    { label: "Architecture", href: "/architecture", soon: true },
  ],
  contact: {
    // TODO: replace placeholders with real contact details.
    email: "[PLACEHOLDER: hello@zariya.in]",
    phone: "[PLACEHOLDER: +91 XXXXX XXXXX (phone / WhatsApp)]",
    location: "[PLACEHOLDER: City, India]",
  },
  socials: [
    // TODO: replace placeholder hrefs with real profiles.
    { label: "Instagram", href: "[PLACEHOLDER: Instagram URL]" },
    { label: "LinkedIn", href: "[PLACEHOLDER: LinkedIn URL]" },
    { label: "X (Twitter)", href: "[PLACEHOLDER: X URL]" },
  ],
  copyright: `© ${new Date().getFullYear()} Zariya`,
} as const;
