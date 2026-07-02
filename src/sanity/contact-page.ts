import "server-only";

import { draftMode } from "next/headers";

import { company } from "@/config/company";
import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";
import { getSanityFetchOptions } from "@/sanity/fetch-options";

export type CmsContactAction = {
  label: LocalizedText;
  value: LocalizedText;
  href?: string;
  iconName?: string;
};

export type ContactPageData = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  actions: CmsContactAction[];
  locationLabel: LocalizedText;
  officeAddress: LocalizedText;
  mapEmbedUrl: string;
};

function localized(en?: string, id?: string): LocalizedText {
  return { en, id: id ?? en };
}

const fallbackContactPage: ContactPageData = {
  eyebrow: localized("Contact us", "Hubungi kami"),
  title: localized(
    "Ready to Transform Your Business?",
    "Siap Mentransformasi Bisnis Anda?",
  ),
  description: localized(
    "Share your requirements through the form, and our specialists will help you identify the best technology solutions.",
    "Ceritakan kebutuhan Anda melalui formulir, dan spesialis kami akan membantu menemukan solusi teknologi terbaik.",
  ),
  actions: [
    {
      label: localized("Download Company Profile", "Download Company Profile"),
      value: localized("Full capabilities overview (PDF)", "Ringkasan kapabilitas lengkap (PDF)"),
      href: "/resources/brosur",
      iconName: "download",
    },
    {
      label: localized("Whatsapp Only", "WhatsApp Only"),
      value: localized("Chat directly with our sales team", "Chat langsung dengan tim sales kami"),
      href: "https://wa.me/622258999225",
      iconName: "whatsapp",
    },
    {
      label: localized("Email Us", "Email Kami"),
      value: localized(company.email),
      href: `mailto:${company.email}`,
      iconName: "email",
    },
    {
      label: localized("Call Us", "Hubungi Kami"),
      value: localized(company.phone),
      href: "tel:+622258999225",
      iconName: "phone",
    },
  ],
  locationLabel: localized("Office Location", "Lokasi Kantor"),
  officeAddress: localized(company.officeAddress),
  mapEmbedUrl:
    "https://maps.google.com/maps?q=PT%20Indotek%20Buana%20Karya%20Jl.%20Raya%20Gading%20Tutuka%20No.103%20Soreang%20Bandung&t=&z=16&ie=UTF8&iwloc=&output=embed",
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

const contactPageQuery = `*[
  _type == "contactPage" &&
  _id == "contactPage.contact" &&
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
  "actions": coalesce(actions, [])[] {
    "label": {
      "en": coalesce(labelI18n.en, label),
      "id": coalesce(labelI18n.id, labelI18n.en, label)
    },
    "value": {
      "en": coalesce(valueI18n.en, value),
      "id": coalesce(valueI18n.id, valueI18n.en, value)
    },
    href,
    iconName
  },
  "locationLabel": {
    "en": coalesce(locationLabelI18n.en, locationLabel),
    "id": coalesce(locationLabelI18n.id, locationLabelI18n.en, locationLabel)
  },
  "officeAddress": {
    "en": coalesce(officeAddressI18n.en, officeAddress),
    "id": coalesce(officeAddressI18n.id, officeAddressI18n.en, officeAddress)
  },
  mapEmbedUrl
}`;

export async function getContactPageData(): Promise<ContactPageData> {
  try {
    const client = await getSanityFetchClient();
    const data = await client.fetch<Partial<ContactPageData> | null>(
      contactPageQuery,
      {},
      await getSanityFetchOptions(["contact-page"]),
    );

    if (data) {
      return {
        ...fallbackContactPage,
        ...data,
        actions:
          data.actions && data.actions.length > 0
            ? data.actions
            : fallbackContactPage.actions,
        mapEmbedUrl: data.mapEmbedUrl || fallbackContactPage.mapEmbedUrl,
      };
    }
  } catch (error) {
    console.warn("Failed to load contact page from Sanity, using fallback.", error);
  }

  return fallbackContactPage;
}
