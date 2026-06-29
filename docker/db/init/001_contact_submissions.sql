-- ============================================================
-- Indoteksaft Company Website - Local PostgreSQL Schema
-- ============================================================
-- Cara pakai di DBeaver:
-- 1. Buat database PostgreSQL lokal, misalnya: indoteksaft_company
-- 2. Connect ke database tersebut lewat DBeaver
-- 3. Buka SQL Editor, paste/run seluruh script ini
--
-- Catatan:
-- - Script ini idempotent: aman dijalankan ulang.
-- - App saat ini baru menulis ke public.contact_submissions.
-- - Tabel CMS di bawah disiapkan untuk tahap berikutnya ketika data constants
--   seperti products, articles, partners, banners, portfolio, dan events
--   dipindahkan ke CMS/database.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1) Contact submissions
-- ------------------------------------------------------------
-- Menyimpan semua inquiry dari form website:
-- - homepage free consultation
-- - halaman contact sales
-- - form pada halaman products/solutions/industries/company
--
-- request_id berasal dari API Next.js dan berguna untuk tracing log.
-- message_text menyimpan input asli user.
-- message_html menyimpan hasil format untuk email/webhook.
-- message_lines menyimpan array baris agar format enter/list tetap bisa diproses ulang.

CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL UNIQUE,

    full_name VARCHAR(80) NOT NULL,
    company_name VARCHAR(120) NOT NULL,
    position VARCHAR(100),
    email VARCHAR(160) NOT NULL,
    phone VARCHAR(30),
    interest VARCHAR(80) NOT NULL,

    message_text TEXT NOT NULL,
    message_html TEXT NOT NULL,
    message_lines JSONB NOT NULL DEFAULT '[]'::jsonb,

    source VARCHAR(80) NOT NULL DEFAULT 'website_contact_form',
    status VARCHAR(40) NOT NULL DEFAULT 'new',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT contact_submissions_status_check
      CHECK (status IN ('new', 'reviewed', 'contacted', 'qualified', 'closed', 'spam')),

    CONSTRAINT contact_submissions_email_lowercase_check
      CHECK (email = lower(email)),

    CONSTRAINT contact_submissions_message_lines_array_check
      CHECK (jsonb_typeof(message_lines) = 'array'),

    CONSTRAINT contact_submissions_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
    ON public.contact_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created_at
    ON public.contact_submissions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email
    ON public.contact_submissions (email);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_interest
    ON public.contact_submissions (interest);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_company_name
    ON public.contact_submissions (company_name);

-- ------------------------------------------------------------
-- 2) Updated-at trigger
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contact_submissions_updated_at
    ON public.contact_submissions;

CREATE TRIGGER trg_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 3) Optional interaction events
-- ------------------------------------------------------------
-- Untuk kebutuhan tracking sederhana ke depan, misalnya:
-- - klik Download Company Profile
-- - klik Request Assessment
-- - klik WhatsApp
-- - klik Brosur/Event
--
-- Saat ini app belum menulis ke tabel ini, tapi strukturnya disiapkan
-- supaya nanti tinggal tambah endpoint/event tracking tanpa redesign DB.

CREATE TABLE IF NOT EXISTS public.website_interaction_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(120) NOT NULL,
    page_path VARCHAR(240),
    label VARCHAR(160),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT website_interaction_events_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_website_interaction_events_created_at
    ON public.website_interaction_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_website_interaction_events_event_name
    ON public.website_interaction_events (event_name);

-- ------------------------------------------------------------
-- 4) CMS foundation tables
-- ------------------------------------------------------------
-- Bagian ini untuk konten yang nanti bisa berubah dari CMS:
-- - hero/banner halaman
-- - products dan detail product
-- - articles/blog
-- - portfolio project
-- - client/partner logo
-- - industries
-- - solutions
-- - event
-- - dokumen/brosur/company profile
--
-- App belum otomatis membaca tabel-tabel ini sekarang. Tujuannya adalah
-- menyiapkan database yang masuk akal sebelum nanti kita bikin CMS/API admin.

