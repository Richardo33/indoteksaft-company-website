"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Newspaper,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Container } from "@/components/shared/container";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsNavigationItem } from "@/sanity/navigation";

type ResourcesPageContentProps = {
  resources: CmsNavigationItem[];
};

const iconMap: Record<string, LucideIcon> = {
  article: Newspaper,
  blog: Newspaper,
  brochure: FileText,
  brosur: FileText,
  client: UsersRound,
  event: CalendarDays,
  portfolio: BriefcaseBusiness,
};

function getIcon(iconName?: string) {
  return iconMap[iconName ?? ""] ?? FileText;
}

export function ResourcesPageContent({ resources }: ResourcesPageContentProps) {
  const { locale } = useLanguage();

  return (
    <main className="bg-white text-slate-950">
      <section className="pt-18">
        <Container className="py-14 sm:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
            Resources
          </span>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {resources.map((resource) => {
              const Icon = getIcon(resource.iconName);
              const label = pickLocalized(resource.label, locale);

              return (
                <Link
                  key={`${resource.href}-${label}`}
                  href={resource.href}
                  target={resource.openInNewTab ? "_blank" : undefined}
                  rel={resource.openInNewTab ? "noreferrer" : undefined}
                  className="group flex min-h-20 items-center gap-6 transition hover:text-blue-600"
                >
                  <span className="grid size-12 place-items-center bg-cyan-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <span className="text-lg font-medium text-slate-700 transition group-hover:text-blue-600">
                    {label}
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
