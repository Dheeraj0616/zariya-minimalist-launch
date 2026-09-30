import { z } from "zod";

/**
 * One shared Zod schema for the Academy application form — used by the client
 * for live validation and re-validated on the server inside the Convex action.
 *
 * Deliberately transform-free (no .transform/.default) so the React Hook Form
 * resolver types stay exact; normalisation (email lowercasing) happens in the
 * server action.
 */
export const academyApplicationSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(254, "Email must be 254 characters or fewer.")
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => {
        const digits = v.replace(/[^\d]/g, "");
        return (
          /^\+?[\d\s-]{10,17}$/.test(v) &&
          digits.length >= 10 &&
          digits.length <= 15
        );
      },
      {
        message:
          "Enter a valid phone number (10–15 digits, +91 and spaces are fine).",
      },
    ),
  city: z
    .string()
    .trim()
    .min(2, "Please enter your city.")
    .max(100, "City must be 100 characters or fewer."),
  background: z.enum([
    "Student",
    "Working professional",
    "Café or hospitality",
    "Other",
  ]),
  experience: z.enum(["None", "Beginner", "Some professional experience"]),
  motivation: z
    .string()
    .trim()
    .min(30, "Tell us a little more — at least 30 characters.")
    .max(600, "Keep it to 600 characters or fewer."),
  preferred_call_time: z.enum(["Morning", "Afternoon", "Evening"]).optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree to be contacted about your application.",
  }),
  /** Honeypot: bots fill this; humans never see it. Must stay empty. */
  website: z.string().max(0, "Spam detected.").optional(),
});

/** Input and output types are identical (no transforms). */
export type AcademyApplication = z.infer<typeof academyApplicationSchema>;

/** Form options for selects, kept in one place so form + action agree. */
export const backgroundOptions = [
  "Student",
  "Working professional",
  "Café or hospitality",
  "Other",
] as const;
export const experienceOptions = [
  "None",
  "Beginner",
  "Some professional experience",
] as const;
export const callTimeOptions = ["Morning", "Afternoon", "Evening"] as const;
