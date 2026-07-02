import "server-only";

import { draftMode } from "next/headers";

import { industryCards } from "@/config/industries";
import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";
import { getSanityFetchOptions } from "@/sanity/fetch-options";

export type CmsIndustryBanner = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
};

export type CmsIndustryCard = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  iconName: string;
  image?: string;
};

export type IndustriesPageData = {
  banner: CmsIndustryBanner;
  industries: CmsIndustryCard[];
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

const fallbackData: IndustriesPageData = {
  banner: {
    eyebrow: localized("Trusted across industries", "Dipercaya lintas industri"),
    title: localized(
      "Technology Solutions for Every Industry",
      "Solusi Teknologi untuk Setiap Industri",
    ),
    description: localized(
      "Building a strong digital foundation to support innovation, efficiency, and business growth across multiple sectors.",
      "Membangun fondasi digital yang kuat untuk mendukung inovasi, efisiensi, dan pertumbuhan bisnis di berbagai sektor.",
    ),
    image: "/images/products-banner.png",
  },
  industries: industryCards.map((industry) => ({
    slug: industry.slug,
    title: localized(industry.title),
    description: localized(industry.description),
    iconName: industry.icon,
  })),
};

const bannerQuery = `*[
  _type == "banner" &&
  pageSlug == "industries" &&
  status == "published"
] | order(sortOrder asc)[0] {
  "eyebrow": {
    "en": coalesce(eyebrowI18n.en, eyebrow),
    "id": coalesce(eyebrowI18n.id, eyebrowI18n.en, eyebrow)
  },
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "description": {
    "en": coalesce(descriptionI18n.en, description),
    "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
  },
  "image": coalesce(image.asset->url, backgroundImage.asset->url)
}`;

const industriesQuery = `*[
  _type == "industry" &&
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
  iconName,
  "image": image.asset->url
}`;

export async function getIndustriesPageData(): Promise<IndustriesPageData> {
  try {
    const client = await getSanityFetchClient();
    const fetchOptions = await getSanityFetchOptions(["industries"]);
    const [banner, industries] = await Promise.all([
      client.fetch<CmsIndustryBanner | null>(
        bannerQuery,
        {},
        fetchOptions,
      ),
      client.fetch<CmsIndustryCard[]>(
        industriesQuery,
        {},
        fetchOptions,
      ),
    ]);

    return {
      banner:
        banner && banner.image
          ? banner
          : {
              ...fallbackData.banner,
              ...(banner ?? {}),
            },
      industries,
    };
  } catch (error) {
    console.warn("Failed to load industries page from Sanity.", error);
    return fallbackData;
  }
}
