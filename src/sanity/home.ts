import "server-only";

import { draftMode } from "next/headers";

import { company } from "@/config/company";
import { articlePages } from "@/config/articles";
import { industryCards } from "@/config/industries";
import { productCatalog, type ProductTheme } from "@/config/products";
import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";

export type HomeHeroContent = {
  eyebrow: LocalizedText;
  titlePrefix: LocalizedText;
  titleSuffix: LocalizedText;
  description: LocalizedText;
  primaryCta: LocalizedText;
  primaryHref: string;
  secondaryCta: LocalizedText;
  secondaryHref: string;
  backgroundImage: string;
  rotatingWords: LocalizedText[];
};

export type HomeMetric = {
  value: string;
  label: string;
};

export type HomeIndustrySummary = {
  slug: string;
  title: string;
  description: string;
  icon: string;
};

export type HomeServiceCard = {
  title: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  href: string;
  points: string[];
};

export type HomeProductCarouselItem = {
  slug: string;
  name: LocalizedText;
  theme: ProductTheme;
  image?: string;
};

export type HomeArticleCard = {
  slug: string;
  category: LocalizedText;
  readTime: string;
  title: LocalizedText;
  date: string;
  image: string;
};

const fallbackHero: HomeHeroContent = {
  eyebrow: {
    en: "Indonesia's critical tech partner",
    id: "Mitra teknologi kritikal Indonesia",
  },
  titlePrefix: { en: "Delivering", id: "Menghadirkan" },
  titleSuffix: { en: "at National Scale", id: "Berskala Nasional" },
  description: {
    en: `${company.legalName} engineers end-to-end technology ecosystems from datacenter design to AI-driven operations trusted by 200+ organizations across Indonesia's most critical sectors.`,
    id: `${company.legalName} membangun ekosistem teknologi end-to-end dari desain datacenter hingga operasi berbasis AI yang dipercaya oleh 200+ organisasi di sektor paling kritikal Indonesia.`,
  },
  primaryCta: { en: "Start Free Consultation", id: "Mulai Konsultasi Gratis" },
  primaryHref: "/contact",
  secondaryCta: { en: "Explore Solutions", id: "Jelajahi Solusi" },
  secondaryHref: "/solutions",
  backgroundImage: "/images/hero-bg.png",
  rotatingWords: [
    {
      en: "Defense-Grade Infrastructure",
      id: "Infrastruktur Kelas Pertahanan",
    },
    { en: "Sovereign Cloud Platforms", id: "Platform Sovereign Cloud" },
    {
      en: "Mission-Critical Cybersecurity",
      id: "Keamanan Siber Mission-Critical",
    },
    { en: "AI-Driven Operations", id: "Operasi Berbasis AI" },
  ],
};

const fallbackServiceCards: HomeServiceCard[] = [
  {
    title: "IT Infrastructure Solutions",
    slug: "it-infrastructure-solutions",
    description:
      "Comprehensive infrastructure solutions designed to optimize performance, strengthen security, and support the evolving needs of modern enterprises.",
    image: "/images/industry-defense.png",
    iconName: "ServerCog",
    href: "/solutions#infrastructure",
    points: [
      "Secure & Reliable Infrastructure",
      "High Availability & Scalability",
      "24/7 Monitoring & Support",
    ],
  },
  {
    title: "Tech Delivery Solutions",
    slug: "tech-delivery-solutions",
    description:
      "Comprehensive technology delivery services that transform business requirements into secure, scalable, and future-ready digital solutions.",
    image: "/images/industry-enterprise.png",
    iconName: "Code2",
    href: "/solutions#delivery",
    points: ["Custom Development", "Scalable Architecture", "End-to-End Delivery"],
  },
  {
    title: "Telecommunication Solutions",
    slug: "telecommunication-solutions",
    description:
      "Comprehensive telecommunications services to support network development, infrastructure maintenance, and reliable connectivity.",
    image: "/images/industry-telecom.png",
    iconName: "RadioTower",
    href: "/solutions#telecommunication",
    points: [
      "BTS Installation & Upgrade",
      "Site Maintenance",
      "Civil, Mechanical & Electrical (CME)",
    ],
  },
];

