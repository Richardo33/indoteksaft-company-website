"use client";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/components/i18n/language-provider";
import { localeLabels, type Locale } from "@/lib/i18n/translations";

const languages: { locale: Locale; shortLabel: string }[] = [
  { locale: "en", shortLabel: "English" },
  { locale: "id", shortLabel: "Indonesia" },
];

type LanguageSelectorProps = {
  variant?: "desktop" | "mobile";
};

export function LanguageSelector({ variant = "desktop" }: LanguageSelectorProps) {
  const { locale, setLocale, label } = useLanguage();
  const [open, setOpen] = useState(false);

  if (variant === "mobile") {
    return (
      <div className="rounded-xl px-4 py-3" data-i18n-skip>
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm font-medium uppercase text-slate-300"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="inline-flex items-center gap-2">
            <Globe2 aria-hidden="true" size={15} />
            {label}
          </span>
          <ChevronDown
            aria-hidden="true"
            size={15}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="mt-3 grid gap-1">
            {languages.map((language) => (
              <button
                key={language.locale}
                type="button"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-blue-500/10 hover:text-cyan-300"
                onClick={() => {
                  setLocale(language.locale);
                  setOpen(false);
                }}
              >
                {localeLabels[language.locale]}
                {locale === language.locale && <Check aria-hidden="true" size={15} />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" data-i18n-skip>
      <button
        type="button"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase text-slate-300 transition hover:text-cyan-300"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Globe2 aria-hidden="true" size={14} />
        {languages.find((language) => language.locale === locale)?.shortLabel}
        <ChevronDown
          aria-hidden="true"
          size={13}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-48 overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
          {languages.map((language) => (
            <button
              key={language.locale}
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-blue-500/10 hover:text-cyan-300"
              onClick={() => {
                setLocale(language.locale);
                setOpen(false);
              }}
            >
              {localeLabels[language.locale]}
              {locale === language.locale && <Check aria-hidden="true" size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
