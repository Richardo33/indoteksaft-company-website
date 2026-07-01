"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Download, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { submitContact } from "@/lib/api-client";
import type { ContactApiResponse } from "@/lib/contact-schema";

const industries = [
  "Cybersecurity",
  "Infrastructure & Data Center",
  "Cloud & Hybrid",
  "Data, AI & Automation",
  "Managed Services",
  "Other",
] as const;

const downloadSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80),
  company: z
    .string()
    .trim()
    .min(2, "Nama perusahaan minimal 2 karakter.")
    .max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Masukkan email yang valid.").max(160)),
  position: z.string().trim().min(2, "Jabatan wajib diisi.").max(100),
  phone: z
    .string()
    .trim()
    .min(6, "Nomor telepon wajib diisi.")
    .max(30)
    .regex(/^[+()\d\s-]*$/, "Format nomor telepon tidak valid."),
  interest: z.enum(industries),
  website: z.string().max(200).optional(),
});

type DownloadInput = z.input<typeof downloadSchema>;

type CompanyProfileDownloadDialogProps = {
  downloadUrl?: string;
  label?: string;
  description?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  submitLabel?: string;
  message?: string;
};

export function CompanyProfileDownloadDialog({
  downloadUrl = "/resources/brosur",
  label = "Download Company Profile",
  description = "Full capabilities overview (PDF)",
  dialogTitle = "Download Company Profile",
  dialogDescription = "Isi data singkat berikut agar tim sales kami dapat membantu follow-up kebutuhan perusahaan Anda.",
  submitLabel = "Submit & Download",
  message = "Download Company Profile request. Please notify the sales team for follow-up.",
}: CompanyProfileDownloadDialogProps) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ContactApiResponse | null>(null);
  const [setting, setSetting] = useState({
    downloadUrl,
    label,
    description,
    dialogTitle,
    dialogDescription,
    submitLabel,
    message,
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DownloadInput>({
    resolver: zodResolver(downloadSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      position: "",
      phone: "",
      interest: "Infrastructure & Data Center",
      website: "",
    },
  });

  useEffect(() => {
    let active = true;

    async function loadSetting() {
      try {
        const response = await fetch(
          "/api/v1/site-settings/company-profile-download",
          { cache: "no-store" },
        );
        if (!response.ok) return;

        const data = (await response.json()) as Partial<typeof setting> & {
          href?: string;
        };

        if (!active) return;

        setSetting((current) => ({
          ...current,
          ...data,
          downloadUrl: data.href ?? data.downloadUrl ?? current.downloadUrl,
        }));
      } catch {
        // Fallback props stay active when CMS settings are unavailable.
      }
    }

    void loadSetting();

    return () => {
      active = false;
    };
  }, []);

  const closeDialog = () => {
    setOpen(false);
    setResult(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    setResult(null);

    try {
      const response = await submitContact({
        ...values,
        leadType: "company_profile_download",
        message: setting.message,
      });

      setResult(response);

      if (response.ok) {
        reset();
        window.setTimeout(() => {
          window.location.href = setting.downloadUrl;
        }, 700);
      }
    } catch {
      setResult({
        ok: false,
        requestId: "client-error",
        message: "Koneksi gagal. Silakan coba kembali beberapa saat lagi.",
      });
    }
  });

  const dialog =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-profile-download-title"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            data-i18n-skip
          >
            <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl [color-scheme:light] sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Download
                  </span>
                  <h2
                    id="company-profile-download-title"
                    className="mt-3 text-2xl font-bold tracking-[-0.04em] text-slate-950"
                  >
                    {setting.dialogTitle}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                    {setting.dialogDescription}
                  </p>
                </div>
                <button
                  type="button"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                  aria-label="Close"
                  onClick={closeDialog}
                >
                  <X aria-hidden="true" size={18} />
                </button>
              </div>

              <form onSubmit={onSubmit} noValidate className="mt-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" error={errors.name?.message}>
                    <input
                      {...register("name")}
                      autoComplete="name"
                      className="consultation-control rounded-lg"
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Company" error={errors.company?.message}>
                    <input
                      {...register("company")}
                      autoComplete="organization"
                      className="consultation-control rounded-lg"
                      placeholder="Company name"
                    />
                  </Field>
                  <Field label="Work Email" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className="consultation-control rounded-lg"
                      placeholder="work@company.com"
                    />
                  </Field>
                  <Field label="Position" error={errors.position?.message}>
                    <input
                      {...register("position")}
                      autoComplete="organization-title"
                      className="consultation-control rounded-lg"
                      placeholder="Your role"
                    />
                  </Field>
                  <Field label="Phone" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="consultation-control rounded-lg"
                      placeholder="+62"
                    />
                  </Field>
                  <Field label="Industry" error={errors.interest?.message}>
                    <select
                      {...register("interest")}
                      className="consultation-control rounded-lg"
                    >
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="download-website">Website</label>
                  <input
                    {...register("website")}
                    id="download-website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {result && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                      result.ok
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.ok && (
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-0.5"
                          size={16}
                        />
                      )}
                      <span>{result.message}</span>
                    </div>
                  </div>
                )}

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                    onClick={closeDialog}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                      setting.submitLabel
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className="group flex items-center gap-4"
        onClick={() => setOpen(true)}
      >
        <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          <Download aria-hidden="true" size={19} />
        </div>
        <div className="text-left">
          <span className="block text-sm font-bold text-blue-600">
            {setting.label}
          </span>
          <span className="mt-1 block text-sm text-slate-500">
            {setting.description}
          </span>
        </div>
      </button>
      {dialog}
    </>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span className="mb-2 block">{label}</span>
      {children}
      {error && <span className="mt-2 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
