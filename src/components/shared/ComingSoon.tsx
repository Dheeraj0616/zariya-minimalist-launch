import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Button } from "@/components/ui/button";
import { comingSoonShared, type ComingSoonContent } from "@/content/coming-soon";

/** Wireframe cube — pure CSS 3D, gently rotating (paused under reduced motion). */
function WireframeCube() {
  const face =
    "absolute inset-0 border border-muted-foreground/50 bg-foreground/[0.02]";
  const s = "112px";
  const half = "56px";

  return (
    <div
      aria-hidden="true"
      className="[perspective:800px]"
      style={{ width: s, height: s }}
    >
      <div
        className="relative h-full w-full animate-spin-slow [transform-style:preserve-3d]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className={face} style={{ transform: `translateZ(${half})` }} />
        <div className={face} style={{ transform: `rotateY(180deg) translateZ(${half})` }} />
        <div className={face} style={{ transform: `rotateY(90deg) translateZ(${half})` }} />
        <div className={face} style={{ transform: `rotateY(-90deg) translateZ(${half})` }} />
        <div className={face} style={{ transform: `rotateX(90deg) translateZ(${half})` }} />
        <div className={face} style={{ transform: `rotateX(-90deg) translateZ(${half})` }} />
      </div>
    </div>
  );
}

/** Blueprint line-grid that draws itself in once (stroke-dashoffset animation). */
function BlueprintGrid() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 320"
      fill="none"
      className="w-64 md:w-80"
    >
      {/* Outer frame — pathLength=100 normalises stroke-dash drawing across shapes */}
      <rect
        x="8" y="8" width="304" height="304"
        pathLength={100}
        stroke="currentColor"
        strokeWidth="1"
        className="bp-draw"
      />
      {/* Interior grid */}
      <path d="M8 112 H312 M8 216 H312 M112 8 V312 M216 8 V312" pathLength={100} stroke="currentColor" strokeWidth="1" className="bp-draw bp-draw-2" />
      {/* Diagonal roof line */}
      <path d="M8 216 L160 88 L312 216" pathLength={100} stroke="currentColor" strokeWidth="1" className="bp-draw bp-draw-3" />
      {/* Door */}
      <rect x="136" y="240" width="48" height="72" pathLength={100} stroke="currentColor" strokeWidth="1" className="bp-draw bp-draw-3" />
    </svg>
  );
}

export function ComingSoon({ content }: { content: ComingSoonContent }) {
  return (
    <SiteLayout>
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-5 py-24 md:grid-cols-[1.2fr_1fr] md:px-8">
          <div>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.02] font-medium tracking-[-0.02em]">
              {comingSoonShared.heading}
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-muted-foreground">
              {content.teaser}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-md px-6 text-sm"
              >
                <Link to={comingSoonShared.buttons.home.href}>
                  {comingSoonShared.buttons.home.label}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md px-6 text-sm"
              >
                <Link to={comingSoonShared.buttons.academy.href}>
                  {comingSoonShared.buttons.academy.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden justify-center text-muted-foreground/70 md:flex">
            {content.visual === "cube" ? <WireframeCube /> : <BlueprintGrid />}
          </div>
        </div>
      </section>

      {/* Mobile gets the visual too, quietly */}
      <div className="flex justify-center border-b border-border py-12 text-muted-foreground/60 md:hidden">
        {content.visual === "cube" ? <WireframeCube /> : <BlueprintGrid />}
      </div>
    </SiteLayout>
  );
}
