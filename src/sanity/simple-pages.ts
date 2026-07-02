import "server-only";

import { draftMode } from "next/headers";

import { company } from "@/config/company";
import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";
import { getSanityFetchOptions } from "@/sanity/fetch-options";

export type CmsLegalSection = {
  heading?: LocalizedText;
  body: LocalizedText[];
};

export type CmsLegalPage = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  sections: CmsLegalSection[];
};

export type CmsCareerDepartment = {
  title: LocalizedText;
  description: LocalizedText;
};

export type CmsCareersPage = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  sectionTitle: LocalizedText;
  sectionDescription: LocalizedText;
  departments: CmsCareerDepartment[];
};

function localized(en?: string, id?: string): LocalizedText {
  return { en, id: id ?? en };
}

function localizedList(items: string[], idItems = items): LocalizedText[] {
  return items.map((item, index) => localized(item, idItems[index] ?? item));
}

const fallbackLegalPages: Record<string, CmsLegalPage> = {
  "privacy-policy": {
    eyebrow: localized("Privacy", "Privasi"),
    title: localized("Privacy Policy", "Kebijakan Privasi"),
    description: localized(
      "How we handle information submitted through our website and contact forms.",
      "Bagaimana kami mengelola informasi yang dikirim melalui website dan form kontak.",
    ),
    sections: [
      {
        body: localizedList([
          `${company.legalName} menghargai privasi pengunjung dan menjaga informasi yang dikirimkan melalui website ini untuk kebutuhan komunikasi bisnis yang relevan.`,
        ]),
      },
      {
        heading: localized("Information We Collect", "Informasi yang Kami Kumpulkan"),
        body: localizedList([
          "Kami dapat menerima nama, email, nomor telepon, perusahaan, posisi, industri, serta kebutuhan proyek yang dikirim melalui form kontak.",
        ]),
      },
      {
        heading: localized("How We Use Information", "Bagaimana Informasi Digunakan"),
        body: localizedList([
          "Informasi digunakan untuk menanggapi inquiry, menyusun rekomendasi solusi, dan melakukan komunikasi lanjutan terkait kebutuhan bisnis.",
        ]),
      },
      {
        heading: localized("Contact", "Kontak"),
        body: localizedList([`Pertanyaan privasi dapat dikirimkan ke ${company.email}.`]),
      },
    ],
  },
  "terms-and-conditions": {
    eyebrow: localized("Legal", "Legal"),
    title: localized("Terms & Conditions", "Syarat & Ketentuan"),
    description: localized(
      `General terms for accessing information and submitting inquiries through ${company.brandName}.`,
      `Ketentuan umum untuk mengakses informasi dan mengirim inquiry melalui ${company.brandName}.`,
    ),
    sections: [
      {
        body: localizedList([
          `Konten pada website ini disediakan sebagai informasi umum mengenai profil, layanan, produk, dan aktivitas ${company.legalName}.`,
        ]),
      },
      {
        heading: localized("Use of Website", "Penggunaan Website"),
        body: localizedList([
          "Pengunjung setuju untuk menggunakan website ini secara bertanggung jawab dan tidak melakukan aktivitas yang dapat mengganggu keamanan, performa, atau integritas sistem.",
        ]),
      },
      {
        heading: localized("Service Information", "Informasi Layanan"),
        body: localizedList([
          "Informasi produk dan layanan dapat berubah sewaktu-waktu mengikuti kebutuhan bisnis, teknis, dan kesepakatan dengan klien.",
        ]),
      },
      {
        heading: localized("Contact", "Kontak"),
        body: localizedList([
          `Untuk pertanyaan lebih lanjut terkait ketentuan penggunaan, hubungi kami melalui ${company.email}.`,
        ]),
      },
    ],
  },
};

const fallbackCareersPage: CmsCareersPage = {
  eyebrow: localized("Careers", "Karier"),
  title: localized(
    "Build Meaningful Technology with Indoteksaft",
    "Bangun Teknologi Bermakna Bersama Indoteksaft",
  ),
  description: localized(
    "We are preparing a dedicated careers page for future roles, culture, and hiring information.",
    "Kami sedang menyiapkan halaman karier khusus untuk informasi peran, budaya kerja, dan rekrutmen.",
  ),
  sectionTitle: localized("Future Opportunities", "Peluang Mendatang"),
  sectionDescription: localized(
    "Our careers page is currently being prepared. For now, candidates or talent partners can contact our team through the official email or contact sales page.",
    "Halaman karier sedang disiapkan. Untuk sementara, kandidat atau partner talent dapat menghubungi tim kami melalui email resmi atau halaman contact sales.",
  ),
  departments: ["Engineering", "Infrastructure", "Project Delivery", "Operations"].map(
    (team) => ({
      title: localized(team),
      description: localized(
        "Role information will be available soon.",
        "Informasi posisi akan tersedia segera.",
      ),
    }),
  ),
};

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

const legalPageQuery = `*[
  _type == "legalPage" &&
  pageKey == $pageKey &&
  status == "published"
][0] {
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
  "sections": coalesce(sections, [])[] {
    "heading": {
      "en": coalesce(headingI18n.en, heading),
      "id": coalesce(headingI18n.id, headingI18n.en, heading)
    },
    "body": coalesce(bodyI18n, body[]{ "en": @, "id": @ }, [])
  }
}`;

const careersPageQuery = `*[
  _type == "careersPage" &&
  _id == "careersPage.main" &&
  status == "published"
][0] {
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
  "sectionTitle": {
    "en": coalesce(sectionTitleI18n.en, sectionTitle),
    "id": coalesce(sectionTitleI18n.id, sectionTitleI18n.en, sectionTitle)
  },
  "sectionDescription": {
    "en": coalesce(sectionDescriptionI18n.en, sectionDescription),
    "id": coalesce(sectionDescriptionI18n.id, sectionDescriptionI18n.en, sectionDescription)
  },
  "departments": coalesce(departments, [])[] {
    "title": {
      "en": coalesce(titleI18n.en, title),
      "id": coalesce(titleI18n.id, titleI18n.en, title)
    },
    "description": {
      "en": coalesce(descriptionI18n.en, description),
      "id": coalesce(descriptionI18n.id, descriptionI18n.en, description)
    }
  }
}`;

export async function getLegalPage(pageKey: string): Promise<CmsLegalPage> {
  try {
    const client = await getSanityFetchClient();
    const data = await client.fetch<CmsLegalPage | null>(
      legalPageQuery,
      { pageKey },
      await getSanityFetchOptions(["legal-pages", `legal:${pageKey}`]),
    );

    if (data) {
      return {
        ...fallbackLegalPages[pageKey],
        ...data,
        sections:
          data.sections && data.sections.length > 0
            ? data.sections
            : fallbackLegalPages[pageKey].sections,
      };
    }
  } catch (error) {
    console.warn(`Failed to load ${pageKey} from Sanity, using fallback.`, error);
  }

  return fallbackLegalPages[pageKey];
}

export async function getCareersPage(): Promise<CmsCareersPage> {
  try {
    const client = await getSanityFetchClient();
    const data = await client.fetch<CmsCareersPage | null>(
      careersPageQuery,
      {},
      await getSanityFetchOptions(["careers-page"]),
    );

    if (data) {
      return {
        ...fallbackCareersPage,
        ...data,
        departments:
          data.departments && data.departments.length > 0
            ? data.departments
            : fallbackCareersPage.departments,
      };
    }
  } catch (error) {
    console.warn("Failed to load careers page from Sanity, using fallback.", error);
  }

  return fallbackCareersPage;
}
