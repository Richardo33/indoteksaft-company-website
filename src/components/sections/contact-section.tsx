"use client";

import {
  ClipboardCheck,
  Download,
  Mail,
  MapPin,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { CompanyProfileDownloadDialog } from "@/components/sections/company-profile-download-dialog";
import { ContactFormLoader } from "@/components/sections/contact-form-loader";
import { Reveal } from "@/components/shared/reveal";
import { useLanguage } from "@/components/i18n/language-provider";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type {
  HomeContactDetail,
  HomeContactSectionContent,
} from "@/sanity/home";

type ContactSectionProps = {
  content?: HomeContactSectionContent;
};

const iconMap: Record<string, LucideIcon> = {
  assessment: ClipboardCheck,
  download: Download,
  email: Mail,
  location: MapPin,
};

const fallbackContent: HomeContactSectionContent = {
  eyebrow: { en: "Get started", id: "Mulai" },
  title: { en: "Free Consultation", id: "Konsultasi Gratis" },
  description: {
    en: "Schedule a consultation with our technology architects to discuss your infrastructure needs and digital transformation roadmap.",
    id: "Jadwalkan konsultasi dengan arsitek teknologi kami untuk membahas kebutuhan infrastruktur dan roadmap transformasi digital Anda.",
  },
  details: [
    {
      label: { en: "Email", id: "Email" },
      value: { en: "info@indoteksaft.co.id", id: "info@indoteksaft.co.id" },
      href: "mailto:info@indoteksaft.co.id",
      iconName: "email",
    },
    {
      label: { en: "Location", id: "Lokasi" },
      value: { en: "Jakarta, Indonesia", id: "Jakarta, Indonesia" },
      iconName: "location",
    },
    {
      label: { en: "Download Company Profile", id: "Download Company Profile" },
      value: {
        en: "Full capabilities overview (PDF)",
        id: "Ringkasan kapabilitas lengkap (PDF)",
      },
      href: "/resources/brosur",
      iconName: "download",
    },
    {
      label: { en: "Request Assessment", id: "Request Assessment" },
      value: {
        en: "Get a comprehensive infrastructure audit",
        id: "Dapatkan audit infrastruktur komprehensif",
      },
      href: "#contact",
      iconName: "assessment",
    },
  ],
};

export function ContactSection({ content }: ContactSectionProps) {
  const { locale } = useLanguage();
  const sectionContent = content ?? fallbackContent;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-white pb-0 pt-16 text-slate-950 sm:pt-20 lg:pt-24"
    >
      <Container>
        <div className="grid gap-14 border-b border-slate-200 pb-12 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {pickLocalized(sectionContent.eyebrow, locale)}
            </span>
            <h2
              id="contact-title"
              className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
            >
              {pickLocalized(sectionContent.title, locale)}
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-slate-500 sm:text-lg">
              {pickLocalized(sectionContent.description, locale)}
            </p>

            <div className="mt-9 space-y-5">
              {sectionContent.details.map((detail) => (
                <ContactDetail
                  key={`${detail.iconName}-${pickLocalized(detail.label, locale)}`}
                  detail={detail}
                />
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ContactFormLoader />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

type ContactDetailProps = {
  detail: HomeContactDetail;
};

function ContactDetail({ detail }: ContactDetailProps) {
  const { locale } = useLanguage();
  const label = pickLocalized(detail.label, locale);
  const value = pickLocalized(detail.value, locale);

  if (detail.iconName === "download") {
    return (
      <CompanyProfileDownloadDialog
        downloadUrl={detail.href}
        label={label}
        description={value}
      />
    );
  }

  const Icon = iconMap[detail.iconName ?? ""] ?? Mail;
  const content = (
    <>
      <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon aria-hidden="true" size={19} />
      </div>
      <div>
        <span className="block text-sm font-bold text-blue-600">{label}</span>
        <span className="mt-1 block text-sm text-slate-500">{value}</span>
      </div>
    </>
  );

  if (detail.href) {
    return (
      <a href={detail.href} className="group flex items-center gap-4">
        {content}
      </a>
    );
  }

  return <div className="group flex items-center gap-4">{content}</div>;
}
