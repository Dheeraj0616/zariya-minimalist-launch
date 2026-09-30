import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

/**
 * Team-only review list. Requires a signed-in user; anonymous visitors get
 * nothing. Pagination + status filter for the dashboard review view.
 */
export const listAcademyApplications = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("contacted"),
      v.literal("accepted"),
      v.literal("waitlisted"),
      v.literal("declined"),
      v.literal("all"),
    ),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      // Not signed in: return an empty page instead of throwing.
      return { page: [], isDone: true, continueCursor: "" };
    }

    // "all" scans the table (course+email index, creation-time tiebreak);
    // a specific status uses the by_status index. Both return newest first.
    const pageOpts = {
      ...args.paginationOpts,
      numItems: Math.min(args.paginationOpts.numItems, 100),
    };
    let page: Doc<"academyApplications">[];
    let isDone: boolean;
    let continueCursor: string;
    if (args.status === "all") {
      ({ page, isDone, continueCursor } = await ctx.db
        .query("academyApplications")
        .withIndex("by_course_and_email")
        .order("desc")
        .paginate(pageOpts));
    } else {
      const status = args.status;
      ({ page, isDone, continueCursor } = await ctx.db
        .query("academyApplications")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .paginate(pageOpts));
    }

    return { page, isDone, continueCursor };
  },
});