function fallbackIndustries(): HomeIndustrySummary[] {
  return industryCards.map((industry) => ({
    slug: industry.slug,
    title: industry.title,
    description: industry.description,
    icon: industry.icon,
  }));
}

function fallbackMetrics(): HomeMetric[] {
  return company.metrics.map((metric) => ({
    value: metric.value,
    label: metric.label,
  }));
}

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

function fallbackProductPages(): HomeProductCarouselItem[][] {
  return chunk(
    productCatalog.map((product) => ({
      slug: product.slug,
      name: { en: product.name, id: product.name },
      theme: product.theme,
      image: undefined,
    })),
    4,
  );
}

function fallbackArticlePages(): HomeArticleCard[][] {
  return articlePages.map((page) =>
    page.map((article) => ({
      slug: article.slug,
      category: { en: article.category, id: article.category },
      readTime: article.readTime,
      title: { en: article.title, id: article.title },
      date: article.date,
      image: article.image,
    })),
  );
}

function formatArticleDate(date?: string | null) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
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

const homeHeroQuery = `{
  "banner": *[
    _type == "banner" &&
    pageSlug == "home" &&
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
    "backgroundImage": backgroundImage.asset->url,
    "ctaLabel": {
      "en": coalesce(ctaLabelI18n.en, ctaLabel),
      "id": coalesce(ctaLabelI18n.id, ctaLabelI18n.en, ctaLabel)
    },
    ctaHref,
    "secondaryCtaLabel": {
      "en": coalesce(secondaryCtaLabelI18n.en, secondaryCtaLabel),
      "id": coalesce(secondaryCtaLabelI18n.id, secondaryCtaLabelI18n.en, secondaryCtaLabel)
    },
    secondaryCtaHref
  },
  "rotatingWords": *[
    _type == "bannerRotatingTerm" &&
    pageSlug == "home" &&
    status == "published"
  ] | order(sortOrder asc) {
    "en": coalesce(textI18n.en, select(language == "en" => text), text),
    "id": coalesce(textI18n.id, select(language == "id" => text), textI18n.en, text)
  }
}`;

const homeMetricsQuery = `*[
  _type == "metric" &&
  pageSlug == "home" &&
  status == "published"
] | order(sortOrder asc) {
  value,
  label
}`;

const homeIndustriesQuery = `*[
  _type == "industry" &&
  status == "published"
] | order(sortOrder asc) {
  "slug": slug.current,
  title,
  description,
  "icon": iconName
}`;

const homeServiceCardsQuery = `*[
  _type == "serviceCard" &&
  status == "published"
] | order(sortOrder asc) {
  title,
  "slug": slug.current,
  description,
  iconName,
  "image": image.asset->url,
  "href": detailHref,
  "points": coalesce(points, [])
}`;

const homeProductCarouselQuery = `*[
  _type == "product" &&
  status == "published"
] | order(sortOrder asc)[0...12] {
  "slug": slug.current,
  "name": {
    "en": coalesce(nameI18n.en, name),
    "id": coalesce(nameI18n.id, nameI18n.en, name)
  },
  theme,
  "image": image.asset->url
}`;

const homeArticlesQuery = `*[
  _type == "article" &&
  status == "published"
] | order(coalesce(publishedAt, _createdAt) desc)[0...6] {
  "slug": slug.current,
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "category": {
    "en": coalesce(category->nameI18n.en, categoryNameI18n.en, category->name, categoryName, "Article"),
    "id": coalesce(category->nameI18n.id, categoryNameI18n.id, category->nameI18n.en, categoryNameI18n.en, category->name, categoryName, "Artikel")
  },
  readTime,
  "date": coalesce(publishedAt, _createdAt),
  "image": coverImage.asset->url
}`;

