import { Link } from "react-router";
import { footer, site } from "@/content/site";
import { Eyebrow } from "@/components/shared/Eyebrow";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8 md:py-20">
        <div>
          <p className="font-display text-sm tracking-[0.35em] text-foreground">
            {site.wordmark}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            {footer.brandLine}
          </p>
        </div>

        <nav aria-label="Verticals">
          <Eyebrow>Verticals</Eyebrow>
          <ul className="mt-4 space-y-3">
            {footer.verticals.map((v) => (
              <li key={v.href}>
                <Link
                  to={v.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {v.label}
                </Link>
                {v.soon ? (
                  <span className="ml-2 text-xs text-muted-foreground/70">
                    — launching soon
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <Eyebrow>Contact</Eyebrow>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>{footer.contact.email}</li>
            <li>{footer.contact.phone}</li>
            <li>{footer.contact.location}</li>
          </ul>
        </div>

        <div>
          <Eyebrow>Follow</Eyebrow>
          <ul className="mt-4 space-y-3">
            {footer.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 md:px-8">
          <p className="text-xs text-muted-foreground">{footer.copyright}</p>
          <p className="text-xs text-muted-foreground/70">India</p>
        </div>
      </div>
    </footer>
  );
}
