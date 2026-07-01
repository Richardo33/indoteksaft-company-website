import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const ROOT = process.cwd();

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1).replace(/^"|"$/g, "");
    process.env[key] ??= value;
  }
}

function localized(value) {
  if (!value) return undefined;
  return { en: value, id: value };
}

function localizedArray(values) {
  if (!Array.isArray(values) || values.length === 0) return undefined;
  return values.map((value) => localized(value)).filter(Boolean);
}

function shouldFill(value) {
  return !value || (!value.en && !value.id);
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-06-30";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || projectId === "placeholder") {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID belum diisi di .env");
}

if (!token) {
  throw new Error("SANITY_API_WRITE_TOKEN belum diisi di .env");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function migrateRotatingTerms() {
  const docs = await client.fetch(
    `*[_type == "bannerRotatingTerm"]{
      _id,
      text,
      textI18n
    }`,
  );

  let count = 0;
  for (const doc of docs) {
    if (!shouldFill(doc.textI18n) || !doc.text) continue;
    await client.patch(doc._id).set({ textI18n: localized(doc.text) }).commit();
    count += 1;
  }
  return count;
}

async function migrateBanners() {
  const docs = await client.fetch(
    `*[_type == "banner"]{
      _id,
      eyebrow,
      title,
      subtitle,
      description,
      ctaLabel,
      secondaryCtaLabel,
      eyebrowI18n,
      titleI18n,
      subtitleI18n,
      descriptionI18n,
      ctaLabelI18n,
      secondaryCtaLabelI18n
    }`,
  );

  let count = 0;
  for (const doc of docs) {
    const patch = {};
    if (shouldFill(doc.eyebrowI18n) && doc.eyebrow) patch.eyebrowI18n = localized(doc.eyebrow);
    if (shouldFill(doc.titleI18n) && doc.title) patch.titleI18n = localized(doc.title);
    if (shouldFill(doc.subtitleI18n) && doc.subtitle) patch.subtitleI18n = localized(doc.subtitle);
    if (shouldFill(doc.descriptionI18n) && doc.description) patch.descriptionI18n = localized(doc.description);
    if (shouldFill(doc.ctaLabelI18n) && doc.ctaLabel) patch.ctaLabelI18n = localized(doc.ctaLabel);
    if (shouldFill(doc.secondaryCtaLabelI18n) && doc.secondaryCtaLabel) {
      patch.secondaryCtaLabelI18n = localized(doc.secondaryCtaLabel);
    }

    if (Object.keys(patch).length === 0) continue;
    await client.patch(doc._id).set(patch).commit();
    count += 1;
  }
  return count;
}

async function migrateProducts() {
  const docs = await client.fetch(
    `*[_type == "product"]{
      _id,
      name,
      shortName,
      subtitle,
      description,
      features,
      benefits,
      nameI18n,
      shortNameI18n,
      subtitleI18n,
      descriptionI18n,
      featuresI18n,
      benefitsI18n
    }`,
  );

  let count = 0;
  for (const doc of docs) {
    const patch = {};
    if (shouldFill(doc.nameI18n) && doc.name) patch.nameI18n = localized(doc.name);
    if (shouldFill(doc.shortNameI18n) && doc.shortName) patch.shortNameI18n = localized(doc.shortName);
    if (shouldFill(doc.subtitleI18n) && doc.subtitle) patch.subtitleI18n = localized(doc.subtitle);
    if (shouldFill(doc.descriptionI18n) && doc.description) patch.descriptionI18n = localized(doc.description);
    if ((!doc.featuresI18n || doc.featuresI18n.length === 0) && doc.features?.length) {
      patch.featuresI18n = localizedArray(doc.features);
    }
    if ((!doc.benefitsI18n || doc.benefitsI18n.length === 0) && doc.benefits?.length) {
      patch.benefitsI18n = localizedArray(doc.benefits);
    }

    if (Object.keys(patch).length === 0) continue;
    await client.patch(doc._id).set(patch).commit();
    count += 1;
  }
  return count;
}

async function migrateArticleCategories() {
  const docs = await client.fetch(
    `*[_type == "articleCategory"]{
      _id,
      name,
      description,
      nameI18n,
      descriptionI18n
    }`,
  );

  let count = 0;
  for (const doc of docs) {
    const patch = {};
    if (shouldFill(doc.nameI18n) && doc.name) patch.nameI18n = localized(doc.name);
    if (shouldFill(doc.descriptionI18n) && doc.description) {
      patch.descriptionI18n = localized(doc.description);
    }

    if (Object.keys(patch).length === 0) continue;
    await client.patch(doc._id).set(patch).commit();
    count += 1;
  }
  return count;
}

async function migrateArticles() {
  const docs = await client.fetch(
    `*[_type == "article"]{
      _id,
      title,
      categoryName,
      excerpt,
      sections,
      titleI18n,
      categoryNameI18n,
      excerptI18n
    }`,
  );

  let count = 0;
  for (const doc of docs) {
    const patch = {};
    if (shouldFill(doc.titleI18n) && doc.title) patch.titleI18n = localized(doc.title);
    if (shouldFill(doc.categoryNameI18n) && doc.categoryName) {
      patch.categoryNameI18n = localized(doc.categoryName);
    }
    if (shouldFill(doc.excerptI18n) && doc.excerpt) patch.excerptI18n = localized(doc.excerpt);

    if (Array.isArray(doc.sections) && doc.sections.length > 0) {
      let sectionsChanged = false;
      const sections = doc.sections.map((section) => {
        const nextSection = { ...section };

        if (shouldFill(section.headingI18n) && section.heading) {
          nextSection.headingI18n = localized(section.heading);
          sectionsChanged = true;
        }

        if (
          (!Array.isArray(section.bodyI18n) || section.bodyI18n.length === 0) &&
          Array.isArray(section.body) &&
          section.body.length > 0
        ) {
          nextSection.bodyI18n = localizedArray(section.body);
          sectionsChanged = true;
        }

        return nextSection;
      });

      if (sectionsChanged) {
        patch.sections = sections;
      }
    }

    if (Object.keys(patch).length === 0) continue;
    await client.patch(doc._id).set(patch).commit();
    count += 1;
  }
  return count;
}

const summary = {
  rotatingTerms: await migrateRotatingTerms(),
  banners: await migrateBanners(),
  products: await migrateProducts(),
  articleCategories: await migrateArticleCategories(),
  articles: await migrateArticles(),
};

console.log("Sanity i18n migration completed:", summary);
