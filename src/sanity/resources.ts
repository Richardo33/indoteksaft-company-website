import "server-only";

import { draftMode } from "next/headers";

import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";
import { getSanityFetchOptions } from "@/sanity/fetch-options";

export type CmsPortfolioProject = {
  slug: string;
  title: LocalizedText;
  clientName: LocalizedText;
  category: LocalizedText;
  summary: LocalizedText;
  image: string;
};

export type CmsClientLogo = {
  slug: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  category?: string;
};

export type CmsResourceBanner = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
};

function localized(en?: string, id?: string): LocalizedText {
  return { en, id: id ?? en };
}

const fallbackPortfolioProjects: CmsPortfolioProject[] = [
  ["security-appliance-virtualization-solutions", "Security Appliance & Virtualization Solutions", "Mabes TNI AD | Pusansiad | Mabes TNI - Pusinfo | Mabes TNI AL", "/images/mabes-tni.png"],
  ["big-data-platforms", "IT Architecture Solutions for Big Data Platforms", "PT Gudang Garam Tbk.", "/images/gudang-garam.png"],
  ["medical-centers-network", "Network Infrastructure Solutions for Medical Centers", "RS Mata Cicendo | RSUD Bandung Kiwari | RSJ Provinsi Jabar | RSKGM Kota Bandung", "/images/RS-mata-Cicendo.png"],
  ["tax-payment-security", "Tax Payment System Integration & Security Solutions", "Badan Pendapatan Daerah Provinsi Jawa Barat", "/images/BPD-Prov-Jabar.png"],
  ["enterprise-firewall-network-security", "Enterprise Firewall & Network Security Solutions", "PT Leetex Garment Indonesia", "/images/PT-Leetex.png"],
  ["airfield-network-infrastructure", "Advanced Network Infrastructure for Airfield Operations", "Dinas Perhubungan Provinsi Jawa Barat (Dishub Jabar)", "/images/Dishub-Jabar.png"],
  ["comprehensive-it-infrastructure", "Comprehensive IT Infrastructure Solutions", "Yayasan Taruna Bakti", "/images/Yayasan-Taruna-Bakti.png"],
  ["hotel-it-infrastructure", "Hotel IT Infrastructure Solutions for High-Connectivity Environments", "PT Bethesda Hospital Indonesia", "/images/PT-Bethesda.png"],
  ["healthcare-server-production-monitoring", "Managed High-Capacity Server Services & Production Monitoring for Healthcare Facilities", "Rumah Sakit Paru dr. H. A. Rotinsulu", "/images/RS-Paru.png"],
  ["telecom-installation-dismantling", "Telecommunications Infrastructure Installation & Dismantling Services", "PT Telekomunikasi Selular (Telkomsel)", "/images/PT-Telkomsel.png"],
].map(([slug, title, clientName, image]) => ({
  slug,
  title: localized(title),
  clientName: localized(clientName),
  category: localized("Client", "Klien"),
  summary: localized(""),
  image,
}));

const fallbackClientLogos: CmsClientLogo[] = Array.from({ length: 98 }, (_, index) => ({
  slug: `client-${index + 1}`,
  name: `Client ${index + 1}`,
  logo: `/client-ikon/Frame ${index + 1}.png`,
}));

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

const bannerFields = `
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
  }
`;

const portfolioBannerQuery = `*[
  _type == "banner" &&
  pageSlug == "resources-portfolio" &&
  status == "published"
] | order(sortOrder asc)[0] { ${bannerFields} }`;

const clientBannerQuery = `*[
  _type == "banner" &&
  pageSlug == "resources-client" &&
  status == "published"
] | order(sortOrder asc)[0] { ${bannerFields} }`;

const portfolioQuery = `*[
  _type == "portfolioProject" &&
  status == "published"
] | order(sortOrder asc) {
  "slug": slug.current,
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "clientName": {
    "en": coalesce(clientNameI18n.en, clientName),
    "id": coalesce(clientNameI18n.id, clientNameI18n.en, clientName)
  },
  "category": {
    "en": coalesce(categoryI18n.en, category, "Client"),
    "id": coalesce(categoryI18n.id, categoryI18n.en, category, "Klien")
  },
  "summary": {
    "en": coalesce(summaryI18n.en, summary),
    "id": coalesce(summaryI18n.id, summaryI18n.en, summary)
  },
  "image": image.asset->url
}`;

const clientsQuery = `*[
  _type == "client" &&
  status == "published"
] | order(sortOrder asc) {
  "slug": slug.current,
  name,
  "logo": logo.asset->url,
  websiteUrl,
  category
}`;

export async function getPortfolioPageData() {
  const fallbackBanner: CmsResourceBanner = {
    eyebrow: localized("Portfolio Project", "Proyek Portfolio"),
    title: localized("Project Experience", "Pengalaman Proyek"),
    description: localized(
      "From infrastructure modernization to intelligent digital solutions, our projects reflect a commitment to innovation, reliability, and measurable impact.",
      "Dari modernisasi infrastruktur hingga solusi digital cerdas, proyek kami mencerminkan komitmen pada inovasi, reliabilitas, dan dampak terukur.",
    ),
  };

  try {
    const client = await getSanityFetchClient();
    const fetchOptions = await getSanityFetchOptions([
      "resources",
      "resources:portfolio",
    ]);
    const [banner, projects] = await Promise.all([
      client.fetch<CmsResourceBanner | null>(
        portfolioBannerQuery,
        {},
        fetchOptions,
      ),
      client.fetch<CmsPortfolioProject[]>(portfolioQuery, {}, fetchOptions),
    ]);

    return {
      banner: banner ?? fallbackBanner,
      projects,
    };
  } catch (error) {
    console.warn("Failed to load portfolio from Sanity.", error);
    return { banner: fallbackBanner, projects: fallbackPortfolioProjects };
  }
}

export async function getClientPageData() {
  const fallbackBanner: CmsResourceBanner = {
    eyebrow: localized("Our Clients", "Klien Kami"),
    title: localized(
      "Building Long-Term Technology Partnerships",
      "Membangun Kemitraan Teknologi Jangka Panjang",
    ),
    description: localized(
      "We work closely with organizations to design, implement, and optimize technology ecosystems that support their strategic objectives and digital transformation journey.",
      "Kami bekerja erat dengan organisasi untuk merancang, mengimplementasikan, dan mengoptimalkan ekosistem teknologi yang mendukung tujuan strategis serta perjalanan transformasi digital.",
    ),
  };

  try {
    const client = await getSanityFetchClient();
    const fetchOptions = await getSanityFetchOptions([
      "resources",
      "resources:clients",
    ]);
    const [banner, clients] = await Promise.all([
      client.fetch<CmsResourceBanner | null>(
        clientBannerQuery,
        {},
        fetchOptions,
      ),
      client.fetch<CmsClientLogo[]>(clientsQuery, {}, fetchOptions),
    ]);

    return {
      banner: banner ?? fallbackBanner,
      clients,
    };
  } catch (error) {
    console.warn("Failed to load clients from Sanity.", error);
    return { banner: fallbackBanner, clients: fallbackClientLogos };
  }
}
