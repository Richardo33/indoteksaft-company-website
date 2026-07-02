"use client";

import {
  Download,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { CompanyProfileDownloadDialog } from "@/components/sections/company-profile-download-dialog";
import { ContactForm } from "@/components/sections/contact-form";
import { Container } from "@/components/shared/container";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsContactAction, ContactPageData } from "@/sanity/contact-page";

type ContactPageContentProps = {
  data: ContactPageData;
};

const iconMap: Record<string, LucideIcon> = {
  download: Download,
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
};

export function ContactPageContent({ data }: ContactPageContentProps) {
  const { locale } = useLanguage();

  return (
    <main className="bg-white pt-18 text-slate-950">
      <section aria-labelledby="contact-sales-title" className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                {pickLocalized(data.eyebrow, locale)}
              </span>
              <h1
                id="contact-sales-title"
                className="mt-5 max-w-md text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
              >
                {pickLocalized(data.title, locale)}
              </h1>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-500">
                {pickLocalized(data.description, locale)}
              </p>

              <div className="mt-9 space-y-5">
                {data.actions.map((action) => (
                  <ContactAction
                    key={`${action.iconName}-${pickLocalized(action.label, locale)}`}
                    action={action}
                  />
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
                  {pickLocalized(data.locationLabel, locale)}
                </span>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {pickLocalized(data.officeAddress, locale)}
                </p>
              </div>
            </div>

            <div className="overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title={`${pickLocalized(data.locationLabel, locale)} map`}
                src={data.mapEmbedUrl}
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
  action: CmsContactAction;
};

function ContactAction({ action }: ContactActionProps) {
  const { locale } = useLanguage();
  const label = pickLocalized(action.label, locale);
  const value = pickLocalized(action.value, locale);

  if (action.iconName === "download") {
    return (
      <CompanyProfileDownloadDialog
        downloadUrl={action.href}
        label={label}
        description={value}
      />
    );
  }

  const Icon = iconMap[action.iconName ?? ""] ?? Mail;

  return (
    <a href={action.href ?? "#"} className="group flex items-center gap-4">
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
