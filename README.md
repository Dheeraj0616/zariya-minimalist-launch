# Zariya — Phase 1 (v1.1)

Zariya is one house with several branches. The **Academy** is live with its Barista Method course; **Consulting** and **Architecture** have designed "Launching online soon" pages.

This release covers the full customer loop and the team loop around it:

1. **Marketing site** — Home, Academy (with the application form), Consulting, Architecture. Applications save to the database and email the applicant + team (Resend via the platform email integration).
2. **Accounts** — customers sign up / sign in with an email OTP (one account works across all branches).
3. **Customer dashboard** (`/dashboard`) — application status, payment when accepted, and a message thread with the team.
4. **Payments** — accepted applicants pay the course fee through Stripe hosted checkout (implemented via the Stripe REST API from a Convex action; requires `STRIPE_SECRET_KEY` and `COURSE_FEE_PAISE`).
5. **Team area** (`/admin`) — review applications and reply to applicant messages (requires the `admin` role on the signed-in user).

Also included: designed **"Launching online soon"** pages for Consulting (wireframe cube) and Architecture (self-drawing blueprint), a shared navbar/footer, per-page metadata, and JSON-LD Organization schema.

## Stack notes (important)

The original brief specified Next.js + Supabase + Resend SDK. This environment is **Vite + React 19 + Convex + Tailwind v4 + shadcn/ui**, so the architecture was adapted one-for-one:

| Brief | Built here | Why it's equivalent |
| --- | --- | --- |
| Next.js App Router | React Router SPA, lazy routes, per-route meta via `MetadataSync` | Same routes (`/`, `/academy`, `/consulting`, `/architecture`), metadata, JSON-LD in `index.html` |
| Supabase (Postgres) | Convex database (`academyApplications` + `messages` tables, indexes) | Server-side writes only; customer/admin reads are auth-gated |
| Server Action | Convex action `submitAcademyApplication` | Same flow: Zod re-validation → honeypot → duplicate check → rate limit → insert → emails |
| Resend SDK | Resend via the platform email integration (`vly.email.send`) | Same branded HTML emails; failures never fail the application |
| Stripe (hosted checkout) | `createCourseCheckout` action → Stripe REST API | Sign-in + acceptance + ownership gated; INR via `COURSE_FEE_PAISE` |
| React Hook Form + Zod | Identical | One shared schema in `src/lib/validators/academy.ts` |

## Data flow

```
Form (RHF + zodResolver, shared schema)
  → Convex action "use node"
      → honeypot check
      → Zod re-validation (same schema, source of truth)
      → internal mutation (transaction): duplicate check (course+email) → rate limit (≤3/hr per email) → insert
      → Resend emails (applicant + team) — failure only logs, never fails the application
  → { ok, ref, message } | { ok: false, error }
```

Reference IDs look like `ZAR-XXXXXX`.

## Reviewing applications

1. Sign in (auth is wired through the platform's auth flow) and open `/dashboard`.
2. Filter by status (pending / contacted / accepted / waitlisted / declined), page through results.
3. Every application also arrives by email at the configured team address.

## Environment variables

Nothing is required for the site to render. Email works once these are set (see integrations.md for the mechanism):

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Provided by the platform integration layer |
| `EMAIL_FROM` | e.g. `Zariya <hello@zariya.in>` |
| `TEAM_NOTIFY_EMAIL` | Where new-application notifications go |

Payments activate once these are set (until then the Pay button explains that payments are being set up):

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_…`) |
| `COURSE_FEE_PAISE` | Course fee in paise (₹24,999 → `2499900`) |
| `CLIENT_URL` | Public site URL for checkout redirects (defaults to localhost) |

Optional analytics placeholders (`trackEvent` in `src/lib/analytics.ts` is provider-agnostic):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | PostHog when wired |
| `NEXT_PUBLIC_GA_ID` | GA4 when wired |

## Local setup

```bash
bun install
bun convex dev --once   # generate Convex types + push functions
bun tsc -b --noEmit     # typecheck
bun run dev             # (platform-managed in this environment)
```

## Content rules honored

- All copy lives in `src/content/` as typed objects (`site.ts`, `home.ts`, `academy.ts`, `coming-soon.ts`).
- **No invented facts.** Every unknown is a `[PLACEHOLDER: …]` — fee, duration, format, location, batch size, tagline, certificate, module bodies, contact details, image alt drafts.
- The 48-hour callback promise and application-based flow are stated consistently across Home, Academy, form, FAQ, and emails.

## Placeholder inventory (to replace before launch)

- `src/content/site.ts` — email, phone/WhatsApp, location, social URLs
- `src/content/home.ts` — course duration, format, batch size, cohort cap, training details, photograph slot
- `src/content/academy.ts` — course tagline, duration/format/location/batch/fee facts, all six module bodies, FAQ answers for fee/schedule/certificate, future-course note
- `src/index.html` — canonical/OG URLs (`https://thezariya.com`), OG image PNG
- `src/pages/Home.tsx` — image slot marked with a TODO comment

## Accessibility & motion

- Skip link, semantic landmarks, labelled inputs, 44px+ targets, bronze-free minimal focus ring via the theme ring token, `aria-live`/`role=status` on form status, honeypot excluded from a11y tree.
- Reveal animations are CSS-based and disabled under `prefers-reduced-motion` (also the cube and blueprint animations).

## Roles & the team area

`/admin` requires the signed-in user to have `role: "admin"` in the `users` table (set it from the Convex dashboard). Customers sign in with the email they applied with — their dashboard matches applications by account email.

## What plugs in later (Phase 2+) without refactoring

- **Inline status editing** — update application status (`pending` → `contacted` → …) directly from the admin area; the data model is ready.
- **Consulting / Architecture inquiry forms** — `ComingSoon` accepts content objects; add a `form` field and follow the same action pattern.
- **Sanity CMS** — swap `src/content/*` imports for CMS fetches; components consume typed objects.
- **Three.js / R3F** — the Consulting page reserves a `visual` slot; replace `WireframeCube` with an R3F canvas.
- **PostHog / GA4** — drop provider scripts into `index.html` and extend `trackEvent`.
