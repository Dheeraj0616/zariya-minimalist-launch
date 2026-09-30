import { SkipLink } from "./SkipLink";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/** Shared shell for all marketing pages. */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
