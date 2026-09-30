import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Section } from "@/components/shared/Section";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AcademyForm } from "@/components/academy/AcademyForm";
import { academy } from "@/content/academy";
import { trackEvent } from "@/lib/analytics";

export default function Academy() {
  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <Badge className="rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-medium text-background">
              Applications open
            </Badge>
            <Eyebrow className="mt-6 block">{academy.hero.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] font-medium tracking-[-0.02em]">
              {academy.hero.heading}
            </h1>
            <p className="mt-4 font-display text-lg text-muted-foreground italic md:text-xl">
              {academy.hero.tagline}
            </p>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              {academy.hero.subline}
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md px-6 text-sm"
                onClick={() => trackEvent("cta_click", { location: "academy-hero" })}
              >
                <a href={academy.hero.cta.href}>
                  {academy.hero.cta.label}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      <Section index="01">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Eyebrow>{academy.overview.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.01em]">
              {academy.overview.heading}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-foreground/90">
              {academy.overview.what}
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              {academy.overview.who}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <dl className="rounded-lg border border-border bg-card p-6 md:p-7">
              {academy.overview.facts.map((f, i) => (
                <div
                  key={f.label}
                  className={i > 0 ? "border-t border-border py-4" : "pb-4"}
                >
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* ── Curriculum ───────────────────────────────────────────────────── */}
      <Section index="02">
        <Reveal>
          <Eyebrow>{academy.modules.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.01em]">
            {academy.modules.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            {academy.modules.intro}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {academy.modules.items.map((m, i) => (
            <Reveal key={m.n} delay={(i % 2) * 80}>
              <div className="border-t-2 border-foreground pt-5">
                <p className="text-xs text-muted-foreground">{m.n}</p>
                <h3 className="mt-2 text-base font-medium">{m.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {m.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Admission process ────────────────────────────────────────────── */}
      <Section index="03">
        <Reveal>
          <Eyebrow>{academy.process.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.01em]">
            {academy.process.heading}
          </h2>
        </Reveal>
        <ol className="mt-10">
          {academy.process.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 60}>
              <li className={i > 0 ? "border-t border-border" : undefined}>
                <div className="grid grid-cols-[2.5rem_1fr] gap-4 py-6 md:grid-cols-[4rem_10rem_1fr] md:gap-8">
                  <span className="text-xs text-muted-foreground">{s.n}</span>
                  <h3 className="font-display text-lg font-medium md:text-xl">
                    {s.title}
                  </h3>
                  <p className="col-start-2 mt-1 text-sm leading-6 text-muted-foreground md:col-start-3 md:mt-0">
                    {s.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ── Application form ─────────────────────────────────────────────── */}
      <Section id="apply" index="04">
        <Reveal>
          <Eyebrow>{academy.form.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.01em]">
            {academy.form.heading}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            {academy.form.intro}
          </p>
        </Reveal>
        <Reveal delay={100} className="mt-10">
          <AcademyForm />
        </Reveal>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section index="05">
        <Reveal>
          <Eyebrow>{academy.faq.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.01em]">
            {academy.faq.heading}
          </h2>
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <Accordion type="single" collapsible className="border-t border-border">
            {academy.faq.items.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`} className="border-b">
                <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Section>

      {/* ── More courses note ────────────────────────────────────────────── */}
      <Section className="py-16 md:py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-secondary/60 p-8 md:flex-row md:items-center md:p-10">
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {academy.moreCourses}
            </p>
            <Button asChild variant="outline" className="h-11 shrink-0 rounded-md px-5 text-sm">
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </Reveal>
      </Section>
    </SiteLayout>
  );
}


