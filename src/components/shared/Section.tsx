import { cn } from "@/lib/utils";

/**
 * Shared section shell: consistent vertical rhythm, hairline top divider,
 * and an optional small band index (01, 02 …) for editorial pacing.
 */
export function Section({
  children,
  className,
  index,
  id,
  divider = true,
}: {
  children: React.ReactNode;
  className?: string;
  index?: string;
  id?: string;
  divider?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28",
        divider && "border-t border-border",
        className,
      )}
    >
      {index ? (
        <p className="float-right hidden text-xs text-muted-foreground/70 md:block">
          {index}
        </p>
      ) : null}
      {children}
    </section>
  );
}
