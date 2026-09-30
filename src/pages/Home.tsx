import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Section } from "@/components/shared/Section";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { home } from "@/content/home";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <Eyebrow>{home.hero.eyebrow}</Eyebrow>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] font-medium tracking-[-0.02em] text-foreground">
              {home.hero.heading}
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {home.hero.subhead}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md px-6 text-sm"
                onClick={() => trackEvent("cta_click", { location: "hero" })}
              >
                <Link to={home.hero.primaryCta.href}>
                  {home.hero.primaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-md border-border px-6 text-sm text-foreground hover:bg-secondary"
                onClick={() => trackEvent("cta_click", { location: "hero-secondary" })}
              >
                <a href={home.hero.secondaryCta.href}>{home.hero.secondaryCta.label}</a>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Quiet structural accent: one vertical hairline, intentionally empty space. */}
        <div
          aria-hidden
          className="absolute top-1/4 right-8 hidden h-[38%] w-px bg-border md:block"
        />
      </section>

      {/* ── One Zariya, three paths ─────────────────────────────────────── */}
      <Section id="verticals" index="01">
        <Reveal>
          <Eyebrow>{home.verticals.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.01em]">
            {home.verticals.heading}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {/* Academy — the live path, visually dominant */}
          <Reveal className="md:row-span-1">
            <article className="flex h-full flex-col bg-card p-7 md:p-8">
              <Badge className="w-fit rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-medium text-background">
                {home.verticals.academy.badge}
              </Badge>
              <h3 className="mt-6 font-display text-2xl font-medium">
                {home.verticals.academy.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                {home.verticals.academy.teaser}
              </p>
              <dl className="mt-6 space-y-2 border-t border-border pt-5">
                {home.verticals.academy.facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-4 text-xs">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="text-right text-foreground/80">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <Button asChild className="mt-6 h-11 rounded-md text-sm">
                <Link to={home.verticals.academy.cta.href}>
                  {home.verticals.academy.cta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </article>
          </Reveal>

          {/* Consulting */}
          <Reveal delay={80}>
            <article className="flex h-full flex-col bg-card p-7 md:p-8">
              <Badge
                variant="outline"
                className="w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {home.verticals.consulting.badge}
              </Badge>
              <h3 className="mt-6 font-display text-2xl font-medium text-foreground/80">
                {home.verticals.consulting.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                {home.verticals.consulting.teaser}
              </p>
              <Link
                to="/consulting"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Learn more
                <ArrowUpRight className="size-3.5" />
              </Link>
            </article>
          </Reveal>

          {/* Architecture */}
          <Reveal delay={160}>
            <article className="flex h-full flex-col bg-card p-7 md:p-8">
              <Badge
                variant="outline"
                className="w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {home.verticals.architecture.badge}
              </Badge>
              <h3 className="mt-6 font-display text-2xl font-medium text-foreground/80">
                {home.verticals.architecture.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                {home.verticals.architecture.teaser}
              </p>
              <Link
                to="/architecture"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Learn more
                <ArrowUpRight className="size-3.5" />
              </Link>
            </article>
          </Reveal>
        </div>
      </Section>

      {/* ── Philosophy strip ────────────────────────────────────────────── */}
      <Section index="02">
        <Reveal>
          <Eyebrow>{home.philosophy.eyebrow}</Eyebrow>
          <p className="mt-6 max-w-3xl font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.35] font-normal text-foreground">
            {home.philosophy.statement}
          </p>
        </Reveal>
      </Section>

      {/* ── Academy spotlight ───────────────────────────────────────────── */}
      <Section index="03">
        <Reveal>
          <Eyebrow>{home.spotlight.eyebrow}</Eyebrow>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.01em]">
              {home.spotlight.heading}
            </h2>
            <Button
              asChild
              variant="outline"
              className="h-11 shrink-0 rounded-md px-5 text-sm"
            >
              <Link to={home.spotlight.cta.href}>{home.spotlight.cta.label}</Link>
            </Button>
          </div>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            {home.spotlight.teaser}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {home.spotlight.tiles.map((tile, i) => (
            <Reveal key={tile.title} delay={i * 80}>
              <div className="border-t-2 border-foreground pt-5">
                <p className="text-xs text-muted-foreground">0{i + 1}</p>
                <h3 className="mt-2 text-base font-medium">{tile.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {tile.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* TODO: image slot — replace with a real photograph of barista work.
             <img src="…" alt="A barista steaming milk at the machine" /> */}
        <div className="mt-12 rounded-lg border border-dashed border-border bg-secondary/50 p-8 text-sm text-muted-foreground">
          [PLACEHOLDER: photograph — barista at work, descriptive alt text]
        </div>
      </Section>

      {/* ── Selective by design ─────────────────────────────────────────── */}
      <Section index="04">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <Eyebrow>{home.selective.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.01em]">
              {home.selective.heading}
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              {home.selective.body}
            </p>
            <Button asChild className="mt-8 h-12 rounded-md px-6 text-sm">
              <Link to={home.selective.cta.href}>
                {home.selective.cta.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={120}>
            <ol className="space-y-0">
              {home.selective.steps.map((s, i) => (
                <li
                  key={s.step}
                  className={i > 0 ? "border-t border-border" : undefined}
                >
                  <div className="flex items-baseline gap-6 py-5">
                    <span className="text-xs text-muted-foreground">{s.step}</span>
                    <span className="font-display text-lg font-medium md:text-xl">
                      {s.label}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      {/* ── Coming soon band ────────────────────────────────────────────── */}
      <Section index="05">
        <Reveal>
          <Eyebrow>{home.comingSoon.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.01em]">
            {home.comingSoon.heading}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          {home.comingSoon.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <Link
                to={item.href}
                className="group flex h-full flex-col bg-card p-7 transition-colors hover:bg-secondary md:p-9"
                onClick={() => trackEvent("cta_click", { location: `coming-soon-${item.name.toLowerCase()}` })}
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {item.badge}
                  </Badge>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.teaser}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <Section className="border-b-0">
        <Reveal>
          <div className="mx-auto max-w-2xl py-8 text-center md:py-14">
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.01em]">
              {home.finalCta.heading}
            </h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              {home.finalCta.body}
            </p>
            <div className="mt-10 flex justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md px-8 text-sm"
                onClick={() => trackEvent("cta_click", { location: "final-cta" })}
              >
                <Link to={home.finalCta.cta.href}>
                  {home.finalCta.cta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <Separator className="mx-auto mt-16 w-24" />
          </div>
        </Reveal>
      </Section>
    </SiteLayout>
  );
}
