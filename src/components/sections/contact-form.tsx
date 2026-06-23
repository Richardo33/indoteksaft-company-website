"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { submitContact } from "@/lib/api-client";
import {
  contactSchema,
  type ContactApiResponse,
  type ContactInput,
} from "@/lib/contact-schema";

const interests = [
  "Cybersecurity",
  "Infrastructure & Data Center",
  "Cloud & Hybrid",
  "Data, AI & Automation",
  "Managed Services",
  "Other",
] as const;

export function ContactForm() {
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
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama lengkap" error={errors.name?.message}>
          <input
            {...register("name")}
            autoComplete="name"
            className="form-control"
            placeholder="Nama Anda"
          />
        </Field>
        <Field label="Perusahaan" error={errors.company?.message}>
          <input
            {...register("company")}
            autoComplete="organization"
            className="form-control"
            placeholder="Nama perusahaan"
          />
        </Field>
        <Field label="Email bisnis" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            className="form-control"
            placeholder="name@company.com"
          />
        </Field>
        <Field label="Nomor telepon" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="form-control"
            placeholder="+62"
          />
        </Field>
      </div>

      <Field label="Area kebutuhan" error={errors.interest?.message}>
        <select {...register("interest")} className="form-control">
          {interests.map((interest) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Ceritakan kebutuhan Anda" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className="form-control resize-y"
          placeholder="Konteks, tantangan, target, atau timeline..."
        />
      </Field>

      <div className="absolute -left-[9999px]" aria-hidden="true">
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
          className={`rounded-xl border px-4 py-3 text-sm ${
            result.ok
              ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
              : "border-red-400/20 bg-red-400/[0.07] text-red-200"
          }`}
        >
          <div className="flex items-start gap-2">
            {result.ok && <CheckCircle2 aria-hidden="true" className="mt-0.5" size={16} />}
            <span>{result.message}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="animate-spin" size={17} />
            Mengirim...
          </>
        ) : (
          <>
            Send Inquiry
            <ArrowRight aria-hidden="true" size={17} />
          </>
        )}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-300">
      <span className="mb-2 block">{label}</span>
      {children}
      {error && <span className="mt-2 block text-xs text-red-300">{error}</span>}
    </label>
  );
}
