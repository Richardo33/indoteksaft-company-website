import "server-only";

import { draftMode } from "next/headers";

import { sanityClient } from "@/sanity/client";

export type CompanyProfileDownloadSetting = {
  href: string;
  downloadFileUrl?: string;
  label: string;
  description: string;
  dialogTitle: string;
  dialogDescription: string;
  submitLabel: string;
  message: string;
};

const fallbackCompanyProfileDownloadSetting: CompanyProfileDownloadSetting = {
  href: "/resources/brosur",
  downloadFileUrl: undefined,
  label: "Download Company Profile",
  description: "Full capabilities overview (PDF)",
  dialogTitle: "Download Company Profile",
  dialogDescription:
    "Isi data singkat berikut agar tim sales kami dapat membantu follow-up kebutuhan perusahaan Anda.",
  submitLabel: "Submit & Download",
  message:
    "Download Company Profile request. Please notify the sales team for follow-up.",
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

function parseSettingValue(value: string | null | undefined) {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as Partial<CompanyProfileDownloadSetting> & {
      downloadUrl?: string;
      fileUrl?: string;
    };

    return parsed;
  } catch {
    return {};
  }
}

function normalizeDownloadFileUrl(value: string | undefined) {
  if (!value) return undefined;
  if (value === fallbackCompanyProfileDownloadSetting.href) return undefined;
  return value;
}

export async function getCompanyProfileDownloadSetting(): Promise<CompanyProfileDownloadSetting> {
  try {
    const client = await getSanityFetchClient();
    const draft = await draftMode();
    const row = await client.fetch<{
      setting?: { value?: string } | null;
      document?: { fileUrl?: string; fileAssetUrl?: string } | null;
    }>(
      `{
        "setting": *[_type == "siteSetting" && key == "company_profile_download"][0]{ value },
        "document": *[
          _type == "documentResource" &&
          status == "published" &&
          (documentType == "company_profile" || slug.current == "company-profile")
        ] | order(sortOrder asc)[0] {
          fileUrl,
          "fileAssetUrl": file.asset->url
        }
      }`,
      {},
      draft.isEnabled
        ? { cache: "no-store" }
        : { next: { revalidate: 60, tags: ["site-setting:company_profile_download"] } },
    );

    const parsed = parseSettingValue(row.setting?.value);
    const documentDownloadUrl = row.document?.fileAssetUrl || row.document?.fileUrl;
    const parsedDownloadUrl = normalizeDownloadFileUrl(
      parsed.downloadFileUrl || parsed.fileUrl,
    );
    const cmsDocumentDownloadUrl = normalizeDownloadFileUrl(documentDownloadUrl);

    return {
      ...fallbackCompanyProfileDownloadSetting,
      ...parsed,
      downloadFileUrl:
        parsedDownloadUrl ||
        cmsDocumentDownloadUrl ||
        fallbackCompanyProfileDownloadSetting.downloadFileUrl,
      href:
        parsed.href ||
        parsed.downloadUrl ||
        fallbackCompanyProfileDownloadSetting.href,
    };
  } catch (error) {
    console.warn("Failed to load company profile download setting from Sanity.", error);
    return fallbackCompanyProfileDownloadSetting;
  }
}
