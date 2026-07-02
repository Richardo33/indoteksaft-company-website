"use client";

import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { SimplePageShell } from "@/components/shared/simple-page-shell";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsEventResource } from "@/sanity/documents-events";

type EventPageContentProps = {
  events: CmsEventResource[];
};

export function EventPageContent({ events }: EventPageContentProps) {
  const { locale } = useLanguage();

  return (
    <SimplePageShell
      eyebrow="Resources"
      title={
        locale === "id"
          ? "Event & Sesi Teknologi"
          : "Events & Technology Sessions"
      }
      description={
        locale === "id"
          ? "Temukan event, webinar, dan sesi teknologi terbaru dari Indoteksaft."
          : "Discover upcoming events, webinars, and technology sessions from Indoteksaft."
      }
    >
      <div className="grid gap-5 md:grid-cols-2" data-i18n-skip>
        {events.length === 0 ? (
          <div className="border border-slate-200 p-6 text-sm leading-7 text-slate-500">
            {locale === "id"
              ? "Belum ada event yang dipublikasikan."
              : "No published events yet."}
          </div>
        ) : (
          events.map((event) => {
            const title = pickLocalized(event.title, locale);
            const description = pickLocalized(event.description, locale);
            const location = pickLocalized(event.location, locale);
            const date = formatEventDate(event.eventDate, locale);

            return (
              <article key={event.slug} className="overflow-hidden border border-slate-200">
                {event.image && (
                  <div className="relative aspect-[16/7] bg-slate-100">
                    <Image
                      src={event.image}
                      alt={title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600">
                    <CalendarDays aria-hidden="true" size={20} />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    {date || "Coming soon"}
                  </p>
                  <h2 className="mt-3 text-lg font-bold text-slate-950">
                    {title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {description}
                  </p>
                  {location && (
                    <p className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500">
                      <MapPin aria-hidden="true" size={16} />
                      {location}
                    </p>
                  )}
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex min-h-10 items-center justify-center border border-blue-600 px-5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      {locale === "id" ? "Daftar Event" : "Register"}
                    </a>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </SimplePageShell>
  );
}

function formatEventDate(date: string | undefined, locale: "en" | "id") {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
