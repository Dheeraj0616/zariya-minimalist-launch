import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

/**
 * Fade-up on scroll. The animation itself lives in index.css (.reveal) so
 * `prefers-reduced-motion` disables it in one place.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Extra transition delay in ms (staggering). */
  delay?: number;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", inView && "reveal-visible", className)}
    >
      {children}
    </div>
  );
}
