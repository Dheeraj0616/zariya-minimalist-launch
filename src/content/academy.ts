/**
 * Copy for the Academy page. Every fact not yet provided is a [PLACEHOLDER].
 * Do not invent prices, dates, durations, statistics, or certifications.
 */

export const academy = {
  hero: {
    eyebrow: "Zariya Academy",
    heading: "Barista Method",
    tagline: "The course that teaches you how to become a barista.",
    subline:
      "Applications are reviewed personally. We'll call you within 48 hours.",
    cta: { label: "Apply now", href: "#apply" },
  },
  overview: {
    eyebrow: "Course overview",
    heading: "What this course is",
    what:
      "A selective, application-based course in the Barista Method — how to become a barista and do the work properly, from dialling in espresso to running a calm, precise bar during service.",
    who: "For aspiring baristas and hospitality newcomers. No prior experience required — just the willingness to be trained, corrected, and to practise until it's second nature.",
    facts: [
      { label: "Duration", value: "[PLACEHOLDER: e.g. X weeks]" },
      { label: "Format", value: "[PLACEHOLDER: in-person / hybrid]" },
      { label: "Location", value: "[PLACEHOLDER: city / campus]" },
      { label: "Batch size", value: "[PLACEHOLDER: seats per batch]" },
      { label: "Fee", value: "[PLACEHOLDER: course fee]" },
    ],
  },
  modules: {
    eyebrow: "Curriculum",
    heading: "What you'll learn",
    intro:
      "[PLACEHOLDER: module list — these are illustrative placeholders until the syllabus is finalised.]",
    items: [
      {
        n: "01",
        title: "Coffee fundamentals",
        body: "[PLACEHOLDER: seed to cup, species, freshness, what taste actually means]",
      },
      {
        n: "02",
        title: "Espresso technique",
        body: "[PLACEHOLDER: grinder and machine familiarisation, dialling in, extraction]",
      },
      {
        n: "03",
        title: "Milk and texturing",
        body: "[PLACEHOLDER: steaming, microfoam, pouring practice]",
      },
      {
        n: "04",
        title: "Bar workflow and service",
        body: "[PLACEHOLDER: station setup, speed, cleanliness, customer service]",
      },
      {
        n: "05",
        title: "Equipment care",
        body: "[PLACEHOLDER: cleaning, calibration, daily maintenance]",
      },
      {
        n: "06",
        title: "Assessment and next steps",
        body: "[PLACEHOLDER: practical assessment, feedback, pathways after the course]",
      },
    ],
  },
  process: {
    eyebrow: "Admission process",
    heading: "How admission works",
    steps: [
      {
        n: "01",
        title: "Apply",
        body: "Fill the application below. It takes a few minutes and asks what matters.",
      },
      {
        n: "02",
        title: "We review",
        body: "Every application is read personally by the team. No automated sorting.",
      },
      {
        n: "03",
        title: "We call you within 48 hours",
        body: "A real conversation, on the number you share — mornings, afternoons, or evenings, your choice.",
      },
      {
        n: "04",
        title: "You're in — or we tell you honestly",
        body: "If there's a seat and a fit, you're in. If not, we say so plainly and, where we can, point you to what would help.",
      },
    ],
  },
  form: {
    eyebrow: "Application",
    heading: "Apply to the Barista Method course",
    intro:
      "Tell us who you are and why coffee. We read every application and call within 48 hours.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions, answered",
    items: [
      {
        q: "What does the course cost?",
        a: "[PLACEHOLDER: fee and what it includes — answer once the fee is finalised.]",
      },
      {
        q: "Do I need prior experience?",
        a: "No. The course is designed for newcomers and early-career hospitality people. Some professional experience is welcome but not required.",
      },
      {
        q: "When and where are the batches?",
        a: "[PLACEHOLDER: schedule, location, and batch dates.]",
      },
      {
        q: "Will I get a certificate?",
        a: "[PLACEHOLDER: certification details — only state this once confirmed.]",
      },
      {
        q: "What happens after I apply?",
        a: "We review your application personally and call you within 48 hours to let you know whether you're in.",
      },
      {
        q: "Will there be more courses?",
        a: "Yes — the Academy plans to add courses beyond coffee. Announcements will be made on this site first.",
      },
    ],
  },
  moreCourses: "More courses are planned at the Academy. Coffee is only the beginning — [PLACEHOLDER: future course areas].",
} as const;
