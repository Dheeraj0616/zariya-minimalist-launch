import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { Inbox, Loader2, LogOut, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo-mark.jpg";

const STATUS_OPTIONS = [
  "all",
  "pending",
  "contacted",
  "accepted",
  "waitlisted",
  "declined",
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number];

export default function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [cursor, setCursor] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<Id<"academyApplications"> | null>(
    null,
  );
  const [reply, setReply] = useState("");
  const threadEndRef = useRef<HTMLDivElement>(null);

  const results = useQuery(api.academyAdmin.listAcademyApplications, {
    status,
    paginationOpts: { numItems: 20, cursor },
  });

  const applications: Doc<"academyApplications">[] = results?.page ?? [];
  const selected = applications.find((a) => a._id === selectedId);

  const thread = useQuery(
    api.customers.listMessages,
    selected ? { applicationId: selected._id } : "skip",
  );
  const sendTeamMessage = useMutation(api.customers.sendTeamMessage);
  const markThreadRead = useMutation(api.customers.markThreadReadByTeam);

  // Mark customer messages read while a thread is open.
  useEffect(() => {
    if (
      thread &&
      !thread.denied &&
      selected &&
      thread.messages.some(
        (m) => m.sender === "customer" && m.read_by_team !== true,
      )
    ) {
      void markThreadRead({ applicationId: selected._id });
    }
  }, [thread, selected, markThreadRead]);

  // Keep the newest message in view.
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [thread?.messages.length]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    const body = reply;
    setReply("");
    try {
      await sendTeamMessage({ applicationId: selected._id, body });
    } catch {
      setReply(body); // restore draft on failure
      toast.error("Reply failed to send. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isLoading = results === undefined;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoMark} alt="" className="size-7 rounded-full" />
            <span className="font-display text-sm tracking-[0.35em]">ZARIYA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-10 text-sm">
              <Link to="/dashboard">My dashboard</Link>
            </Button>
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

      <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <p className="text-sm text-muted-foreground">Zariya · Team area</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight md:text-4xl">
          Academy applications
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every new application also sends an email notification with full details.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* Applications list */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">
                {isLoading
                  ? "Loading…"
                  : `${applications.length} application${applications.length === 1 ? "" : "s"}`}
              </h2>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v as StatusFilter);
                  setCursor(null);
                }}
              >
                <SelectTrigger className="h-10 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt} className="capitalize">
                      {opt === "all"
                        ? "All"
                        : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 space-y-3">
              {applications.map((app) => (
                <button
                  type="button"
                  key={app._id}
                  onClick={() => setSelectedId(app._id)}
                  className={cn(
                    "w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-secondary",
                    selectedId === app._id ? "border-foreground" : "border-border",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{app.full_name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {app.email} · {app.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {app.status}
                      </p>
                      <p className="mt-0.5 font-mono text-xs">{app.reference_id}</p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 border-t border-border pt-2 text-xs leading-5 text-muted-foreground">
                    {app.motivation}
                  </p>
                </button>
              ))}

              {!isLoading && applications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card px-6 py-16 text-center">
                  <Inbox className="size-8 text-muted-foreground" />
                  <p className="text-sm font-medium">No applications here yet</p>
                  <p className="max-w-sm text-xs text-muted-foreground">
                    Applications from the Academy form appear the moment they're
                    submitted.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-md"
                disabled={cursor === null || isLoading}
                onClick={() => setCursor(null)}
              >
                First page
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-md"
                disabled={isLoading || results?.isDone}
                onClick={() => {
                  if (results?.continueCursor) setCursor(results.continueCursor);
                }}
              >
                Next page
              </Button>
            </div>
          </div>

          {/* Thread panel */}
          <section className="flex max-h-[640px] flex-col rounded-lg border border-border bg-card lg:sticky lg:top-6">
            {selected ? (
              <>
                <div className="border-b border-border px-6 py-4">
                  <h3 className="text-sm font-medium">{selected.full_name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {selected.email} · {selected.phone} · {selected.city}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Background: {selected.background} · Experience:{" "}
                    {selected.experience}
                  </p>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                  {thread && !thread.denied ? (
                    thread.messages.length > 0 ? (
                      thread.messages.map((m) => (
                        <div
                          key={m._id}
                          className={cn(
                            "max-w-[85%] rounded-lg border px-4 py-3 text-sm leading-6",
                            m.sender === "team"
                              ? "ml-auto border-border bg-secondary"
                              : "border-border bg-background",
                          )}
                        >
                          <p>{m.body}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                            {m.sender === "team" ? "Zariya team" : "Applicant"} ·{" "}
                            {new Date(m._creationTime).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No messages on this thread yet.
                      </p>
                    )
                  ) : null}
                  <div ref={threadEndRef} />
                </div>

                <form onSubmit={handleReply} className="border-t border-border p-4">
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply as the Zariya team…"
                    rows={2}
                    className="resize-none"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 rounded-md px-4 text-sm"
                      disabled={!reply.trim()}
                    >
                      <Send className="size-4" />
                      Reply
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                <Inbox className="size-8 text-muted-foreground" />
                <p className="text-sm font-medium">Select an application</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Open an application to read its details and reply to the
                  applicant's messages.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
