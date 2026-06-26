import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";

import { SimplePageShell } from "@/components/shared/simple-page-shell";

export const metadata: Metadata = {
  title: "Event",
  description: "Upcoming events, webinars, and technology sessions by Indoteksaft.",
  alternates: {
    canonical: "/resources/event",
  },
};

const events = [
  {
    title: "Digital Infrastructure Briefing",
    date: "Coming soon",
    description: "Session overview untuk strategi modernisasi infrastruktur enterprise.",
  },
  {
    title: "Cybersecurity & Monitoring Workshop",
    date: "Coming soon",
    description: "Workshop praktik keamanan, observability, dan operational readiness.",
  },
];

export default function EventPage() {
  return (
    <SimplePageShell
      eyebrow="Resources"
      title="Events & Technology Sessions"
      description="Temukan event, webinar, dan sesi teknologi terbaru dari Indoteksaft."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {events.map((event) => (
          <article key={event.title} className="border border-slate-200 p-6">
            <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600">
              <CalendarDays aria-hidden="true" size={20} />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              {event.date}
            </p>
            <h2 className="mt-3 text-lg font-bold text-slate-950">
              {event.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              {event.description}
            </p>
          </article>
        ))}
      </div>
    </SimplePageShell>
  );
}
