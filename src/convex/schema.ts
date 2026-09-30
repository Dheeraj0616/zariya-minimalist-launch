import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // add other tables here

    // Academy applications (Phase 1: Barista course).
    // Written only by the submitAcademyApplication action; read by the signed-in
    // team via listAcademyApplications. Statuses match the SQL migration plan.
    academyApplications: defineTable({
      course_slug: v.string(), // e.g. "barista"
      reference_id: v.string(), // short human-readable ref, e.g. ZAR-XXXXXX
      full_name: v.string(),
      email: v.string(), // stored lowercase
      phone: v.string(),
      city: v.string(),
      background: v.string(),
      experience: v.string(),
      motivation: v.string(),
      preferred_call_time: v.optional(v.string()),
      consent: v.boolean(),
      status: v.union(
        v.literal("pending"),
        v.literal("contacted"),
        v.literal("accepted"),
        v.literal("waitlisted"),
        v.literal("declined"),
      ),
      email_sent: v.optional(v.boolean()), // did the confirmation email go out?
    })
      .index("by_course_and_email", ["course_slug", "email"])
      .index("by_status", ["status"]),

    // Customer↔team conversation threads, one per application (course + email).
    // Queries are auth-gated: customers see their own thread, the team sees all.
    messages: defineTable({
      application_id: v.id("academyApplications"),
      sender: v.union(v.literal("customer"), v.literal("team")),
      body: v.string(),
      read_by_team: v.optional(v.boolean()),
      read_by_customer: v.optional(v.boolean()),
    }).index("by_application", ["application_id"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
