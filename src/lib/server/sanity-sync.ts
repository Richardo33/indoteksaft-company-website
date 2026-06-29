import "server-only";

import { getDbPool } from "@/lib/server/db";
import { logger } from "@/lib/server/logger";

type SanityDocument = Record<string, unknown> & {
  _id?: string;
  _type?: string;
  slug?: { current?: string } | string;
};

type ProductPoint = {
  point_type: "feature" | "benefit";
  title: string;
  sort_order: number;
};

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function booleanValue(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function slugValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (
    value &&
    typeof value === "object" &&
    "current" in value &&
    typeof value.current === "string" &&
    value.current.trim()
  ) {
    return value.current.trim();
  }

  return null;
}

function statusValue(document: SanityDocument): string {
  if (document._id?.startsWith("drafts.")) {
    return "draft";
  }

  const status = stringValue(document.status);
  return status ?? "published";
}

function isoDateOrNull(value: unknown): string | null {
  const text = stringValue(value);
  if (!text) {
    return null;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function sanityMetadata(document: SanityDocument) {
  return JSON.stringify({
    sanityId: document._id,
    sanityType: document._type,
    imageAssetRef: getAssetRef(document.image),
    backgroundAssetRef: getAssetRef(document.backgroundImage),
    coverImageAssetRef: getAssetRef(document.coverImage),
    logoAssetRef: getAssetRef(document.logo),
    fileAssetRef: getAssetRef(document.file),
  });
}

function getAssetRef(value: unknown): string | null {
  if (!value || typeof value !== "object" || !("asset" in value)) {
    return null;
  }

  const asset = value.asset;
  if (!asset || typeof asset !== "object" || !("_ref" in asset)) {
    return null;
  }

  return typeof asset._ref === "string" ? asset._ref : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => stringValue(item)).filter((item): item is string => Boolean(item))
    : [];
}

function objectArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
    : [];
}

async function upsertProduct(document: SanityDocument) {
  const slug = slugValue(document.slug);
  const name = stringValue(document.name);

  if (!slug || !name) {
    throw new Error("Sanity product requires slug and name.");
  }

  const pool = await getDbPool();
  const result = await pool.query<{ id: string }>(
    `
      INSERT INTO cms_products (
        slug, name, short_name, subtitle, description, theme, category,
        brochure_url, demo_url, status, is_featured, sort_order, metadata,
        published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, NOW())
      ON CONFLICT (slug)
      DO UPDATE SET
        name = EXCLUDED.name,
        short_name = EXCLUDED.short_name,
        subtitle = EXCLUDED.subtitle,
        description = EXCLUDED.description,
        theme = EXCLUDED.theme,
        category = EXCLUDED.category,
        brochure_url = EXCLUDED.brochure_url,
        demo_url = EXCLUDED.demo_url,
        status = EXCLUDED.status,
        is_featured = EXCLUDED.is_featured,
        sort_order = EXCLUDED.sort_order,
        metadata = EXCLUDED.metadata
      RETURNING id
    `,
    [
      slug,
      name,
      stringValue(document.shortName),
      stringValue(document.subtitle),
      stringValue(document.description) ?? "",
      stringValue(document.theme),
      stringValue(document.category),
      stringValue(document.brochureUrl),
      stringValue(document.demoUrl),
      statusValue(document),
      booleanValue(document.isFeatured),
      numberValue(document.sortOrder),
      sanityMetadata(document),
    ],
  );

  const productId = result.rows[0]?.id;
  if (!productId) {
    return;
  }

  await pool.query("DELETE FROM cms_product_points WHERE product_id = $1", [
    productId,
  ]);

  const points: ProductPoint[] = [
    ...stringArray(document.features).map((title, index) => ({
      point_type: "feature" as const,
      title,
      sort_order: index,
    })),
    ...stringArray(document.benefits).map((title, index) => ({
      point_type: "benefit" as const,
      title,
      sort_order: index,
    })),
  ];

  for (const point of points) {
    await pool.query(
      `
        INSERT INTO cms_product_points (product_id, point_type, title, sort_order)
        VALUES ($1, $2, $3, $4)
      `,
      [productId, point.point_type, point.title, point.sort_order],
    );
  }
}

