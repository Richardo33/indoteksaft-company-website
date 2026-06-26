"use client";

import Link from "next/link";
import { BriefcaseBusiness, Newspaper, UsersRound } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/shared/container";
import { resourceMenuItems, type ResourceMenuItem } from "@/config/resources";
import type { NavItem } from "@/types/company";

type DesktopNavigationProps = {
  items: readonly NavItem[];
};

const resourceIcons = {
  portfolio: BriefcaseBusiness,
  client: UsersRound,
  article: Newspaper,
} satisfies Record<
  ResourceMenuItem["icon"],
  React.ComponentType<{ size?: number; className?: string }>
>;

export function DesktopNavigation({ items }: DesktopNavigationProps) {
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="hidden items-center gap-7 lg:flex"
      >
        {items.map((item) => {
          if (item.label === "Resources") {
            return (
              <button
                key={item.label}
                type="button"
                aria-expanded={resourcesOpen}
                aria-controls="resources-navigation-drawer"
                className={`text-sm font-medium transition-colors ${
                  resourcesOpen
                    ? "text-cyan-300"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
                onClick={() => setResourcesOpen((current) => !current)}
              >
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
              onClick={() => setResourcesOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {resourcesOpen && (
        <div
          id="resources-navigation-drawer"
          className="absolute inset-x-0 top-full hidden border-t border-slate-200 bg-white text-slate-950 shadow-2xl shadow-slate-950/10 lg:block"
        >
          <Container className="py-5">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
              Resources
            </span>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {resourceMenuItems.map((resource) => {
                const Icon = resourceIcons[resource.icon];

                return (
                  <Link
                    key={resource.href}
                    href={resource.href}
                    className="group flex min-h-12 items-center gap-4 px-3 py-2 transition hover:bg-slate-50 hover:text-blue-600"
                    onClick={() => setResourcesOpen(false)}
                  >
                    <span className="grid size-9 place-items-center bg-cyan-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon aria-hidden="true" size={17} />
                    </span>
                    <span className="text-base font-medium text-slate-700 transition group-hover:text-blue-600">
                      {resource.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
