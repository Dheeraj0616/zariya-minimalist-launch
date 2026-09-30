"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { academyApplicationSchema } from "../lib/validators/academy";
import {
  applicantConfirmationEmail,
  teamNotificationEmail,
} from "./emailTemplates";
import { vly } from "../lib/vly-integrations";

/**
 * Server-side entry point for Academy applications.
 * Flow: re-validate with the shared Zod schema → honeypot check →
 * transactional insert (duplicate + rate-limit checks happen in the mutation)
 * → send emails via the email integration → return { ok, ref } or a friendly error.
 *
 * Email failures never fail the application: they are logged and the
 * application still succeeds.
 */
export const submitAcademyApplication = action({
  args: {
    full_name: v.string(),
    email: v.string(),
    phone: v.string(),
    city: v.string(),
    background: v.string(),
    experience: v.string(),
    motivation: v.string(),
    preferred_call_time: v.optional(v.string()),
    consent: v.boolean(),
    website: v.optional(v.string()), // honeypot
  },
  handler: async (ctx, args) => {
    // 1. Honeypot: humans never fill this. Pretend success, do nothing.
    if (args.website && args.website.length > 0) {
      return {
        ok: true as const,
        ref: "ZAR-000000",
        message: "Application received.",
      };
    }

    // 2. Re-validate on the server with the same shared Zod schema.
    const parsed = academyApplicationSchema.safeParse(args);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        ok: false as const,
        error:
          firstIssue?.message ??
          "Please check the form and try again.",
      };
    }
    const data = parsed.data;
    const email = data.email.toLowerCase();

    // 3. Generate a short, human-readable reference ID.
    const ref = `ZAR-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.random()
      .toString(36)
      .toUpperCase()
      .slice(2, 4)}`;

    // 4. Insert (duplicate + rate-limit checks happen inside the transaction).
    const result = await ctx.runMutation(internal.academyInternal.createApplication, {
      course_slug: "barista",
      reference_id: ref,
      full_name: data.full_name,
      email,
      phone: data.phone,
      city: data.city,
      background: data.background,
      experience: data.experience,
      motivation: data.motivation,
      preferred_call_time: data.preferred_call_time,
      consent: data.consent,
    });

    if (!result.ok) {
      if (result.reason === "duplicate") {
        return {
          ok: true as const, // idempotent success with friendly message
          ref: "",
          message:
            "We already have your application. We'll be in touch soon.",
        };
      }
      return {
        ok: false as const,
        error:
          "You've submitted several applications recently. Please wait a little before trying again.",
      };
    }

    // 5. Send emails. Failures are logged, never surfaced as application failure.
    try {
      const applicantEmail = applicantConfirmationEmail({
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        background: data.background,
        experience: data.experience,
        motivation: data.motivation,
        preferredCallTime: data.preferred_call_time,
        ref,
      });

      const applicantResult = await vly.email.send({
        to: email,
        subject: applicantEmail.subject,
        html: applicantEmail.html,
        text: applicantEmail.text,
      });

      const teamAddress = process.env.TEAM_NOTIFY_EMAIL ?? "team@example.com";
      const teamEmail = teamNotificationEmail({
        fullName: data.full_name,
        email,
        phone: data.phone,
        city: data.city,
        background: data.background,
        experience: data.experience,
        motivation: data.motivation,
        preferredCallTime: data.preferred_call_time,
        ref,
      });

      await vly.email.send({
        to: teamAddress,
        subject: teamEmail.subject,
        html: teamEmail.html,
        text: teamEmail.text,
      });

      const sent = applicantResult.success === true;
      await ctx.runMutation(internal.academyInternal.setEmailStatus, {
        id: result.id,
        sent,
      });
      if (!sent) {
        console.error(
          "[academy] applicant confirmation email failed:",
          applicantResult.error,
        );
      }
    } catch (error) {
      console.error("[academy] email sending failed:", error);
      await ctx.runMutation(internal.academyInternal.setEmailStatus, {
        id: result.id,
        sent: false,
      });
    }

    // 6. Success. Do not return any personal data.
    return {
      ok: true as const,
      ref,
      message: "Application received.",
    };
  },
});
