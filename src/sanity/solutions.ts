import "server-only";

import { draftMode } from "next/headers";

import {
  solutionTabs,
  type SolutionTab,
  type SolutionTabId,
} from "@/config/solutions";
import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";
import { getSanityFetchOptions } from "@/sanity/fetch-options";

export type CmsSolutionCapability = {
  title: LocalizedText;
  description: LocalizedText;
  iconName?: string;
};

export type CmsSolutionTab = {
  id: SolutionTabId;
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  iconName?: string;
  capabilities: CmsSolutionCapability[];
};

function localized(en?: string, id?: string): LocalizedText {
  return { en, id: id ?? en };
}

function fallbackSolutions(): CmsSolutionTab[] {
  return solutionTabs.map((solution: SolutionTab) => ({
    id: solution.id,
    label: localized(solution.label),
    title: localized(solution.title),
    description: localized(solution.description),
    image: solution.image,
    iconName:
      solution.id === "infrastructure"
        ? "ServerCog"
        : solution.id === "delivery"
          ? "Code2"
          : "RadioTower",
    capabilities: solution.capabilities.map((capability) => ({
      title: localized(capability.title),
      description: localized(capability.description),
    })),
  }));
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

const solutionsQuery = `*[
  _type == "solution" &&
  status == "published"
] | order(sortOrder asc) {
  "id": coalesce(tabId, slug.current),
  "label": {
    "en": coalesce(labelI18n.en, label),
    "id": coalesce(labelI18n.id, labelI18n.en, label)
  },
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "description": {
    "en": coalesce(descriptionI18n.en, description),
    "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
  },
  iconName,
  "image": image.asset->url,
  "capabilities": coalesce(capabilities, [])[] {
    "title": {
      "en": coalesce(titleI18n.en, title),
      "id": coalesce(titleI18n.id, titleI18n.en, title)
    },
    "description": {
      "en": coalesce(descriptionI18n.en, description),
      "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
    },
    iconName
  }
}`;

function normalizeSolutionId(id: string): SolutionTabId {
  if (id === "delivery" || id === "telecommunication") {
    return id;
  }

  return "infrastructure";
}

export async function getSolutions(): Promise<CmsSolutionTab[]> {
  try {
    const client = await getSanityFetchClient();
    const rows = await client.fetch<
      (Omit<CmsSolutionTab, "id" | "image"> & {
        id?: string;
        image?: string;
      })[]
    >(solutionsQuery, {}, await getSanityFetchOptions(["solutions"]));

    const fallback = fallbackSolutions();
    const solutions = rows
      .filter((solution) => solution.id && solution.title)
      .map((solution, index) => ({
        id: normalizeSolutionId(solution.id ?? "infrastructure"),
        label: solution.label,
        title: solution.title,
        description: solution.description,
        iconName: solution.iconName,
        image: solution.image ?? fallback[index % fallback.length]?.image ?? "/images/industry-defense.png",
        capabilities: solution.capabilities ?? [],
      }));

    return solutions;
  } catch (error) {
    console.warn("Failed to load solutions from Sanity, using fallback.", error);
  }

  return fallbackSolutions();
}
