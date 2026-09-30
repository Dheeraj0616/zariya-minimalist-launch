import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Internal write path for Academy applications. Runs in one transaction:
 * duplicate check → rate-limit check → insert. Called only from the
 * `submitAcademyApplication` action after Zod validation.
 */
export const createApplication = internalMutation({
  args: {
    course_slug: v.string(),
    reference_id: v.string(),
    full_name: v.string(),
    email: v.string(),
    phone: v.string(),
    city: v.string(),
    background: v.string(),
    experience: v.string(),
    motivation: v.string(),
    preferred_call_time: v.optional(v.string()),
    consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("academyApplications")
      .withIndex("by_course_and_email", (q) =>
        q.eq("course_slug", args.course_slug).eq("email", args.email),
      )
      .collect();

    // Duplicate application (same course + email).
    if (existing.length > 0) {
      return { ok: false as const, reason: "duplicate" as const };
    }

    // Basic rate limit: at most 3 applications per email per hour.
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentCount = existing.filter(
      // _creationTime is available on every Convex document.
      (doc) => (doc as unknown as { _creationTime: number })._creationTime >= oneHourAgo,
    ).length;
    if (recentCount >= 3) {
      return { ok: false as const, reason: "rate_limited" as const };
    }

    const id = await ctx.db.insert("academyApplications", {
      course_slug: args.course_slug,
      reference_id: args.reference_id,
      full_name: args.full_name,
      email: args.email,
      phone: args.phone,
      city: args.city,
      background: args.background,
      experience: args.experience,
      motivation: args.motivation,
      preferred_call_time: args.preferred_call_time,
      consent: args.consent,
      status: "pending",
    });

    return { ok: true as const, id, ref: args.reference_id };
  },
});

/** Record whether the confirmation email went out (email failures never fail the application). */
export const setEmailStatus = internalMutation({
  args: { id: v.id("academyApplications"), sent: v.boolean() },
  handler: async (ctx, { id, sent }) => {
    await ctx.db.patch(id, { email_sent: sent });
  },
});
