import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  academyApplicationSchema,
  backgroundOptions,
  experienceOptions,
  callTimeOptions,
  type AcademyApplication,
} from "@/lib/validators/academy";
import { trackEvent } from "@/lib/analytics";

type SubmitResult =
  | { ok: true; ref: string; message: string }
  | { ok: false; error: string };

export function AcademyForm() {
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const startTracked = useRef(false);

  const submitApplication = useAction(api.academy.submitAcademyApplication);

  const form = useForm<AcademyApplication>({
    resolver: zodResolver(academyApplicationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      city: "",
      background: undefined,
      experience: undefined,
      motivation: "",
      preferred_call_time: undefined,
      consent: false,
      website: "",
    },
    mode: "onBlur",
  });

  const motivation = form.watch("motivation") ?? "";

  async function onSubmit(values: AcademyApplication) {
    setServerError(null);
    try {
      const res = await submitApplication({
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        city: values.city,
        background: values.background,
        experience: values.experience,
        motivation: values.motivation,
        preferred_call_time: values.preferred_call_time,
        consent: values.consent,
        website: values.website,
      });
      setResult(res);
      if (res.ok) {
        trackEvent("academy_form_submit_success", {});
      } else {
        setServerError(res.error);
        trackEvent("academy_form_submit_error", {});
      }
    } catch {
      setServerError(
        "Something went wrong on our side. Please try again in a moment.",
      );
      trackEvent("academy_form_submit_error", {});
    }
  }

  if (result?.ok) {
    return (
      <div
        role="status"
        className="rounded-lg border border-border bg-card p-8 text-center md:p-12"
      >
        <CheckCircle2 className="mx-auto size-8 text-muted-foreground" />
        <h3 className="mt-6 font-display text-2xl font-medium">
          Application received.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {result.message || "Expect a call from us within 48 hours."}
        </p>
        {result.ref ? (
          <p className="mt-6 text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Reference {result.ref}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onFocusCapture={() => {
            if (!startTracked.current) {
              startTracked.current = true;
              trackEvent("academy_form_start", {});
            }
          }}
          noValidate
        >
          {/* Honeypot: visually hidden, ignored by humans, filled by bots */}
          <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              Leave this field empty
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.watch("website") ?? ""}
                onChange={(e) => form.setValue("website", e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone / WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder="+91 98765 43210"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Your city" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current background</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select your background" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {backgroundOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prior coffee or barista experience</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select your experience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experienceOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Why do you want to join?</FormLabel>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {motivation.length}/600
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us who you are and why coffee."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="preferred_call_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Preferred time for our call{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full md:w-64">
                        <SelectValue placeholder="No preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {callTimeOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-8">
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 rounded-md border border-border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(v === true)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal leading-6">
                      I agree to be contacted about my application.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {serverError ? (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-destructive">{serverError}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-muted-foreground">
              We review every application personally and reply within 48 hours.
            </p>
            <Button
              type="submit"
              size="lg"
              className="h-12 rounded-md px-8 text-sm"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  Submitting…
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
