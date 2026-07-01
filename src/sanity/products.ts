import "server-only";

import { draftMode } from "next/headers";

import {
  productCatalog,
  type ProductTheme,
  type SoftwareProduct,
} from "@/config/products";
import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";

export type CmsProductSummary = {
  slug: string;
  name: LocalizedText;
  theme: ProductTheme;
  image?: string;
};

export type CmsProductDetail = {
  slug: string;
  name: LocalizedText;
  shortName: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  theme: ProductTheme;
  image?: string;
  brochureUrl?: string;
  demoUrl?: string;
  features: LocalizedText[];
  benefits: LocalizedText[];
};

export type CmsProductsBanner = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  image: string;
};

export type ProductsPageData = {
  banner: CmsProductsBanner;
  products: CmsProductSummary[];
};

function localized(en?: string, id?: string): LocalizedText {
  return { en, id: id ?? en };
}

function localizedList(items: readonly string[]): LocalizedText[] {
  return items.map((item) => localized(item));
}

const fallbackBanner: CmsProductsBanner = {
  eyebrow: localized("Product", "Produk"),
  title: localized("Enterprise Software Solutions", "Solusi Software Enterprise"),
  subtitle: localized(""),
  description: localized(
    "Scalable software products engineered to help organizations innovate faster, improve efficiency, and stay ahead in a digital-first world.",
    "Produk software scalable yang dirancang untuk membantu organisasi berinovasi lebih cepat, meningkatkan efisiensi, dan tetap unggul di era digital.",
  ),
  image: "/images/products-banner.png",
};

function fromStaticProduct(product: SoftwareProduct): CmsProductDetail {
  return {
    slug: product.slug,
    name: localized(product.name),
    shortName: localized(product.shortName),
    subtitle: localized(product.subtitle),
    description: localized(product.description),
    theme: product.theme,
    brochureUrl: product.brochureUrl,
    demoUrl: product.demoUrl,
    features: localizedList(product.features),
    benefits: localizedList(product.benefits),
  };
}

function fallbackProducts(): CmsProductSummary[] {
  return productCatalog.map((product) => ({
    slug: product.slug,
    name: localized(product.name),
    theme: product.theme,
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

const productsBannerQuery = `*[
  _type == "banner" &&
  pageSlug == "products" &&
  placement == "hero" &&
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
  "subtitle": {
    "en": coalesce(subtitleI18n.en, subtitle),
    "id": coalesce(subtitleI18n.id, subtitleI18n.en, subtitle)
  },
  "description": {
    "en": coalesce(descriptionI18n.en, description),
    "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
  },
  "image": coalesce(image.asset->url, backgroundImage.asset->url)
}`;

const productSummariesQuery = `*[
  _type == "product" &&
  status == "published"
] | order(sortOrder asc) {
  "slug": slug.current,
  "name": {
    "en": coalesce(nameI18n.en, name),
    "id": coalesce(nameI18n.id, nameI18n.en, name)
  },
  theme,
  "image": image.asset->url
}`;

const productDetailQuery = `*[
  _type == "product" &&
  slug.current == $slug &&
  status == "published"
][0] {
  "slug": slug.current,
  "name": {
    "en": coalesce(nameI18n.en, name),
    "id": coalesce(nameI18n.id, nameI18n.en, name)
  },
  "shortName": {
    "en": coalesce(shortNameI18n.en, shortName, name),
    "id": coalesce(shortNameI18n.id, shortNameI18n.en, shortName, name)
  },
  "subtitle": {
    "en": coalesce(subtitleI18n.en, subtitle),
    "id": coalesce(subtitleI18n.id, subtitleI18n.en, subtitle)
  },
  "description": {
    "en": coalesce(descriptionI18n.en, description),
    "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
  },
  theme,
  "image": image.asset->url,
  brochureUrl,
  demoUrl,
  "features": coalesce(featuresI18n, features[]{ "en": @, "id": @ }, []),
  "benefits": coalesce(benefitsI18n, benefits[]{ "en": @, "id": @ }, [])
}`;

const productSlugsQuery = `*[
  _type == "product" &&
  status == "published" &&
  defined(slug.current)
] { "slug": slug.current }`;

export async function getProductsPageData(): Promise<ProductsPageData> {
  try {
    const client = await getSanityFetchClient();
    const [banner, products] = await Promise.all([
      client.fetch<CmsProductsBanner | null>(
        productsBannerQuery,
        {},
        { cache: "no-store" },
      ),
      client.fetch<CmsProductSummary[]>(
        productSummariesQuery,
        {},
        { cache: "no-store" },
      ),
    ]);

    return {
      banner: banner
        ? { ...fallbackBanner, ...banner, image: banner.image ?? fallbackBanner.image }
        : fallbackBanner,
      products: products.length > 0 ? products : fallbackProducts(),
    };
  } catch (error) {
    console.warn("Failed to load products from Sanity, using fallback.", error);
    return {
      banner: fallbackBanner,
      products: fallbackProducts(),
    };
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<CmsProductDetail | null> {
  try {
    const client = await getSanityFetchClient();
    const product = await client.fetch<CmsProductDetail | null>(
      productDetailQuery,
      { slug },
      { cache: "no-store" },
    );

    if (product) {
      return product;
    }
  } catch (error) {
    console.warn("Failed to load product from Sanity, using fallback.", error);
  }

  const fallback = productCatalog.find((item) => item.slug === slug);
  return fallback ? fromStaticProduct(fallback) : null;
}

export async function getProductSlugs() {
  try {
    const token =
      process.env.SANITY_API_READ_TOKEN ||
      process.env.SANITY_API_WRITE_TOKEN ||
      undefined;
    const client = sanityClient.withConfig({
      token,
      useCdn: false,
      perspective: "published",
    });
    const rows = await client.fetch<{ slug: string }[]>(
      productSlugsQuery,
      {},
      { cache: "no-store" },
    );

    if (rows.length > 0) {
      return rows.map((row) => row.slug);
    }
  } catch (error) {
    console.warn("Failed to load product slugs from Sanity, using fallback.", error);
  }

  return productCatalog.map((product) => product.slug);
}
