import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Download,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { ContactForm } from "@/components/sections/contact-form";
import { Container } from "@/components/shared/container";
import { company } from "@/config/company";

export const metadata: Metadata = {
  title: "Contact Sales",
  description:
    "Hubungi tim Indoteksaft untuk konsultasi teknologi, company profile, assessment, dan kebutuhan transformasi digital.",
  alternates: {
    canonical: "/contact",
  },
};

const contactActions = [
  {
    label: "Download Company Profile",
    value: "Full capabilities overview (PDF)",
    href: "#",
    icon: Download,
  },
  {
    label: "Whatsapp Only",
    value: "Chat directly with our sales team",
    href: "https://wa.me/622258999225",
    icon: MessageCircle,
  },
  {
    label: "Email Us",
    value: company.email,
    href: `mailto:${company.email}`,
    icon: Mail,
  },
  {
    label: "Call Us",
    value: company.phone,
    href: "tel:+622258999225",
    icon: Phone,
  },
] as const;

export default function ContactPage() {
  return (
    <main className="bg-white pt-18 text-slate-950">
      <section aria-labelledby="contact-sales-title" className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Contact us
              </span>
              <h1
                id="contact-sales-title"
                className="mt-5 max-w-md text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
              >
                Ready to Transform Your Business?
              </h1>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-500">
                Share your requirements through the form, and our specialists
                will help you identify the best technology solutions.
              </p>

              <div className="mt-9 space-y-5">
                {contactActions.map((action) => (
                  <ContactAction key={action.label} {...action} />
                ))}
              </div>
            </div>

            <ContactForm
              variant="plain"
              emailLabel="Work Email"
              messageLabel="Message"
              messagePlaceholder="write a message here..."
              submitLabel="Submit"
              className="max-w-2xl"
            />
          </div>

          <div className="mt-20 border-b border-slate-200 pb-12">
            <div className="mb-5 flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center bg-cyan-50 text-blue-600">
                <MapPin aria-hidden="true" size={19} />
              </div>
              <div>
                <span className="block text-sm font-bold text-blue-600">
                  Office Location
                </span>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {company.address}
                </p>
              </div>
            </div>

            <div className="overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title={`${company.legalName} office location`}
                src="https://maps.google.com/maps?q=PT%20Indotek%20Buana%20Karya%20Jl.%20Raya%20Gading%20Tutuka%20No.103%20Soreang%20Bandung&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="h-[360px] w-full border-0 sm:h-[420px] lg:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

type ContactActionProps = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
};

function ContactAction({ label, value, href, icon: Icon }: ContactActionProps) {
  return (
    <a href={href} className="group flex items-center gap-4">
      <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon aria-hidden="true" size={19} />
      </div>
      <div>
        <span className="block text-sm font-bold text-blue-600">{label}</span>
        <span className="mt-1 block text-sm text-slate-500">{value}</span>
      </div>
    </a>
  );
}
