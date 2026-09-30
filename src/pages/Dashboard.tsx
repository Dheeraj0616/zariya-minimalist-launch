import { useState } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router";
import { Inbox, LogOut } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  "all",
  "pending",
  "contacted",
  "accepted",
  "waitlisted",
  "declined",
] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "text-foreground",
  contacted: "text-blue-600",
  accepted: "text-emerald-600",
  waitlisted: "text-amber-600",
  declined: "text-muted-foreground",
};

type StatusFilter = (typeof STATUS_OPTIONS)[number];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [cursor, setCursor] = useState<string | null>(null);

  const results = useQuery(api.academyAdmin.listAcademyApplications, {
    status,
    paginationOpts: { numItems: 20, cursor },
  });

  const applications = results?.page ?? [];
  const isLoading = results === undefined;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">The Zariya · Team</p>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
              Academy applications
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as {user?.email ?? user?.name ?? "team member"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Every new application also sends an email notification with full details.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 self-start rounded-md"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </header>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">
            {isLoading
              ? "Loading…"
              : `${applications.length} application${applications.length === 1 ? "" : "s"}`}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Status</span>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as StatusFilter);
                setCursor(null);
              }}
            >
              <SelectTrigger className="h-10 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt === "all"
                      ? "All"
                      : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead className="hidden md:table-cell">City</TableHead>
                <TableHead className="hidden md:table-cell">Background</TableHead>
                <TableHead className="hidden lg:table-cell">Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell className="font-mono text-xs">
                    {app.reference_id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{app.full_name}</div>
                    <div className="text-xs text-muted-foreground">{app.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{app.city}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {app.background}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {app.experience}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        STATUS_STYLES[app.status],
                      )}
                    >
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(app._creationTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!isLoading && applications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 border-t border-border px-6 py-16 text-center">
              <Inbox className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium">No applications yet</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Applications from the Academy form will appear here the moment
                they are submitted.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3">
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
    </main>
  );
}
