"use client";

import dynamic from "next/dynamic";

const ContactForm = dynamic(
  () => import("@/components/sections/contact-form").then((module) => module.ContactForm),
  {
    loading: () => (
      <div
        className="h-[510px] animate-pulse rounded-2xl bg-white/[0.035]"
        aria-label="Memuat formulir kontak"
      />
    ),
  },
);

export function ContactFormLoader() {
  return <ContactForm />;
}