export async function getHomeHero(): Promise<HomeHeroContent> {
  try {
    const client = await getSanityFetchClient();
    const result = await client.fetch<{
      banner?: {
        eyebrow?: LocalizedText;
        title?: LocalizedText;
        subtitle?: LocalizedText;
        description?: LocalizedText;
        backgroundImage?: string;
        ctaLabel?: LocalizedText;
        ctaHref?: string;
        secondaryCtaLabel?: LocalizedText;
        secondaryCtaHref?: string;
      };
      rotatingWords?: LocalizedText[];
    }>(homeHeroQuery, {}, { cache: "no-store" });

    if (result.banner) {
      return {
        eyebrow: result.banner.eyebrow ?? fallbackHero.eyebrow,
        titlePrefix: result.banner.title ?? fallbackHero.titlePrefix,
        titleSuffix: result.banner.subtitle ?? fallbackHero.titleSuffix,
        description: result.banner.description ?? fallbackHero.description,
        primaryCta: result.banner.ctaLabel ?? fallbackHero.primaryCta,
        primaryHref: result.banner.ctaHref ?? fallbackHero.primaryHref,
        secondaryCta:
          result.banner.secondaryCtaLabel ?? fallbackHero.secondaryCta,
        secondaryHref:
          result.banner.secondaryCtaHref ?? fallbackHero.secondaryHref,
        backgroundImage:
          result.banner.backgroundImage ?? fallbackHero.backgroundImage,
        rotatingWords:
          result.rotatingWords && result.rotatingWords.length > 0
            ? result.rotatingWords
            : fallbackHero.rotatingWords,
      };
    }
  } catch (error) {
    console.warn("Failed to load home hero from Sanity, using fallback.", error);
  }

  return fallbackHero;
}

export async function getHomeMetrics(): Promise<HomeMetric[]> {
  try {
    const client = await getSanityFetchClient();
    const metrics = await client.fetch<HomeMetric[]>(
      homeMetricsQuery,
      {},
      { cache: "no-store" },
    );

    if (metrics.length > 0) {
      return metrics;
    }
  } catch (error) {
    console.warn("Failed to load home metrics from Sanity, using fallback.", error);
  }

  return fallbackMetrics();
}

export async function getHomeIndustries(): Promise<HomeIndustrySummary[]> {
  try {
    const client = await getSanityFetchClient();
    const industries = await client.fetch<HomeIndustrySummary[]>(
      homeIndustriesQuery,
      {},
      { cache: "no-store" },
    );

    if (industries.length > 0) {
      return industries;
    }
  } catch (error) {
    console.warn(
      "Failed to load home industries from Sanity, using fallback.",
      error,
    );
  }

  return fallbackIndustries();
}

export async function getHomeServiceCards(): Promise<HomeServiceCard[]> {
  try {
    const client = await getSanityFetchClient();
    const cards = await client.fetch<HomeServiceCard[]>(
      homeServiceCardsQuery,
      {},
      { cache: "no-store" },
    );

    if (cards.length > 0) {
      return cards;
    }
  } catch (error) {
    console.warn(
      "Failed to load home service cards from Sanity, using fallback.",
      error,
    );
  }

  return fallbackServiceCards;
}

export async function getHomeProductPages(): Promise<HomeProductCarouselItem[][]> {
  try {
    const client = await getSanityFetchClient();
    const products = await client.fetch<HomeProductCarouselItem[]>(
      homeProductCarouselQuery,
      {},
      { cache: "no-store" },
    );

    const validProducts = products.filter(
      (product) => product.slug && product.name && product.theme,
    );

    if (validProducts.length > 0) {
      return chunk(validProducts, 4);
    }
  } catch (error) {
    console.warn(
      "Failed to load home product carousel from Sanity, using fallback.",
      error,
    );
  }

  return fallbackProductPages();
}

export async function getHomeArticlePages(): Promise<HomeArticleCard[][]> {
  try {
    const client = await getSanityFetchClient();
    const articles = await client.fetch<
      (Omit<HomeArticleCard, "date" | "image"> & {
        date?: string;
        image?: string;
      })[]
    >(homeArticlesQuery, {}, { cache: "no-store" });

    const validArticles = articles
      .filter((article) => article.slug && article.title)
      .map((article, index) => ({
        slug: article.slug,
        title: article.title,
        category: article.category ?? { en: "Article", id: "Artikel" },
        readTime: article.readTime ?? "5 min read",
        date: formatArticleDate(article.date),
        image:
          article.image ??
          fallbackArticlePages().flat()[index % fallbackArticlePages().flat().length]
            ?.image ??
          "/images/industry-enterprise.png",
      }));

    if (validArticles.length > 0) {
      return chunk(validArticles, 3);
    }
  } catch (error) {
    console.warn(
      "Failed to load home articles from Sanity, using fallback.",
      error,
    );
  }

  return fallbackArticlePages();
}
