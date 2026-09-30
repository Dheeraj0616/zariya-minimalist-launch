import { getAuthUserId } from "@convex-dev/auth/server";
import {
  query,
  mutation,
  internalQuery,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";

/** Return the signed-in user document, or null. */
async function currentUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;
  return ctx.db.get(userId);
}

/**
 * The signed-in customer's own applications (matched by account email),
 * newest first. Guests and signed-out visitors get an empty list.
 */
export const myApplications = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    const email = user?.email?.toLowerCase();
    if (!email) return [];

    const apps = await ctx.db
      .query("academyApplications")
      .withIndex("by_course_and_email", (q) =>
        q.eq("course_slug", "barista").eq("email", email),
      )
      .collect();

    return apps.sort((a, b) => b._creationTime - a._creationTime);
  },
});

/** True if the signed-in user owns this application (email match) or is admin. */
async function canAccessApplication(
  ctx: QueryCtx | MutationCtx,
  applicationId: Id<"academyApplications">,
) {
  const user = await currentUser(ctx);
  if (!user) return { allowed: false as const, email: null };
  const application = await ctx.db.get(applicationId);
  if (!application) return { allowed: false as const, email: null };
  const isOwner =
    !!user.email && application.email === user.email.toLowerCase();
  const isAdmin = user.role === "admin";
  return { allowed: isOwner || isAdmin, email: user.email ?? null };
}

/** Thread messages for one application. Owners see their thread; admins see all. */
export const listMessages = query({
  args: { applicationId: v.id("academyApplications") },
  handler: async (ctx, { applicationId }) => {
    const access = await canAccessApplication(ctx, applicationId);
    if (!access.allowed) return { messages: [], denied: true as const };

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_application", (q) => q.eq("application_id", applicationId))
      .collect();

    return {
      denied: false as const,
      messages: messages.sort((a, b) => a._creationTime - b._creationTime),
    };
  },
});

/** Customer sends a message on their own thread. */
export const sendCustomerMessage = mutation({
  args: { applicationId: v.id("academyApplications"), body: v.string() },
  handler: async (ctx, { applicationId, body }) => {
    const trimmed = body.trim();
    if (trimmed.length < 1 || trimmed.length > 2000) {
      throw new Error("Message must be between 1 and 2000 characters.");
    }

    const access = await canAccessApplication(ctx, applicationId);
    if (!access.allowed) {
      throw new Error("You can only post on your own application thread.");
    }

    await ctx.db.insert("messages", {
      application_id: applicationId,
      sender: "customer",
      body: trimmed,
      read_by_team: false,
      read_by_customer: true,
    });
  },
});

/** Team reply — requires the admin role. */
export const sendTeamMessage = mutation({
  args: { applicationId: v.id("academyApplications"), body: v.string() },
  handler: async (ctx, { applicationId, body }) => {
    const user = await currentUser(ctx);
    if (user?.role !== "admin") {
      throw new Error("Team access required.");
    }
    const trimmed = body.trim();
    if (trimmed.length < 1 || trimmed.length > 2000) {
      throw new Error("Message must be between 1 and 2000 characters.");
    }

    await ctx.db.insert("messages", {
      application_id: applicationId,
      sender: "team",
      body: trimmed,
      read_by_team: true,
      read_by_customer: false,
    });
  },
});

/** Team marks a thread's customer messages as read — requires the admin role. */
export const markThreadReadByTeam = mutation({
  args: { applicationId: v.id("academyApplications") },
  handler: async (ctx, { applicationId }) => {
    const user = await currentUser(ctx);
    if (user?.role !== "admin") return;
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_application", (q) => q.eq("application_id", applicationId))
      .collect();
    for (const m of messages) {
      if (m.sender === "customer" && m.read_by_team !== true) {
        await ctx.db.patch(m._id, { read_by_team: true });
      }
    }
  },
});

/** Customer marks the thread read (clears "team replied" badge). */
export const markThreadReadByCustomer = mutation({
  args: { applicationId: v.id("academyApplications") },
  handler: async (ctx, { applicationId }) => {
    const access = await canAccessApplication(ctx, applicationId);
    if (!access.allowed) return;
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_application", (q) => q.eq("application_id", applicationId))
      .collect();
    for (const m of messages) {
      if (m.sender === "team" && m.read_by_customer !== true) {
        await ctx.db.patch(m._id, { read_by_customer: true });
      }
    }
  },
});

/** Internal: checkout eligibility lookup. Returns only what checkout needs. */
export const getApplicationForCheckout = internalQuery({
  args: { applicationId: v.id("academyApplications") },
  handler: async (ctx, { applicationId }) => {
    const app = await ctx.db.get(applicationId);
    if (!app) return null;
    return {
      status: app.status,
      course_slug: app.course_slug,
      reference_id: app.reference_id,
      email: app.email,
    };
  },
});

/** Internal: email address of a user id (used by the checkout ownership gate). */
export const getEmailById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    return { email: user?.email ?? null };
  },
});
