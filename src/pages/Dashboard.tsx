import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAction, useMutation, useQuery } from "convex/react";
import { Loader2, LogOut, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo-mark.svg";

const STATUS_COPY: Record<
  string,
  { title: string; body: string; tone: "ok" | "wait" | "go" }
> = {
  pending: {
    title: "Application received",
    body: "We're reviewing it personally. You'll hear from us — by phone, within 48 hours of applying.",
    tone: "wait",
  },
  contacted: {
    title: "We've called you",
    body: "We reached out on the number you shared. If we missed you, message us here or call back at a good time.",
    tone: "wait",
  },
  accepted: {
    title: "You're in",
    body: "Welcome to Zariya Academy. Your seat is confirmed once the course fee is paid.",
    tone: "go",
  },
  waitlisted: {
    title: "You're on the waitlist",
    body: "There wasn't a seat this round, but you're next in line. We'll message you the moment one opens.",
    tone: "wait",
  },
  declined: {
    title: "Not this time",
    body: "We reviewed your application honestly. It isn't the right fit for this batch — you're welcome to apply again for a future one.",
    tone: "ok",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [draft, setDraft] = useState("");
  const threadEndRef = useRef<HTMLDivElement>(null);

  const applications = useQuery(api.customers.myApplications, {});
  const [selectedId, setSelectedId] = useState<Id<"academyApplications"> | null>(
    null,
  );
  const selected =
    applications?.find((a) => a._id === selectedId) ?? applications?.[0];

  const thread = useQuery(
    api.customers.listMessages,
    selected ? { applicationId: selected._id } : "skip",
  );

  const sendMessage = useMutation(api.customers.sendCustomerMessage);
  const markRead = useMutation(api.customers.markThreadReadByCustomer);
  const checkoutAction = useAction(api.checkout.createCourseCheckout);

  // Clear stale payment errors when switching applications.
  useEffect(() => {
    setError(null);
    setPaying(false);
  }, [selectedId]);

  // Mark team replies as read while the thread is open.
  useEffect(() => {
    if (
      thread &&
      !thread.denied &&
      selected &&
      thread.messages.some(
        (m) => m.sender === "team" && m.read_by_customer !== true,
      )
    ) {
      void markRead({ applicationId: selected._id });
    }
  }, [thread, selected, markRead]);

  // Keep the newest message in view.
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [thread?.messages.length]);

  // Checkout return states.
  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      toast.success("Payment received. Welcome to Zariya Academy.");
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
    } else if (checkout === "cancelled") {
      toast.info("Checkout cancelled — nothing was charged.");
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handlePay = async () => {
    if (!selected) return;
    setPaying(true);
    setError(null);
    try {
      const url = await checkoutAction({ applicationId: selected._id });
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPaying(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !draft.trim()) return;
    const body = draft;
    setDraft("");
    try {
      await sendMessage({ applicationId: selected._id, body });
    } catch {
      setDraft(body); // restore the draft if sending failed
      toast.error("Message failed to send. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || applications === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoMark} alt="" className="size-7 rounded-full" />
            <span className="font-display text-sm tracking-[0.35em]">ZARIYA</span>
          </Link>
          <div className="flex items-center gap-2">
            {user?.role === "admin" ? (
              <Button asChild variant="ghost" size="sm" className="h-10 text-sm">
                <Link to="/admin">Team area</Link>
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 text-sm"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight md:text-4xl">
          {user?.name || "Your dashboard"}
        </h1>

        {!selected ? (
          <div className="mt-12 rounded-lg border border-border bg-card p-10 text-center md:p-16">
            <p className="font-display text-xl font-medium">No applications yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              When you apply to the Zariya Academy, your application, its status,
              and your conversation with the team will live here.
            </p>
            <Button asChild className="mt-6 h-12 rounded-md px-6 text-sm">
              <Link to="/academy#apply">Apply to the Academy</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            {/* Status + payment */}
            <div className="space-y-6">
              <section className="rounded-lg border border-border bg-card p-7">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Barista Method course
                </p>
                <h2 className="mt-3 font-display text-2xl font-medium">
                  {STATUS_COPY[selected.status]?.title ?? selected.status}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {STATUS_COPY[selected.status]?.body}
                </p>

                {selected.status === "accepted" ? (
                  <div className="mt-6 rounded-md border border-border bg-secondary/60 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Course fee</span>
                      <span className="font-medium">
                        [PLACEHOLDER: fee — set via COURSE_FEE_PAISE]
                      </span>
                    </div>
                    <Button
                      className="mt-4 h-12 w-full rounded-md text-sm"
                      onClick={handlePay}
                      disabled={paying}
                    >
                      {paying ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Opening secure checkout…
                        </>
                      ) : (
                        "Pay the course fee"
                      )}
                    </Button>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Checkout opens in a Stripe-secured window. Your receipt
                      arrives by email.
                    </p>
                    {error ? (
                      <p
                        role="alert"
                        className="mt-3 text-xs leading-5 text-destructive"
                      >
                        {error}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </section>

              <section className="rounded-lg border border-border bg-card p-7">
                <h3 className="text-sm font-medium">Your details</h3>
                <dl className="mt-4 space-y-2.5 text-sm">
                  {[
                    ["Reference", selected.reference_id],
                    ["Email", selected.email],
                    ["Phone", selected.phone],
                    ["City", selected.city],
                    ["Preferred call time", selected.preferred_call_time ?? "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            {/* Messages */}
            <section className="flex flex-col rounded-lg border border-border bg-card">
              <div className="border-b border-border px-6 py-4">
                <h3 className="text-sm font-medium">Messages</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Talk to the Zariya team about your application.
                </p>
              </div>

              <div className="max-h-[420px] flex-1 space-y-4 overflow-y-auto px-6 py-6">
                {thread?.denied ? (
                  <p className="text-sm text-muted-foreground">
                    Sign in with the email you applied with to see this
                    conversation.
                  </p>
                ) : thread && thread.messages.length > 0 ? (
                  thread.messages.map((m) => (
                    <div
                      key={m._id}
                      className={cn(
                        "max-w-[85%] rounded-lg border px-4 py-3 text-sm leading-6",
                        m.sender === "customer"
                          ? "ml-auto border-border bg-secondary"
                          : "border-border bg-background",
                      )}
                    >
                      <p>{m.body}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {m.sender === "customer" ? "You" : "Zariya team"} ·{" "}
                        {new Date(m._creationTime).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Ask us anything about the course, the fee,
                    or your application.
                  </p>
                )}
                <div ref={threadEndRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-border p-4">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                  rows={2}
                  className="resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 rounded-md px-4 text-sm"
                    disabled={!draft.trim() || !selected}
                  >
                    <Send className="size-4" />
                    Send
                  </Button>
                </div>
              </form>
              <div className="border-t border-border px-6 py-3 text-xs text-muted-foreground">
                Reference {selected.reference_id}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
