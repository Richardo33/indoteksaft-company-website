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
    const value = trimmed.slice(index + 1);
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

function clean(value) {
  if (value === undefined || value === null || value === "") return undefined;
  return value;
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
    uploadedAssets.set(media.slug, null);
    return null;
  }

  const existing = await sanity.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id,url}',
    { filename: path.basename(filePath) },
  );

  if (existing?._id) {
    uploadedAssets.set(media.slug, existing);
    return existing;
  }

  const asset = await sanity.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
    title: media.title,
    label: media.alt_text,
  });

  uploadedAssets.set(media.slug, asset);
  return asset;
}

async function uploadAssetById(id) {
  const media = await getAssetById(id);
  return uploadAsset(media);
}

async function createOrReplace(document) {
  return sanity.createOrReplace(
    JSON.parse(JSON.stringify(document, (_, value) => clean(value))),
  );
}

async function seedPages() {
  const pages = [
    ["home", "Home", "/"],
    ["products", "Products", "/products"],
    ["solutions", "Solutions", "/solutions"],
    ["industries", "Industries", "/industries"],
    ["resources", "Resources", "/resources"],
    ["company", "Company", "/company"],
    ["contact", "Contact", "/contact"],
  ];

  for (const [slug, title, routePath] of pages) {
    await createOrReplace({
      _id: stableId("sitePage", slug),
      _type: "sitePage",
      title,
      slug: { _type: "slug", current: slug },
      routePath,
      status: "published",
      sortOrder: pages.findIndex((page) => page[0] === slug),
    });
  }

  return pages.length;
}

