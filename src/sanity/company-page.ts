import "server-only";

import { draftMode } from "next/headers";

import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";

export type CmsCompanyBanner = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
};

export type CmsCompanyStatement = {
  key: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
};

export type CmsCompanyValue = {
  title: LocalizedText;
  description: LocalizedText;
  iconName?: string;
};

export type CmsCompanyLeader = {
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  image: string;
  linkedinUrl?: string;
};

export type CompanyPageData = {
  banner: CmsCompanyBanner;
  statements: CmsCompanyStatement[];
  values: CmsCompanyValue[];
  leaders: CmsCompanyLeader[];
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

const fallbackData: CompanyPageData = {
  banner: {
    eyebrow: localized("About Indoteksaft", "Tentang Indoteksaft"),
    title: localized("Make it Happen. Make it Matter.", "Make it Happen. Make it Matter."),
    description: localized(
      "We turn ideas into impactful digital solutions that drive real change for businesses and society.",
      "Kami mengubah ide menjadi solusi digital berdampak yang mendorong perubahan nyata bagi bisnis dan masyarakat.",
    ),
    image: "/images/hero-bg.png",
  },
  statements: [
    {
      key: "vision",
      eyebrow: localized("Our Vision", "Visi Kami"),
      title: localized("Our Vision", "Visi Kami"),
      description: localized(
        "To become a leading technology company in Indonesia delivering excellent, innovative, and impactful digital solutions for business and society.",
        "Menjadi perusahaan teknologi terdepan di Indonesia yang menghadirkan solusi digital unggul, inovatif, dan berdampak bagi bisnis serta masyarakat.",
      ),
    },
    {
      key: "mission",
      eyebrow: localized("Our Mission", "Misi Kami"),
      title: localized("Our Mission", "Misi Kami"),
      description: localized(
        "To provide IT solutions that improve our clients' efficiency, profitability, and competitiveness through high-quality services powered by AI, IoT, and sustainable digital innovation.",
        "Menyediakan solusi TI yang meningkatkan efisiensi, profitabilitas, dan daya saing klien melalui layanan berkualitas tinggi berbasis AI, IoT, dan inovasi digital berkelanjutan.",
      ),
    },
  ],
  values: [
    {
      title: localized("Solution", "Solusi"),
      description: localized(
        "Simplifying problems by providing the right solutions to customers.",
        "Menyederhanakan masalah dengan memberikan solusi yang tepat bagi pelanggan.",
      ),
      iconName: "RadioTower",
    },
    {
      title: localized("Integrity", "Integritas"),
      description: localized(
        "Committed to providing maximum service to customers so as to maintain long-term cooperative relationships.",
        "Berkomitmen memberikan layanan maksimal kepada pelanggan untuk menjaga hubungan kerja sama jangka panjang.",
      ),
      iconName: "RadioTower",
    },
    {
      title: localized("Professionalism", "Profesionalisme"),
      description: localized(
        "Developing competent human resources with the ability to face challenges and bring success to the company.",
        "Mengembangkan sumber daya manusia kompeten yang mampu menghadapi tantangan dan membawa keberhasilan bagi perusahaan.",
      ),
      iconName: "RadioTower",
    },
    {
      title: localized("Improvement", "Peningkatan"),
      description: localized(
        "Conducting continuous improvements that drive the company's business development.",
        "Melakukan peningkatan berkelanjutan yang mendorong pengembangan bisnis perusahaan.",
      ),
      iconName: "RadioTower",
    },
  ],
  leaders: [
    {
      name: "Alfi Muhammad",
      role: localized("CEO & Co-Founder", "CEO & Co-Founder"),
      bio: localized(""),
      image: "/images/Pak-Alfi.svg",
    },
    {
      name: "Mochamad Syadam",
      role: localized("Director & Co-Founder", "Direktur & Co-Founder"),
      bio: localized(""),
      image: "/images/Pak-Syadam.svg",
    },
  ],
};

const bannerQuery = `*[
  _type == "banner" &&
  pageSlug == "company" &&
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
  "image": coalesce(backgroundImage.asset->url, image.asset->url)
}`;

const statementsQuery = `*[
  _type == "companyStatement" &&
  status == "published"
] | order(sortOrder asc) {
  key,
  "eyebrow": {
    "en": coalesce(eyebrowI18n.en, eyebrow, title),
    "id": coalesce(eyebrowI18n.id, eyebrowI18n.en, eyebrow, title)
  },
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "description": {
    "en": coalesce(descriptionI18n.en, description),
    "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
  }
}`;

const valuesQuery = `*[
  _type == "companyValue" &&
  status == "published"
] | order(sortOrder asc) {
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "description": {
    "en": coalesce(descriptionI18n.en, description),
    "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
  },
  iconName
}`;

const leadersQuery = `*[
  _type == "companyLeader" &&
  status == "published"
] | order(sortOrder asc) {
  name,
  "role": {
    "en": coalesce(roleI18n.en, role),
    "id": coalesce(roleI18n.id, roleI18n.en, role)
  },
  "bio": {
    "en": coalesce(bioI18n.en, bio),
    "id": coalesce(bioI18n.id, bioI18n.en, bio)
  },
  "image": photo.asset->url,
  linkedinUrl
}`;

export async function getCompanyPageData(): Promise<CompanyPageData> {
  try {
    const client = await getSanityFetchClient();
    const draft = await draftMode();
    const options = draft.isEnabled
      ? { cache: "no-store" as const }
      : { next: { revalidate: 60, tags: ["company-page"] } };

    const [banner, statements, values, leaders] = await Promise.all([
      client.fetch<CmsCompanyBanner | null>(bannerQuery, {}, options),
      client.fetch<CmsCompanyStatement[]>(statementsQuery, {}, options),
      client.fetch<CmsCompanyValue[]>(valuesQuery, {}, options),
      client.fetch<CmsCompanyLeader[]>(leadersQuery, {}, options),
    ]);

    return {
      banner: banner?.image ? banner : fallbackData.banner,
      statements: statements.length > 0 ? statements : fallbackData.statements,
      values: values.length > 0 ? values : fallbackData.values,
      leaders: leaders.length > 0 ? leaders : fallbackData.leaders,
    };
  } catch (error) {
    console.warn("Failed to load company page from Sanity.", error);
    return fallbackData;
  }
}