async function upsertArticle(document: SanityDocument) {
  const slug = slugValue(document.slug);
  const title = stringValue(document.title);

  if (!slug || !title) {
    throw new Error("Sanity article requires slug and title.");
  }

  const pool = await getDbPool();
  const result = await pool.query<{ id: string }>(
    `
      INSERT INTO cms_articles (
        slug, category_name, title, excerpt, read_time, cover_image_url,
        seo_title, seo_description, status, is_featured, published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11::timestamptz, NOW()))
      ON CONFLICT (slug)
      DO UPDATE SET
        category_name = EXCLUDED.category_name,
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        read_time = EXCLUDED.read_time,
        cover_image_url = EXCLUDED.cover_image_url,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description,
        status = EXCLUDED.status,
        is_featured = EXCLUDED.is_featured,
        published_at = EXCLUDED.published_at
      RETURNING id
    `,
    [
      slug,
      stringValue(document.categoryName),
      title,
      stringValue(document.excerpt) ?? "",
      stringValue(document.readTime),
      null,
      stringValue(document.seoTitle),
      stringValue(document.seoDescription),
      statusValue(document),
      booleanValue(document.isFeatured),
      isoDateOrNull(document.publishedAt),
    ],
  );

  const articleId = result.rows[0]?.id;
  if (!articleId) {
    return;
  }

  await pool.query("DELETE FROM cms_article_sections WHERE article_id = $1", [
    articleId,
  ]);

  for (const [index, section] of objectArray(document.sections).entries()) {
    await pool.query(
      `
        INSERT INTO cms_article_sections (article_id, heading, body, sort_order)
        VALUES ($1, $2, $3::jsonb, $4)
      `,
      [
        articleId,
        stringValue(section.heading) ?? "Untitled Section",
        JSON.stringify(stringArray(section.body)),
        index,
      ],
    );
  }
}

async function upsertSimpleDocument(document: SanityDocument) {
  const type = document._type;
  const slug = slugValue(document.slug);

  if (!type || !slug) {
    throw new Error("Sanity document requires _type and slug.");
  }

  const pool = await getDbPool();

  if (type === "banner") {
    await pool.query(
      `
        INSERT INTO cms_banners (
          page_slug, placement, eyebrow, title, subtitle, description,
          cta_label, cta_href, secondary_cta_label, secondary_cta_href,
          starts_at, ends_at, status, sort_order, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::timestamptz, $12::timestamptz, $13, $14, $15::jsonb)
      `,
      [
        stringValue(document.pageSlug),
        stringValue(document.placement) ?? "hero",
        stringValue(document.eyebrow),
        stringValue(document.title) ?? "Untitled Banner",
        stringValue(document.subtitle),
        stringValue(document.description),
        stringValue(document.ctaLabel),
        stringValue(document.ctaHref),
        stringValue(document.secondaryCtaLabel),
        stringValue(document.secondaryCtaHref),
        isoDateOrNull(document.startsAt),
        isoDateOrNull(document.endsAt),
        statusValue(document),
        numberValue(document.sortOrder),
        sanityMetadata(document),
      ],
    );
    return;
  }

  const tableMap = {
    portfolioProject: "cms_portfolio_projects",
    client: "cms_clients",
    industry: "cms_industries",
    event: "cms_events",
    documentResource: "cms_documents",
  } as const;

  const table = tableMap[type as keyof typeof tableMap];
  if (!table) {
    logger.info("sanity_sync.ignored_type", { type });
    return;
  }

  if (type === "client") {
    await pool.query(
      `
        INSERT INTO cms_clients (slug, name, website_url, category, status, sort_order, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
        ON CONFLICT (slug)
        DO UPDATE SET
          name = EXCLUDED.name,
          website_url = EXCLUDED.website_url,
          category = EXCLUDED.category,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          metadata = EXCLUDED.metadata
      `,
      [
        slug,
        stringValue(document.name) ?? "Untitled Client",
        stringValue(document.websiteUrl),
        stringValue(document.category),
        statusValue(document),
        numberValue(document.sortOrder),
        sanityMetadata(document),
      ],
    );
    return;
  }

  if (type === "portfolioProject") {
    await pool.query(
      `
        INSERT INTO cms_portfolio_projects (
          slug, title, client_name, category, summary, description, outcome,
          status, sort_order, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
        ON CONFLICT (slug)
        DO UPDATE SET
          title = EXCLUDED.title,
          client_name = EXCLUDED.client_name,
          category = EXCLUDED.category,
          summary = EXCLUDED.summary,
          description = EXCLUDED.description,
          outcome = EXCLUDED.outcome,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          metadata = EXCLUDED.metadata
      `,
      [
        slug,
        stringValue(document.title) ?? "Untitled Project",
        stringValue(document.clientName) ?? "Unknown Client",
        stringValue(document.category),
        stringValue(document.summary),
        stringValue(document.description),
        stringValue(document.outcome),
        statusValue(document),
        numberValue(document.sortOrder),
        sanityMetadata(document),
      ],
    );
    return;
  }

  if (type === "industry") {
    await pool.query(
      `
        INSERT INTO cms_industries (slug, title, description, icon_name, status, sort_order, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
        ON CONFLICT (slug)
        DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          icon_name = EXCLUDED.icon_name,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          metadata = EXCLUDED.metadata
      `,
      [
        slug,
        stringValue(document.title) ?? "Untitled Industry",
        stringValue(document.description) ?? "",
        stringValue(document.iconName),
        statusValue(document),
        numberValue(document.sortOrder),
        sanityMetadata(document),
      ],
    );
    return;
  }

  if (type === "event") {
    await pool.query(
      `
        INSERT INTO cms_events (
          slug, title, description, event_date, location, registration_url,
          status, sort_order, metadata
        )
        VALUES ($1, $2, $3, $4::timestamptz, $5, $6, $7, $8, $9::jsonb)
        ON CONFLICT (slug)
        DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          event_date = EXCLUDED.event_date,
          location = EXCLUDED.location,
          registration_url = EXCLUDED.registration_url,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          metadata = EXCLUDED.metadata
      `,
      [
        slug,
        stringValue(document.title) ?? "Untitled Event",
        stringValue(document.description),
        isoDateOrNull(document.eventDate),
        stringValue(document.location),
        stringValue(document.registrationUrl),
        statusValue(document),
        numberValue(document.sortOrder),
        sanityMetadata(document),
      ],
    );
    return;
  }

  if (type === "documentResource") {
    await pool.query(
      `
        INSERT INTO cms_documents (
          slug, title, description, document_type, file_url,
          status, sort_order, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
        ON CONFLICT (slug)
        DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          document_type = EXCLUDED.document_type,
          file_url = EXCLUDED.file_url,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          metadata = EXCLUDED.metadata
      `,
      [
        slug,
        stringValue(document.title) ?? "Untitled Document",
        stringValue(document.description),
        stringValue(document.documentType) ?? "brochure",
        stringValue(document.fileUrl),
        statusValue(document),
        numberValue(document.sortOrder),
        sanityMetadata(document),
      ],
    );
  }
}