CREATE TABLE IF NOT EXISTS public.cms_media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(160) UNIQUE NOT NULL,
    title VARCHAR(180) NOT NULL,
    alt_text VARCHAR(220),
    file_url TEXT NOT NULL,
    mime_type VARCHAR(120),
    file_size_bytes INTEGER,
    width INTEGER,
    height INTEGER,
    category VARCHAR(80) NOT NULL DEFAULT 'general',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_media_assets_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_media_assets_category
    ON public.cms_media_assets (category);

CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(160) UNIQUE NOT NULL,
    title VARCHAR(180) NOT NULL,
    route_path VARCHAR(220) UNIQUE NOT NULL,
    seo_title VARCHAR(180),
    seo_description TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_pages_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_pages_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_pages_status_sort_order
    ON public.cms_pages (status, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug VARCHAR(160),
    placement VARCHAR(80) NOT NULL DEFAULT 'hero',
    title VARCHAR(220) NOT NULL,
    subtitle VARCHAR(260),
    description TEXT,
    eyebrow VARCHAR(120),
    image_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    background_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    cta_label VARCHAR(120),
    cta_href TEXT,
    secondary_cta_label VARCHAR(120),
    secondary_cta_href TEXT,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_banners_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_banners_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_banners_page_placement_status
    ON public.cms_banners (page_slug, placement, status, sort_order);

CREATE INDEX IF NOT EXISTS idx_cms_banners_schedule
    ON public.cms_banners (starts_at, ends_at);

CREATE TABLE IF NOT EXISTS public.cms_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) UNIQUE NOT NULL,
    name VARCHAR(220) NOT NULL,
    short_name VARCHAR(180),
    subtitle VARCHAR(220),
    description TEXT NOT NULL,
    theme VARCHAR(80),
    category VARCHAR(120),
    image_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    brochure_url TEXT,
    demo_url TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_products_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_products_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_products_status_sort_order
    ON public.cms_products (status, sort_order);

CREATE INDEX IF NOT EXISTS idx_cms_products_category
    ON public.cms_products (category);

CREATE TABLE IF NOT EXISTS public.cms_product_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.cms_products(id) ON DELETE CASCADE,
    point_type VARCHAR(40) NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_product_points_type_check
      CHECK (point_type IN ('feature', 'benefit'))
);

