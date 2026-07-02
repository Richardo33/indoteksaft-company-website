import type { Metadata } from "next";

import { EventPageContent } from "@/components/resources/event-page-content";
import { getEventResources } from "@/sanity/documents-events";

export const metadata: Metadata = {
  title: "Event",
  description: "Upcoming events, webinars, and technology sessions by Indoteksaft.",
  alternates: {
    canonical: "/resources/event",
  },
};

export const dynamic = "force-dynamic";

export default async function EventPage() {
  const events = await getEventResources();

  return <EventPageContent events={events} />;
}