async function seedBanners() {
  const { rows } = await q(
    `SELECT *
     FROM cms_banners
     ORDER BY page_slug, placement, sort_order`,
  );

  for (const row of rows) {
    const image = await uploadAssetById(row.image_asset_id);
    const background = await uploadAssetById(row.background_asset_id);
    await createOrReplace({
      _id: stableId("banner", `${row.page_slug}-${row.placement}`),
      _type: "banner",
      pageSlug: row.page_slug,
      placement: row.placement,
      eyebrow: row.eyebrow,
      eyebrowI18n: localized(row.eyebrow),
      title: row.title,
      titleI18n: localized(row.title),
      subtitle: row.subtitle,
      subtitleI18n: localized(row.subtitle),
      description: row.description,
      descriptionI18n: localized(row.description),
      image: imageField(image),
      backgroundImage: imageField(background),
      ctaLabel: row.cta_label,
      ctaLabelI18n: localized(row.cta_label),
      ctaHref: row.cta_href,
      secondaryCtaLabel: row.secondary_cta_label,
      secondaryCtaLabelI18n: localized(row.secondary_cta_label),
      secondaryCtaHref: row.secondary_cta_href,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedRotatingTerms() {
  const { rows } = await q(
    `SELECT *
     FROM cms_banner_rotating_terms
     ORDER BY page_slug, placement, locale, sort_order`,
  );

  for (const row of rows) {
    await createOrReplace({
      _id: stableId(
        "bannerRotatingTerm",
        `${row.page_slug}-${row.placement}-${row.locale}-${row.term}`,
      ),
      _type: "bannerRotatingTerm",
      pageSlug: row.page_slug,
      text: row.term,
      textI18n: localized(row.term),
      language: row.locale,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedMetrics() {
  const { rows } = await q(
    `SELECT *
     FROM cms_metrics
     ORDER BY page_slug, sort_order`,
  );

  for (const row of rows) {
    await createOrReplace({
      _id: stableId("metric", `${row.page_slug}-${row.metric_key}`),
      _type: "metric",
      pageSlug: row.page_slug,
      label: row.label,
      value: row.value,
      suffix: row.suffix,
      description: row.description,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedServiceCards() {
  const { rows } = await q(
    `SELECT sc.*,
      COALESCE(
        jsonb_agg(scp.label ORDER BY scp.sort_order)
          FILTER (WHERE scp.id IS NOT NULL),
        '[]'::jsonb
      ) AS points
     FROM cms_service_cards sc
     LEFT JOIN cms_service_card_points scp ON scp.service_card_id = sc.id
     GROUP BY sc.id
     ORDER BY sc.sort_order`,
  );

  for (const row of rows) {
    const image = await uploadAssetById(row.image_asset_id);
    await createOrReplace({
      _id: stableId("serviceCard", row.slug),
      _type: "serviceCard",
      title: row.title,
      slug: { _type: "slug", current: row.slug },
      description: row.description,
      iconName: row.icon_name,
      image: imageField(image),
      detailHref: row.href,
      points: row.points,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedProducts() {
  const { rows } = await q(
    `SELECT p.*,
      COALESCE(
        jsonb_agg(pp.title ORDER BY pp.sort_order)
          FILTER (WHERE pp.id IS NOT NULL AND pp.point_type = 'feature'),
        '[]'::jsonb
      ) AS features,
      COALESCE(
        jsonb_agg(pp.title ORDER BY pp.sort_order)
          FILTER (WHERE pp.id IS NOT NULL AND pp.point_type = 'benefit'),
        '[]'::jsonb
      ) AS benefits
     FROM cms_products p
     LEFT JOIN cms_product_points pp ON pp.product_id = p.id
     GROUP BY p.id
     ORDER BY p.sort_order`,
  );

  for (const row of rows) {
    const image = await uploadAssetById(row.image_asset_id);
    await createOrReplace({
      _id: stableId("product", row.slug),
      _type: "product",
      name: row.name,
      nameI18n: localized(row.name),
      slug: { _type: "slug", current: row.slug },
      shortName: row.short_name,
      shortNameI18n: localized(row.short_name),
      subtitle: row.subtitle,
      subtitleI18n: localized(row.subtitle),
      category: row.category,
      theme: row.theme,
      description: row.description,
      descriptionI18n: localized(row.description),
      image: imageField(image),
      brochureUrl: row.brochure_url,
      demoUrl: row.demo_url,
      isFeatured: row.is_featured,
      features: row.features,
      featuresI18n: localizedArray(row.features),
      benefits: row.benefits,
      benefitsI18n: localizedArray(row.benefits),
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedArticleCategories() {
  const { rows } = await q(
    "SELECT * FROM cms_article_categories ORDER BY sort_order, name",
  );

  for (const row of rows) {
    await createOrReplace({
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
    await createOrReplace({
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

async function seedIndustries() {
  const { rows } = await q("SELECT * FROM cms_industries ORDER BY sort_order");

  for (const row of rows) {
    const image = await uploadAssetById(row.image_asset_id);
    await createOrReplace({
      _id: stableId("industry", row.slug),
      _type: "industry",
      title: row.title,
      slug: { _type: "slug", current: row.slug },
      description: row.description,
      iconName: row.icon_name,
      image: imageField(image),
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedSolutions() {
  const { rows } = await q(
    `SELECT s.*,
      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'title', c.title,
            'description', c.description,
            'iconName', c.icon_name
          )
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
    await createOrReplace({
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

async function seedPortfolio() {
  const { rows } = await q(
    "SELECT * FROM cms_portfolio_projects ORDER BY sort_order",
  );

  for (const row of rows) {
    const image = await uploadAssetById(row.image_asset_id);
    await createOrReplace({
      _id: stableId("portfolioProject", row.slug),
      _type: "portfolioProject",
      title: row.title,
      titleI18n: localized(row.title),
      slug: { _type: "slug", current: row.slug },
      clientName: row.client_name,
      clientNameI18n: localized(row.client_name),
      category: row.category,
      categoryI18n: localized(row.category ?? "Client", row.category ?? "Klien"),
      summary: row.summary,
      summaryI18n: localized(row.summary),
      description: row.description,
      descriptionI18n: localized(row.description),
      outcome: row.outcome,
      outcomeI18n: localized(row.outcome),
      image: imageField(image),
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedClients() {
  const { rows } = await q("SELECT * FROM cms_clients ORDER BY sort_order");

  for (const row of rows) {
    const logo = await uploadAssetById(row.logo_asset_id);
    await createOrReplace({
      _id: stableId("client", row.slug),
      _type: "client",
      name: row.name,
      slug: { _type: "slug", current: row.slug },
      logo: imageField(logo),
      websiteUrl: row.website_url,
      category: row.category,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedCompany() {
  const statements = await q(
    "SELECT * FROM cms_company_statements ORDER BY sort_order",
  );
  const values = await q("SELECT * FROM cms_company_values ORDER BY sort_order");
  const leaders = await q(
    "SELECT * FROM cms_company_leaders ORDER BY sort_order",
  );

  for (const row of statements.rows) {
    await createOrReplace({
      _id: stableId("companyStatement", row.statement_type),
      _type: "companyStatement",
      key: row.statement_type,
      eyebrow: row.eyebrow,
      eyebrowI18n: localized(row.eyebrow),
      title: row.title,
      titleI18n: localized(row.title),
      description: row.description,
      descriptionI18n: localized(row.description),
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  for (const row of values.rows) {
    await createOrReplace({
      _id: stableId("companyValue", row.slug),
      _type: "companyValue",
      title: row.title,
      titleI18n: localized(row.title),
      description: row.description,
      descriptionI18n: localized(row.description),
      iconName: row.icon_name,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  for (const row of leaders.rows) {
    const photo = await uploadAssetById(row.image_asset_id);
    await createOrReplace({
      _id: stableId("companyLeader", row.slug),
      _type: "companyLeader",
      name: row.name,
      slug: { _type: "slug", current: row.slug },
      role: row.role,
      roleI18n: localized(row.role),
      bio: row.bio,
      bioI18n: localized(row.bio),
      photo: imageField(photo),
      linkedinUrl: row.linkedin_url,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return statements.rows.length + values.rows.length + leaders.rows.length;
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

async function seedNavigation() {
  const { rows } = await q("SELECT * FROM cms_navigation_items ORDER BY sort_order");

  for (const row of rows) {
    await createOrReplace({
      _id: stableId("navigationItem", `${row.menu_key}-${row.href}`),
      _type: "navigationItem",
      label: row.label,
      labelI18n: localized(row.label),
      href: row.href,
      group: mapNavigationGroup(row.menu_key),
      iconName: row.icon_name,
      openInNewTab: row.open_in_new_tab,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  return rows.length;
}

async function seedDocumentsAndSettings() {
  const documents = await q("SELECT * FROM cms_documents ORDER BY sort_order");
  const settings = await q("SELECT * FROM cms_site_settings ORDER BY key");

  for (const row of documents.rows) {
    await createOrReplace({
      _id: stableId("documentResource", row.slug),
      _type: "documentResource",
      title: row.title,
      slug: { _type: "slug", current: row.slug },
      description: row.description,
      documentType: row.document_type,
      fileUrl: row.file_url,
      status: row.status,
      sortOrder: row.sort_order,
    });
  }

  for (const row of settings.rows) {
    await createOrReplace({
      _id: stableId("siteSetting", row.key),
      _type: "siteSetting",
      key: row.key,
      description: row.description,
      value:
        typeof row.value === "string"
          ? row.value
          : JSON.stringify(
              row.key === "company_profile_download"
                ? {
                    href: row.value?.href ?? row.value?.fileUrl ?? "/resources/brosur",
                    label: "Download Company Profile",
                    description: "Full capabilities overview (PDF)",
                    dialogTitle: "Download Company Profile",
                    dialogDescription:
                      "Isi data singkat berikut agar tim sales kami dapat membantu follow-up kebutuhan perusahaan Anda.",
                    submitLabel: "Submit & Download",
                    message:
                      "Download Company Profile request. Please notify the sales team for follow-up.",
                    ...row.value,
                  }
                : row.value,
              null,
              2,
            ),
    });
  }

  return documents.rows.length + settings.rows.length;
}

async function main() {
  const steps = [
    ["pages", seedPages],
    ["banners", seedBanners],
    ["rotatingTerms", seedRotatingTerms],
    ["metrics", seedMetrics],
    ["serviceCards", seedServiceCards],
    ["products", seedProducts],
    ["articleCategories", seedArticleCategories],
    ["articles", seedArticles],
    ["industries", seedIndustries],
    ["solutions", seedSolutions],
    ["portfolio", seedPortfolio],
    ["clients", seedClients],
    ["company", seedCompany],
    ["navigation", seedNavigation],
    ["documentsAndSettings", seedDocumentsAndSettings],
  ];

  const summary = {};

  for (const [name, fn] of steps) {
    const count = await fn();
    summary[name] = count;
    console.log(`Seeded ${name}: ${count}`);
  }

  console.log("Sanity seed completed:", summary);
}

main()
  .catch((error) => {
    console.error("Sanity seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
