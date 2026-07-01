"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LanguageSelector } from "@/components/i18n/language-selector";
import { useLanguage } from "@/components/i18n/language-provider";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsNavigationItem } from "@/sanity/navigation";

type MobileNavigationProps = {
  items: readonly CmsNavigationItem[];
  resourceItems: readonly CmsNavigationItem[];
};

export function MobileNavigation({ items, resourceItems }: MobileNavigationProps) {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="grid size-10 place-items-center rounded-lg border border-white/10 text-white transition hover:bg-white/5"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi mobile"
          className="absolute inset-x-5 top-[4.75rem] rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          {items.map((item) => {
            const label = pickLocalized(item.label, locale);

            if (item.href === "/resources") {
              return (
                <div key={item.href}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-blue-500/10 hover:text-cyan-300"
                    aria-expanded={resourcesOpen}
                    onClick={() => setResourcesOpen((current) => !current)}
                  >
                    {label}
                    <span className="text-xs text-slate-500">
                      {resourcesOpen ? "Close" : "Open"}
                    </span>
                  </button>

                  {resourcesOpen && (
                    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
                      {resourceItems.map((resource) => {
                        const resourceLabel = pickLocalized(resource.label, locale);

                        return (
                          <Link
                            key={resource.href}
                            href={resource.href}
                            className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-blue-500/10 hover:text-cyan-300"
                            onClick={() => setOpen(false)}
                          >
                            {resourceLabel}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-blue-500/10 hover:text-cyan-300"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <LanguageSelector variant="mobile" />
          <Link
            href="/contact"
            className="mt-2 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Contact Sales
          </Link>
        </nav>
      )}
    </div>
  );
}
