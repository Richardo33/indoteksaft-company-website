import "server-only";

import { draftMode } from "next/headers";

import { company } from "@/config/company";
import { resourceMenuItems } from "@/config/resources";
import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";

export type CmsNavigationItem = {
  label: LocalizedText;
  href: string;
  iconName?: string;
  openInNewTab?: boolean;
};

export type CmsFooterNavigationGroup = {
  title: LocalizedText;
  links: CmsNavigationItem[];
};

const footerGroupTitles = {
  footer_services: { en: "Services", id: "Layanan" },
  footer_company: { en: "Company", id: "Perusahaan" },
  footer_resources: { en: "Resources", id: "Sumber Daya" },
} satisfies Record<string, LocalizedText>;

function localized(en?: string, id?: string): LocalizedText {
  return { en, id: id ?? en };
}

async function getSanityFetchClient() {
  const draft = await draftMode();
  const token =
    process.env.SANITY_API_READ_TOKEN ||
    process.env.SANITY_API_WRITE_TOKEN ||
    undefined;

  return sanityClient.withConfig({
    token,
    useCdn: false,
    perspective: draft.isEnabled && token ? "drafts" : "published",
  });
}

const navigationQuery = `*[
  _type == "navigationItem" &&
  status == "published" &&
  group == $group
] | order(sortOrder asc) {
  "label": {
    "en": coalesce(labelI18n.en, label),
    "id": coalesce(labelI18n.id, labelI18n.en, label)
  },
  href,
  iconName,
  openInNewTab
}`;

async function getNavigationGroup(
  group: string,
  fallback: CmsNavigationItem[],
): Promise<CmsNavigationItem[]> {
  try {
    const client = await getSanityFetchClient();
    const draft = await draftMode();
    const rows = await client.fetch<CmsNavigationItem[]>(
      navigationQuery,
      { group },
      draft.isEnabled
        ? { cache: "no-store" }
        : { next: { revalidate: 60, tags: [`navigation:${group}`] } },
    );

    if (rows.length > 0) {
      return rows;
    }
  } catch (error) {
    console.warn(`Failed to load ${group} navigation from Sanity, using fallback.`, error);
  }

  return fallback;
}

export async function getHeaderNavigation() {
  return getNavigationGroup(
    "header",
    company.navItems.map((item) => ({
      label: localized(item.label),
      href: item.href,
    })),
  );
}

export async function getResourcesNavigation() {
  return getNavigationGroup(
    "resources_drawer",
    resourceMenuItems.map((item) => ({
      label: localized(item.label),
      href: item.href,
      iconName: item.icon,
    })),
  );
}

export async function getFooterNavigation(): Promise<CmsFooterNavigationGroup[]> {
  const [services, footerCompany, resources] = await Promise.all([
    getNavigationGroup(
      "footer_services",
      company.footerLinks[0]?.links.map((item) => ({
        label: localized(item.label),
        href: item.href,
      })) ?? [],
    ),
    getNavigationGroup(
      "footer_company",
      company.footerLinks[1]?.links.map((item) => ({
        label: localized(item.label),
        href: item.href,
      })) ?? [],
    ),
    getNavigationGroup(
      "footer_resources",
      company.footerLinks[2]?.links.map((item) => ({
        label: localized(item.label),
        href: item.href,
      })) ?? [],
    ),
  ]);

  return [
    { title: footerGroupTitles.footer_services, links: services },
    { title: footerGroupTitles.footer_company, links: footerCompany },
    { title: footerGroupTitles.footer_resources, links: resources },
  ];
}
