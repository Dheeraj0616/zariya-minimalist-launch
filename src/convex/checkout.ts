"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

/** Course fee in paise (₹1 = 100 paise). Set COURSE_FEE_PAISE in the environment. */
function courseFeePaise(): number {
  const raw = process.env.COURSE_FEE_PAISE ?? "";
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Creates a Stripe hosted checkout session for an accepted Academy applicant.
 * Requires sign-in; the application must belong to the signed-in email and be
 * `accepted`. Payment is never reachable for pending/declined applicants.
 *
 * Uses the Stripe REST API directly (no SDK). Requires STRIPE_SECRET_KEY and
 * COURSE_FEE_PAISE in the environment; without them the action explains that
 * payments are still being set up rather than failing cryptically.
 */
export const createCourseCheckout = action({
  args: { applicationId: v.id("academyApplications") },
  handler: async (ctx, { applicationId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Please sign in to continue to payment.");
    }

    const application = await ctx.runQuery(
      internal.customers.getApplicationForCheckout,
      { applicationId },
    );
    if (!application) {
      throw new Error("Application not found.");
    }

    // Ownership + acceptance gate before any payment session is created.
    const user = await ctx.runQuery(internal.customers.getEmailById, { userId });
    if (
      !user?.email ||
      application.status !== "accepted" ||
      application.email !== user.email.toLowerCase()
    ) {
      throw new Error(
        "Payment opens once your application is accepted. We'll let you know by email and in your dashboard.",
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const feePaise = courseFeePaise();
    if (!secretKey || feePaise <= 0) {
      throw new Error(
        "Online payments are being set up. We'll contact you with payment details meanwhile.",
      );
    }

    const origin = process.env.CLIENT_URL ?? "http://localhost:5173";

    const body = new URLSearchParams({
      mode: "payment",
      customer_email: application.email,
      client_reference_id: applicationId,
      "metadata[reference_id]": application.reference_id,
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?checkout=cancelled`,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "inr",
      "line_items[0][price_data][unit_amount]": String(feePaise),
      "line_items[0][price_data][product_data][name]":
        "Zariya Academy — Barista Method course",
      "line_items[0][price_data][product_data][description]": `Course fee for ${application.reference_id}`,
    });

    let http: Response;
    try {
      http = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
    } catch (error) {
      console.error("[checkout] network error:", error);
      throw new Error(
        "We couldn't reach the payment provider. Please try again shortly.",
      );
    }

    const payload = (await http.json()) as { url?: string; error?: { message?: string } };
    if (!http.ok || !payload.url) {
      console.error("[checkout] stripe error:", payload.error?.message);
      throw new Error(
        "We couldn't open secure checkout right now. Please try again shortly.",
      );
    }

    return payload.url;
  },
});
