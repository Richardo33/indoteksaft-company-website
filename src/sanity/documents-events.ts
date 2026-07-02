import "server-only";

import { draftMode } from "next/headers";

import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";
import { getSanityFetchOptions } from "@/sanity/fetch-options";

export type CmsDocumentResource = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  documentType: string;
  fileUrl?: string;
  fileAssetUrl?: string;
};

export type CmsEventResource = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  eventDate?: string;
  location: LocalizedText;
  registrationUrl?: string;
  image?: string;
};

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

const documentsQuery = `*[
  _type == "documentResource" &&
  status == "published"
] | order(sortOrder asc) {
  "slug": slug.current,
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "description": {
    "en": coalesce(descriptionI18n.en, description),
    "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
  },
  documentType,
  fileUrl,
  "fileAssetUrl": file.asset->url
}`;

const eventsQuery = `*[
  _type == "event" &&
  status == "published"
] | order(sortOrder asc, eventDate asc) {
  "slug": slug.current,
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "description": {
    "en": coalesce(descriptionI18n.en, description),
    "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
  },
  eventDate,
  "location": {
    "en": coalesce(locationI18n.en, location),
    "id": coalesce(locationI18n.id, locationI18n.en, location)
  },
  registrationUrl,
  "image": image.asset->url
}`;

const fallbackDocuments: CmsDocumentResource[] = [
  {
    slug: "company-profile",
    title: localized("Company Profile", "Company Profile"),
    description: localized(
      "Overview of Indoteksaft capabilities, services, and experience.",
      "Overview kapabilitas, layanan, dan pengalaman Indoteksaft.",
    ),
    documentType: "company_profile",
    fileUrl: "/resources/brosur",
  },
];

export async function getDocumentResources() {
  try {
    const client = await getSanityFetchClient();
    return await client.fetch<CmsDocumentResource[]>(
      documentsQuery,
      {},
      await getSanityFetchOptions(["resources", "resources:documents"]),
    );
  } catch (error) {
    console.warn("Failed to load document resources from Sanity.", error);
    return fallbackDocuments;
  }
}

export async function getEventResources() {
  try {
    const client = await getSanityFetchClient();
    return await client.fetch<CmsEventResource[]>(
      eventsQuery,
      {},
      await getSanityFetchOptions(["resources", "resources:events"]),
    );
  } catch (error) {
    console.warn("Failed to load event resources from Sanity.", error);
    return [];
  }
}
