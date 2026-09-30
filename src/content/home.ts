/** Copy for the home page. All facts that are not yet known are [PLACEHOLDER]s. */

export const home = {
  hero: {
    eyebrow: "The Zariya",
    heading: "Three disciplines. One Zariya.",
    subhead:
      "Consulting for entrepreneurs, architecture, and an academy that trains the next generation of craft, starting with coffee.",
    primaryCta: { label: "Explore the Academy", href: "/academy" },
    secondaryCta: { label: "See what's coming", href: "#verticals" },
  },
  verticals: {
    eyebrow: "One Zariya, three paths",
    heading: "One Zariya, three paths",
    academy: {
      name: "Academy",
      badge: "Applications open",
      teaser:
        "A selective Barista course, reviewed personally. Applications are open now, and we call every applicant within 48 hours.",
      cta: { label: "Apply now", href: "/academy#apply" },
      facts: [
        { label: "Duration", value: "[PLACEHOLDER: course duration]" },
        { label: "Format", value: "[PLACEHOLDER: online / in-person]" },
        { label: "Batch size", value: "[PLACEHOLDER: seats per cohort]" },
      ],
    },
    consulting: {
      name: "Consulting",
      badge: "Launching online soon",
      teaser:
        "Sharper ways to show what you build — interactive 3D product experiences that make materials and specs clear at a glance.",
    },
    architecture: {
      name: "Architecture",
      badge: "Launching online soon",
      teaser: "We listen first. Every project begins with a conversation.",
    },
  },
  philosophy: {
    eyebrow: "Philosophy",
    statement:
      "We craft things carefully, and we choose who we craft them with. Every discipline at The Zariya begins by listening — to the material, to the market, and to the person in front of us.",
  },
  spotlight: {
    eyebrow: "Now live",
    heading: "The Academy's first course",
    teaser:
      "Barista training built for people who want to do the work properly — hands-on, reviewed personally, and taught in small cohorts.",
    tiles: [
      {
        title: "Hands-on training",
        body: "[PLACEHOLDER: what trainees actually practise — machines, milk, dialling in, service]",
      },
      {
        title: "Small, selective cohorts",
        body: "Every batch is capped [PLACEHOLDER: cohort cap] so each trainee gets real machine time and personal feedback.",
      },
      {
        title: "A personal admission call",
        body: "We review every application and call you within 48 hours. No forms disappear into a pile.",
      },
    ],
    cta: { label: "See the course", href: "/academy" },
  },
  selective: {
    eyebrow: "Selective by design",
    heading: "You don't enroll here. You apply.",
    body: "Every application is read by the team. If it looks like a fit, we call you within 48 hours — and if it's not the right time, we tell you honestly. That's the whole process.",
    steps: [
      { step: "01", label: "Apply" },
      { step: "02", label: "We review" },
      { step: "03", label: "We call within 48 hours" },
      { step: "04", label: "You're in — or we tell you honestly" },
    ],
    cta: { label: "Start an application", href: "/academy#apply" },
  },
  comingSoon: {
    eyebrow: "Coming soon",
    heading: "Two more paths, in the making",
    items: [
      {
        name: "Consulting",
        teaser: "Sharper ways to show what you build.",
        badge: "Launching online soon",
        href: "/consulting",
      },
      {
        name: "Architecture",
        teaser: "We listen first.",
        badge: "Launching online soon",
        href: "/architecture",
      },
    ],
  },
  finalCta: {
    heading: "Start where the craft starts.",
    body: "Applications for the Barista course are open. Reviewed personally, answered within 48 hours.",
    cta: { label: "Apply to Academy", href: "/academy#apply" },
  },
} as const;
