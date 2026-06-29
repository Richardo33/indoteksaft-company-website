"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  defaultLocale,
  localeLabels,
  translateExact,
  type Locale,
} from "@/lib/i18n/translations";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  label: string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "id";
}

const languageChangeEvent = "indoteksaft-language-change";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const storedLocale = window.localStorage.getItem("indoteksaft.locale");
  return isLocale(storedLocale) ? storedLocale : defaultLocale;
}

function subscribeLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(languageChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(languageChangeEvent, callback);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getStoredLocale,
    () => defaultLocale,
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    window.localStorage.setItem("indoteksaft.locale", nextLocale);
    window.dispatchEvent(new Event(languageChangeEvent));
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      label: localeLabels[locale],
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      <LanguageDomTranslator locale={locale} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}

const originalTextNodes = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Partial<Record<"placeholder" | "aria-label" | "title", string>>>();

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function shouldSkipElement(element: Element) {
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === "script" ||
    tagName === "style" ||
    tagName === "noscript" ||
    tagName === "code" ||
    tagName === "pre" ||
    element.closest("[data-i18n-skip]") !== null ||
    element.closest("[contenteditable='true']") !== null
  );
}

function translateTextNode(node: Text, locale: Locale) {
  const parent = node.parentElement;
  if (!parent || shouldSkipElement(parent)) {
    return;
  }

  const original = originalTextNodes.get(node) ?? node.data;
  if (!originalTextNodes.has(node)) {
    originalTextNodes.set(node, original);
  }

  const trimmed = original.trim();
  if (!trimmed) {
    return;
  }

  const translated = translateExact(trimmed, locale);
  const nextValue = preserveWhitespace(original, translated);
  if (node.data !== nextValue) {
    node.data = nextValue;
  }
}

function translateAttribute(
  element: Element,
  attribute: "placeholder" | "aria-label" | "title",
  locale: Locale,
) {
  if (!element.hasAttribute(attribute)) {
    return;
  }

  const current = element.getAttribute(attribute) ?? "";
  const storedAttributes = originalAttributes.get(element) ?? {};
  const original = storedAttributes[attribute] ?? current;

  if (!originalAttributes.has(element)) {
    originalAttributes.set(element, storedAttributes);
  }

  storedAttributes[attribute] = original;

  const translated = translateExact(original.trim(), locale);
  if (element.getAttribute(attribute) !== translated) {
    element.setAttribute(attribute, translated);
  }
}

function translateElementAttributes(root: ParentNode, locale: Locale) {
  const elements = root.querySelectorAll(
    "input[placeholder], textarea[placeholder], [aria-label], [title]",
  );

  elements.forEach((element) => {
    if (shouldSkipElement(element)) {
      return;
    }

    translateAttribute(element, "placeholder", locale);
    translateAttribute(element, "aria-label", locale);
    translateAttribute(element, "title", locale);
  });
}

function walkAndTranslate(root: ParentNode, locale: Locale) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    translateTextNode(node as Text, locale);
    node = walker.nextNode();
  }

  translateElementAttributes(root, locale);
}

function LanguageDomTranslator({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale === "id" ? "id" : "en";

    if (window.location.pathname.startsWith("/studio")) {
      return;
    }

    let observer: MutationObserver | null = null;

    const timeout = window.setTimeout(() => {
      walkAndTranslate(document.body, locale);

      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              translateTextNode(node as Text, locale);
              return;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (!shouldSkipElement(element)) {
                walkAndTranslate(element, locale);
              }
            }
          });

          if (mutation.type === "characterData") {
            translateTextNode(mutation.target as Text, locale);
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      observer?.disconnect();
    };
  }, [locale]);

  return null;
}
