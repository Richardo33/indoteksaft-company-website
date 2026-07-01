import type { Locale } from "@/lib/i18n/translations";

export type LocalizedText = {
  en?: string | null;
  id?: string | null;
};

export function pickLocalized(
  value: LocalizedText | null | undefined,
  locale: Locale,
  fallback = "",
) {
  return value?.[locale] || value?.en || value?.id || fallback;
}

export function pickLocalizedList(
  value: LocalizedText[] | null | undefined,
  locale: Locale,
  fallback: readonly string[] = [],
) {
  const localized = value
    ?.map((item) => pickLocalized(item, locale))
    .filter(Boolean);

  return localized && localized.length > 0 ? localized : [...fallback];
}
