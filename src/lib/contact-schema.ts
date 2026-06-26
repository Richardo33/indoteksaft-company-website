import { z } from "zod";

const cleanText = (value: string) =>
  value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const cleanMultilineText = (value: string) =>
  cleanText(value)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

export const contactSchema = z.object({
  name: z
    .string()
    .transform(cleanText)
    .pipe(z.string().min(2, "Nama minimal 2 karakter.").max(80)),
  company: z
    .string()
    .transform(cleanText)
    .pipe(z.string().min(2, "Nama perusahaan minimal 2 karakter.").max(120)),
  position: z
    .string()
    .transform(cleanText)
    .pipe(z.string().max(100))
    .optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Masukkan alamat email yang valid.").max(160)),
  phone: z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .max(30)
        .regex(/^[+()\d\s-]*$/, "Format nomor telepon tidak valid."),
    )
    .optional(),
  interest: z.enum([
    "Cybersecurity",
    "Infrastructure & Data Center",
    "Cloud & Hybrid",
    "Data, AI & Automation",
    "Managed Services",
    "Other",
  ]),
  message: z
    .string()
    .transform(cleanMultilineText)
    .pipe(z.string().min(20, "Ceritakan kebutuhan Anda minimal 20 karakter.").max(2000)),
  website: z.string().max(200).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;

export type ContactApiResponse =
  | {
      ok: true;
      requestId: string;
      message: string;
    }
  | {
      ok: false;
      requestId: string;
      message: string;
      fieldErrors?: Partial<Record<keyof ContactInput, string[]>>;
    };
