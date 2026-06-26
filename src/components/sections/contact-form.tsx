"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { submitContact } from "@/lib/api-client";
import {
  contactSchema,
  type ContactApiResponse,
  type ContactInput,
} from "@/lib/contact-schema";

const industries = [
  "Cybersecurity",
  "Infrastructure & Data Center",
  "Cloud & Hybrid",
  "Data, AI & Automation",
  "Managed Services",
  "Other",
] as const;

type ContactFormProps = {
  emailLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  variant?: "card" | "plain";
  className?: string;
};

const formVariantClass = {
  card: "rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10",
  plain: "bg-transparent",
} as const;

export function ContactForm({
  emailLabel = "Email",
  messageLabel = "Project Requirement",
  messagePlaceholder = "Describe your project needs...\n- Current challenge\n- Expected timeline\n- Required solution",
  submitLabel = "Book Consultation",
  variant = "card",
  className = "",
}: ContactFormProps) {
  const [result, setResult] = useState<ContactApiResponse | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      position: "",
      email: "",
      phone: "",
      interest: "Cybersecurity",
      message: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setResult(null);

    try {
      const response = await submitContact(values);
      setResult(response);

      if (response.ok) {
        reset();
      }
    } catch {
      setResult({
        ok: false,
        requestId: "client-error",
        message: "Koneksi gagal. Silakan coba kembali beberapa saat lagi.",
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`${formVariantClass[variant]} ${className}`}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <input
            {...register("name")}
            autoComplete="name"
            className="consultation-control"
            placeholder="Your name"
          />
        </Field>

        <Field label="Company" error={errors.company?.message}>
          <input
            {...register("company")}
            autoComplete="organization"
            className="consultation-control"
            placeholder="Company name"
          />
        </Field>

        <Field label={emailLabel} error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            className="consultation-control"
            placeholder="work@company.com"
          />
        </Field>

        <Field label="Position" error={errors.position?.message}>
          <input
            {...register("position")}
            autoComplete="organization-title"
            className="consultation-control"
            placeholder="Your role"
          />
        </Field>

        <Field label="Phone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="consultation-control"
            placeholder="+62"
          />
        </Field>

        <Field label="Industry" error={errors.interest?.message}>
          <select {...register("interest")} className="consultation-control">
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry === "Other" ? "Select industry" : industry}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label={messageLabel} error={errors.message?.message}>
          <textarea
            {...register("message")}
            rows={5}
            className="consultation-control resize-none py-3"
            placeholder={messagePlaceholder}
          />
        </Field>
      </div>

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          {...register("website")}
          id="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {result && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            result.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-start gap-2">
            {result.ok && (
              <CheckCircle2 aria-hidden="true" className="mt-0.5" size={16} />
            )}
            <span>{result.message}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 inline-flex min-h-12 items-center justify-center  bg-blue-600 px-10 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(37,99,235,0.25)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle
              aria-hidden="true"
              className="mr-2 animate-spin"
              size={17}
            />
            Sending...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span className="mb-2 block">{label}</span>
      {children}
      {error && (
        <span className="mt-2 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}
