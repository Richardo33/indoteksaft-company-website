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
  return { en: value, id: idValue };
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

function mapNavigationGroup(menuKey) {
  return {
    main: "header",
    resources: "resources_drawer",
    "footer-services": "footer_services",
    "footer-company": "footer_company",
    "footer-resources": "footer_resources",
  }[menuKey] ?? menuKey;
}

function navigationIcon(row) {
  if (row.icon_name) return row.icon_name;
  if (row.href?.includes("portfolio")) return "portfolio";
  if (row.href?.includes("client")) return "client";
  if (row.href?.includes("article")) return "article";
  return undefined;
}

async function seedSolutions() {
  const { rows } = await q(
    `SELECT s.*,
      COALESCE(
        jsonb_agg(
          jsonb_build_object('title', c.title, 'description', c.description, 'iconName', c.icon_name)
          ORDER BY c.sort_order
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::jsonb
      ) AS capabilities
     FROM cms_solutions s
     LEFT JOIN cms_solution_capabilities c ON c.solution_id = s.id
     GROUP BY s.id
     ORDER BY s.sort_order`,
  );

  for (const row of rows) {
    const image = await uploadAssetById(row.image_asset_id);
    await sanity.createIfNotExists({
      _id: stableId("solution", row.slug),
      _type: "solution",
      label: row.label,
      labelI18n: localized(row.label),
      slug: { _type: "slug", current: row.slug },
      tabId: row.tab_id,
      title: row.title,
      titleI18n: localized(row.title),
      description: row.description,
      descriptionI18n: localized(row.description),
      iconName: row.icon_name,
      image: imageField(image),
      capabilities: row.capabilities.map((capability, index) => ({
        _key: `${row.slug}-capability-${index}`,
        _type: "object",
        title: capability.title,
        titleI18n: localized(capability.title),
        description: capability.description,
        descriptionI18n: localized(capability.description),
        iconName: capability.iconName,
      })),
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedNavigation() {
  const { rows } = await q(
    "SELECT * FROM cms_navigation_items ORDER BY sort_order",
  );

  for (const row of rows) {
    await sanity.createIfNotExists({
      _id: stableId("navigationItem", `${row.menu_key}-${row.href}`),
      _type: "navigationItem",
      label: row.label,
      labelI18n: localized(row.label),
      href: row.href,
      group: mapNavigationGroup(row.menu_key),
      iconName: navigationIcon(row),
      openInNewTab: row.open_in_new_tab,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

try {
  const summary = {
    solutions: await seedSolutions(),
    navigation: await seedNavigation(),
  };
  console.log("Sanity solutions/navigation seed completed:", summary);
} finally {
  await pool.end();
}
