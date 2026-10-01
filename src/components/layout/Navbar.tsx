import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { navLinks, site } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import logoMark from "@/assets/logo-mark.jpg";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8"
      >
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Zariya — home"
        >
          <img
            src={logoMark}
            alt=""
            width={30}
            height={30}
            className="size-[30px] rounded-full"
          />
          <span className="font-display text-sm font-medium tracking-[0.35em] text-foreground">
            {site.wordmark}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) =>
            link.soon ? (
              <RouterNavLink
                key={link.href}
                to={link.href}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => trackEvent("nav_soon_click", { label: link.label })}
              >
                {link.label}
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Soon
                </Badge>
              </RouterNavLink>
            ) : (
              <RouterNavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "group relative text-sm transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-[21px] left-0 h-px w-full transition-opacity duration-200",
                        isActive ? "bg-crimson opacity-100" : "opacity-0",
                      )}
                    />
                  </>
                )}
              </RouterNavLink>
            ),
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoading ? null : isAuthenticated ? (
            <Button asChild size="sm" className="h-10 rounded-md px-4 text-sm">
              <Link to="/dashboard">My dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-10 rounded-md px-3 text-sm"
              >
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="h-10 rounded-md px-4 text-sm">
                <Link to="/academy#apply">Apply to Academy</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-md"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs border-l p-0">
              <SheetHeader className="border-b px-6 py-5">
                <SheetTitle className="flex items-center gap-3 font-display text-sm tracking-[0.35em]">
                  <img src={logoMark} alt="" className="size-7 rounded-full" />
                  {site.wordmark}
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-3 py-4">
                {navLinks.map((link) => (
                  <RouterNavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-12 items-center justify-between rounded-md px-3 text-base",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )
                    }
                  >
                    <span>{link.label}</span>
                    {link.soon ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Soon
                      </Badge>
                    ) : null}
                  </RouterNavLink>
                ))}
                <div className="mt-4 space-y-2 px-1">
                  {isLoading ? null : isAuthenticated ? (
                    <Button asChild className="h-12 w-full text-sm">
                      <Link to="/dashboard">My dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="h-12 w-full text-sm"
                      >
                        <Link to="/auth">Sign in</Link>
                      </Button>
                      <Button asChild className="h-12 w-full text-sm">
                        <Link to="/academy#apply">Apply to Academy</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
