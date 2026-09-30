/**
 * Lightweight analytics helper. No personal data — only the fact that a
 * generic interaction happened and where on the page it happened.
 *
 * Wire providers later (e.g. a PostHog/GA4 script in index.html or a
 * consent-aware loader) without touching call sites.
 */

type EventProps = Record<string, string | number | boolean | undefined>;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/** Track a product event. Safe no-op when no provider is present. */
export function trackEvent(name: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;

  // GA4 (if gtag.js is installed later via a script tag).
  w.gtag?.("event", name, props);
  // Any tag-manager style queue.
  w.dataLayer?.push({ event: name, ...props });

  // TODO: add PostHog `posthog.capture(name, props)` when PostHog is wired.
}