CREATE INDEX IF NOT EXISTS idx_cms_product_points_product_type_sort
    ON public.cms_product_points (product_id, point_type, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_article_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(140) UNIQUE NOT NULL,
    name VARCHAR(140) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cms_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) UNIQUE NOT NULL,
    category_id UUID REFERENCES public.cms_article_categories(id) ON DELETE SET NULL,
    category_name VARCHAR(140),
    title VARCHAR(260) NOT NULL,
    excerpt TEXT NOT NULL,
    read_time VARCHAR(40),
    image_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    cover_image_url TEXT,
    seo_title VARCHAR(180),
    seo_description TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_articles_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_articles_publish_required_check
      CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_cms_articles_status_published_at
    ON public.cms_articles (status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_cms_articles_category_id
    ON public.cms_articles (category_id);

CREATE TABLE IF NOT EXISTS public.cms_article_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.cms_articles(id) ON DELETE CASCADE,
    heading VARCHAR(220) NOT NULL,
    body JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_article_sections_body_array_check
      CHECK (jsonb_typeof(body) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_cms_article_sections_article_sort
    ON public.cms_article_sections (article_id, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) UNIQUE NOT NULL,
    title VARCHAR(220) NOT NULL,
    client_name VARCHAR(220) NOT NULL,
    category VARCHAR(140),
    summary TEXT,
    description TEXT,
    outcome TEXT,
    image_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    image_url TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_portfolio_projects_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_portfolio_projects_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_portfolio_projects_status_sort
    ON public.cms_portfolio_projects (status, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) UNIQUE NOT NULL,
    name VARCHAR(220) NOT NULL,
    logo_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    logo_url TEXT,
    website_url TEXT,
    category VARCHAR(120),
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_clients_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_clients_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_clients_status_sort
    ON public.cms_clients (status, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(160) UNIQUE NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(80),
    image_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_industries_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_industries_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_industries_status_sort
    ON public.cms_industries (status, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(160) UNIQUE NOT NULL,
    tab_id VARCHAR(80) UNIQUE,
    label VARCHAR(140) NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(80),
    image_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_solutions_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_solutions_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_solutions_status_sort
    ON public.cms_solutions (status, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_solution_capabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solution_id UUID NOT NULL REFERENCES public.cms_solutions(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(80),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_solution_capabilities_solution_sort
    ON public.cms_solution_capabilities (solution_id, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) UNIQUE NOT NULL,
    title VARCHAR(220) NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ,
    location VARCHAR(220),
    registration_url TEXT,
    image_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'draft',
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_events_status_check
      CHECK (status IN ('draft', 'published', 'archived', 'completed')),
    CONSTRAINT cms_events_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_events_status_event_date
    ON public.cms_events (status, event_date DESC);

CREATE TABLE IF NOT EXISTS public.cms_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) UNIQUE NOT NULL,
    title VARCHAR(220) NOT NULL,
    description TEXT,
    document_type VARCHAR(80) NOT NULL DEFAULT 'brochure',
    file_asset_id UUID REFERENCES public.cms_media_assets(id) ON DELETE SET NULL,
    file_url TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_documents_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_documents_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_documents_type_status_sort
    ON public.cms_documents (document_type, status, sort_order);

CREATE TABLE IF NOT EXISTS public.cms_site_settings (
    key VARCHAR(120) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_site_settings_value_object_check
      CHECK (jsonb_typeof(value) IN ('object', 'array', 'string', 'number', 'boolean'))
);

CREATE TABLE IF NOT EXISTS public.cms_navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_key VARCHAR(80) NOT NULL,
    label VARCHAR(120) NOT NULL,
    href TEXT NOT NULL,
    parent_id UUID REFERENCES public.cms_navigation_items(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL DEFAULT 'published',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cms_navigation_items_status_check
      CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT cms_navigation_items_metadata_object_check
      CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_cms_navigation_items_menu_sort
    ON public.cms_navigation_items (menu_key, status, sort_order);

-- Updated-at triggers untuk tabel CMS yang punya updated_at.

DROP TRIGGER IF EXISTS trg_cms_media_assets_updated_at ON public.cms_media_assets;
CREATE TRIGGER trg_cms_media_assets_updated_at
BEFORE UPDATE ON public.cms_media_assets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_pages_updated_at ON public.cms_pages;
CREATE TRIGGER trg_cms_pages_updated_at
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_banners_updated_at ON public.cms_banners;
CREATE TRIGGER trg_cms_banners_updated_at
BEFORE UPDATE ON public.cms_banners
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_products_updated_at ON public.cms_products;
CREATE TRIGGER trg_cms_products_updated_at
BEFORE UPDATE ON public.cms_products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_product_points_updated_at ON public.cms_product_points;
CREATE TRIGGER trg_cms_product_points_updated_at
BEFORE UPDATE ON public.cms_product_points
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_article_categories_updated_at ON public.cms_article_categories;
CREATE TRIGGER trg_cms_article_categories_updated_at
BEFORE UPDATE ON public.cms_article_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_articles_updated_at ON public.cms_articles;
CREATE TRIGGER trg_cms_articles_updated_at
BEFORE UPDATE ON public.cms_articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_article_sections_updated_at ON public.cms_article_sections;
CREATE TRIGGER trg_cms_article_sections_updated_at
BEFORE UPDATE ON public.cms_article_sections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_portfolio_projects_updated_at ON public.cms_portfolio_projects;
CREATE TRIGGER trg_cms_portfolio_projects_updated_at
BEFORE UPDATE ON public.cms_portfolio_projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_clients_updated_at ON public.cms_clients;
CREATE TRIGGER trg_cms_clients_updated_at
BEFORE UPDATE ON public.cms_clients
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_industries_updated_at ON public.cms_industries;
CREATE TRIGGER trg_cms_industries_updated_at
BEFORE UPDATE ON public.cms_industries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_solutions_updated_at ON public.cms_solutions;
CREATE TRIGGER trg_cms_solutions_updated_at
BEFORE UPDATE ON public.cms_solutions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_solution_capabilities_updated_at ON public.cms_solution_capabilities;
CREATE TRIGGER trg_cms_solution_capabilities_updated_at
BEFORE UPDATE ON public.cms_solution_capabilities
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_events_updated_at ON public.cms_events;
CREATE TRIGGER trg_cms_events_updated_at
BEFORE UPDATE ON public.cms_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_documents_updated_at ON public.cms_documents;
CREATE TRIGGER trg_cms_documents_updated_at
BEFORE UPDATE ON public.cms_documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_site_settings_updated_at ON public.cms_site_settings;
CREATE TRIGGER trg_cms_site_settings_updated_at
BEFORE UPDATE ON public.cms_site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_navigation_items_updated_at ON public.cms_navigation_items;
CREATE TRIGGER trg_cms_navigation_items_updated_at
BEFORE UPDATE ON public.cms_navigation_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 5) Useful DBeaver views
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW public.v_contact_submissions_latest AS
SELECT
    id,
    request_id,
    created_at,
    status,
    full_name,
    company_name,
    position,
    email,
    phone,
    interest,
    source,
    left(message_text, 220) AS message_preview
FROM public.contact_submissions
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.v_contact_submissions_daily_summary AS
SELECT
    date_trunc('day', created_at)::date AS submission_date,
    status,
    interest,
    count(*) AS total
FROM public.contact_submissions
GROUP BY date_trunc('day', created_at)::date, status, interest
ORDER BY submission_date DESC, total DESC;

CREATE OR REPLACE VIEW public.v_cms_published_products AS
SELECT
    p.id,
    p.slug,
    p.name,
    p.short_name,
    p.subtitle,
    p.category,
    p.theme,
    p.is_featured,
    p.sort_order,
    p.published_at,
    m.file_url AS image_url
FROM public.cms_products p
LEFT JOIN public.cms_media_assets m ON m.id = p.image_asset_id
WHERE p.status = 'published'
ORDER BY p.sort_order, p.name;

CREATE OR REPLACE VIEW public.v_cms_published_articles AS
SELECT
    a.id,
    a.slug,
    COALESCE(c.name, a.category_name) AS category,
    a.title,
    a.excerpt,
    a.read_time,
    a.is_featured,
    a.published_at,
    COALESCE(m.file_url, a.cover_image_url) AS image_url
FROM public.cms_articles a
LEFT JOIN public.cms_article_categories c ON c.id = a.category_id
LEFT JOIN public.cms_media_assets m ON m.id = a.image_asset_id
WHERE a.status = 'published'
ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC;

CREATE OR REPLACE VIEW public.v_cms_active_banners AS
SELECT
    b.id,
    b.page_slug,
    b.placement,
    b.eyebrow,
    b.title,
    b.subtitle,
    b.description,
    b.cta_label,
    b.cta_href,
    b.secondary_cta_label,
    b.secondary_cta_href,
    COALESCE(bg.file_url, image.file_url) AS visual_url,
    b.sort_order
FROM public.cms_banners b
LEFT JOIN public.cms_media_assets image ON image.id = b.image_asset_id
LEFT JOIN public.cms_media_assets bg ON bg.id = b.background_asset_id
WHERE b.status = 'published'
  AND (b.starts_at IS NULL OR b.starts_at <= NOW())
  AND (b.ends_at IS NULL OR b.ends_at >= NOW())
ORDER BY b.page_slug, b.placement, b.sort_order;

-- ------------------------------------------------------------
-- 6) Smoke-test query
-- ------------------------------------------------------------
-- Jalankan query ini setelah script selesai untuk memastikan tabel ada.

SELECT
    'company website schema ready' AS check_name,
    (SELECT count(*) FROM public.contact_submissions) AS contact_rows,
    (SELECT count(*) FROM public.cms_products) AS product_rows,
    (SELECT count(*) FROM public.cms_articles) AS article_rows,
    (SELECT count(*) FROM public.cms_clients) AS client_rows,
    (SELECT count(*) FROM public.cms_banners) AS banner_rows;
