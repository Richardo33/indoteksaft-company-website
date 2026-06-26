import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Newspaper, UsersRound } from "lucide-react";

import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore Indoteksaft resources including portfolio projects, clients, and blog articles.",
  alternates: {
    canonical: "/resources",
  },
};

const resources = [
  {
    title: "Portfolio Project",
    href: "/resources/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    title: "Client",
    href: "/resources/client",
    icon: UsersRound,
  },
  {
    title: "Blog & Article",
    href: "/articles",
    icon: Newspaper,
  },
] as const;

export default function ResourcesPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="pt-18">
        <Container className="py-14 sm:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
            Resources
          </span>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;

              return (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="group flex min-h-20 items-center gap-6 transition hover:text-blue-600"
                >
                  <span className="grid size-12 place-items-center bg-cyan-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <span className="text-lg font-medium text-slate-700 transition group-hover:text-blue-600">
                    {resource.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