async function upsertSolution(document: SanityDocument) {
  const slug = slugValue(document.slug);
  const label = stringValue(document.label);
  const title = stringValue(document.title);

  if (!slug || !label || !title) {
    throw new Error("Sanity solution requires slug, label, and title.");
  }

  const pool = await getDbPool();
  const result = await pool.query<{ id: string }>(
    `
      INSERT INTO cms_solutions (
        slug, tab_id, label, title, description, icon_name,
        status, sort_order, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
      ON CONFLICT (slug)
      DO UPDATE SET
        tab_id = EXCLUDED.tab_id,
        label = EXCLUDED.label,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        icon_name = EXCLUDED.icon_name,
        status = EXCLUDED.status,
        sort_order = EXCLUDED.sort_order,
        metadata = EXCLUDED.metadata
      RETURNING id
    `,
    [
      slug,
      stringValue(document.tabId),
      label,
      title,
      stringValue(document.description) ?? "",
      stringValue(document.iconName),
      statusValue(document),
      numberValue(document.sortOrder),
      sanityMetadata(document),
    ],
  );

  const solutionId = result.rows[0]?.id;
  if (!solutionId) {
    return;
  }

  await pool.query(
    "DELETE FROM cms_solution_capabilities WHERE solution_id = $1",
    [solutionId],
  );

  for (const [index, capability] of objectArray(document.capabilities).entries()) {
    await pool.query(
      `
        INSERT INTO cms_solution_capabilities (
          solution_id, title, description, icon_name, sort_order
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        solutionId,
        stringValue(capability.title) ?? "Untitled Capability",
        stringValue(capability.description) ?? "",
        stringValue(capability.iconName),
        index,
      ],
    );
  }
}

export async function syncSanityDocument(document: SanityDocument) {
  switch (document._type) {
    case "product":
      await upsertProduct(document);
      break;
    case "article":
      await upsertArticle(document);
      break;
    case "solution":
      await upsertSolution(document);
      break;
    case "banner":
    case "portfolioProject":
    case "client":
    case "industry":
    case "event":
    case "documentResource":
      await upsertSimpleDocument(document);
      break;
    default:
      logger.info("sanity_sync.ignored_type", { type: document._type });
      break;
  }
}
