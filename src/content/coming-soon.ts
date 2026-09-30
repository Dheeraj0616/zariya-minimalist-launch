/** Copy for the two "Launching online soon" verticals. */

export type ComingSoonContent = {
  /** Browser tab title. */
  title: string;
  /** Short page name used in headings and metadata. */
  name: string;
  eyebrow: string;
  teaser: string;
  metaDescription: string;
  /** Visual rendered by <ComingSoon />: wireframe cube or blueprint grid. */
  visual: "cube" | "blueprint";
};

export const consultingSoon: ComingSoonContent = {
  title: "Consulting — Launching Soon | Zariya",
  name: "Consulting",
  eyebrow: "Zariya Consulting",
  teaser:
    "Sharper ways to show what you build, from interactive 3D product experiences to fast, high-information formats that make materials and specs clear at a glance.",
  metaDescription:
    "The Zariya Consulting is launching online soon — interactive 3D product experiences and high-information formats for entrepreneurs.",
  visual: "cube",
};

export const architectureSoon: ComingSoonContent = {
  title: "Architecture — Launching Soon | Zariya",
  name: "Architecture",
  eyebrow: "Zariya Architecture",
  teaser:
    "Every project begins with a conversation. We listen first, then decide, together, if it's the right fit.",
  metaDescription:
    "The Zariya Architecture is launching online soon — a selective studio that listens first.",
  visual: "blueprint",
};

export const comingSoonShared = {
  heading: "Launching online soon",
  buttons: {
    home: { label: "Back to Home", href: "/" },
    academy: { label: "Explore the Academy", href: "/academy" },
  },
} as const;
