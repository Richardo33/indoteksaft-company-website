import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { Pool } from "pg";

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

const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? "indoteksaft_company",
  user: process.env.DB_USER ?? "indoteksaft",
  password: process.env.DB_PASSWORD,
  ssl:
    process.env.DB_SSLMODE === "require"
      ? { rejectUnauthorized: true }
      : undefined,
});

const uploadedAssets = new Map();

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stableId(type, slug) {
  return `${type}.${slugify(slug)}`;
}

function localized(value, idValue = value) {
  if (value === undefined || value === null || value === "") return undefined;
  return {
    en: value,
    id: idValue,
  };
}

function localizedArray(values) {
  if (!Array.isArray(values)) return undefined;
  return values.map((value) => localized(value)).filter(Boolean);
}

function imageField(asset) {
  if (!asset) return undefined;
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

async function q(text, params = []) {
  return pool.query(text, params);
}

async function getAssetById(id) {
  if (!id) return null;
  const { rows } = await q(
    "SELECT slug, title, alt_text, file_url FROM cms_media_assets WHERE id = $1",
    [id],
  );
  return rows[0] ?? null;
}

async function uploadAsset(media) {
  if (!media?.file_url) return null;
  if (uploadedAssets.has(media.slug)) return uploadedAssets.get(media.slug);

  const relativePath = media.file_url.replace(/^\//, "");
  const filePath = path.join(ROOT, "public", relativePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip asset "${media.slug}": file tidak ditemukan ${filePath}`);
    return null;
  }

  const existing = await sanity.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]`,
    { filename: path.basename(filePath) },
  );
  if (existing?._id) {
    uploadedAssets.set(media.slug, existing);
    return existing;
  }

  const uploaded = await sanity.assets.upload(
    "image",
    fs.createReadStream(filePath),
    {
      filename: path.basename(filePath),
      title: media.title,
      label: media.alt_text,
    },
  );
  uploadedAssets.set(media.slug, uploaded);
  return uploaded;
}

async function uploadAssetById(id) {
  const media = await getAssetById(id);
  return uploadAsset(media);
}

async function seedArticleCategories() {
  const { rows } = await q(
    "SELECT * FROM cms_article_categories ORDER BY sort_order, name",
  );

  for (const row of rows) {
    await sanity.createIfNotExists({
      _id: stableId("articleCategory", row.slug),
      _type: "articleCategory",
      name: row.name,
      nameI18n: localized(row.name),
      slug: { _type: "slug", current: row.slug },
      description: row.description,
      descriptionI18n: localized(row.description),
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedArticles() {
  const { rows } = await q(
    `SELECT a.*,
      c.slug AS category_slug,
      COALESCE(
        jsonb_agg(
          jsonb_build_object('heading', s.heading, 'body', s.body)
          ORDER BY s.sort_order
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'::jsonb
      ) AS sections
     FROM cms_articles a
     LEFT JOIN cms_article_categories c ON c.id = a.category_id
     LEFT JOIN cms_article_sections s ON s.article_id = a.id
     GROUP BY a.id, c.slug
     ORDER BY a.published_at DESC, a.title`,
  );

  for (const row of rows) {
    const cover = await uploadAssetById(row.image_asset_id);
    await sanity.createIfNotExists({
      _id: stableId("article", row.slug),
      _type: "article",
      title: row.title,
      titleI18n: localized(row.title),
      slug: { _type: "slug", current: row.slug },
      category: row.category_slug
        ? {
            _type: "reference",
            _ref: stableId("articleCategory", row.category_slug),
          }
        : undefined,
      categoryName: row.category_name,
      categoryNameI18n: localized(row.category_name),
      excerpt: row.excerpt,
      excerptI18n: localized(row.excerpt),
      readTime: row.read_time,
      coverImage: imageField(cover),
      sections: row.sections.map((section, index) => ({
        _key: `${row.slug}-section-${index}`,
        _type: "object",
        heading: section.heading,
        headingI18n: localized(section.heading),
        body: section.body,
        bodyI18n: localizedArray(section.body),
      })),
      isFeatured: row.is_featured,
      publishedAt: row.published_at?.toISOString?.() ?? row.published_at,
      status: row.status,
    });
  }

  return rows.length;
}

try {
  const summary = {
    articleCategories: await seedArticleCategories(),
    articles: await seedArticles(),
  };
  console.log("Sanity article seed completed:", summary);
} finally {
  await pool.end();
}
