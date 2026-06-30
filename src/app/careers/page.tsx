import type { Metadata } from "next";

import { SimplePageShell } from "@/components/shared/simple-page-shell";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities and future openings at Indoteksaft.",
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersPage() {
  return (
    <SimplePageShell
      eyebrow="Careers"
      title="Build Meaningful Technology with Indoteksaft"
      description="We are preparing a dedicated careers page for future roles, culture, and hiring information."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.04em] text-slate-950">
            Future Opportunities
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Our careers page is currently being prepared. For now, candidates
            or talent partners can contact our team through the official email
            or contact sales page.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Engineering", "Infrastructure", "Project Delivery", "Operations"].map(
            (team) => (
              <div key={team} className="border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-950">{team}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Role information will be available soon.
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </SimplePageShell>
  );
}
