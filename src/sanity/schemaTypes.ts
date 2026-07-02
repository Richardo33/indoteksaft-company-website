import { defineArrayMember, defineField, defineType } from "sanity";

const statusField = defineField({
  name: "status",
  title: "Status",
  type: "string",
  initialValue: "published",
  options: {
    list: [
      { title: "Draft", value: "draft" },
      { title: "Published", value: "published" },
      { title: "Archived", value: "archived" },
    ],
    layout: "radio",
  },
  validation: (Rule) => Rule.required(),
});

const sortOrderField = defineField({
  name: "sortOrder",
  title: "Sort Order",
  type: "number",
  initialValue: 0,
});

const seoFields = [
  defineField({
    name: "seoTitle",
    title: "SEO Title",
    type: "string",
    validation: (Rule) => Rule.max(180),
  }),
  defineField({
    name: "seoDescription",
    title: "SEO Description",
    type: "text",
    rows: 3,
  }),
];

const localizedStringField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "string" }),
      defineField({ name: "id", title: "Indonesia", type: "string" }),
    ],
  });

const localizedTextField = (name: string, title: string, rows = 4) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "text", rows }),
      defineField({ name: "id", title: "Indonesia", type: "text", rows }),
    ],
  });

const localizedStringArrayField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "en", title: "English", type: "string" }),
          defineField({ name: "id", title: "Indonesia", type: "string" }),
        ],
        preview: {
          select: { title: "en", subtitle: "id" },
        },
      }),
    ],
  });

const backgroundBannerPages = ["home", "company"];
const splitImageBannerPages = ["products", "industries"];

function getBannerPageSlug(document: unknown) {
  if (!document || typeof document !== "object") {
    return "";
  }

  const pageSlug = (document as { pageSlug?: unknown }).pageSlug;
  return typeof pageSlug === "string" ? pageSlug : "";
}

function shouldUseBannerBackgroundImage(document: unknown) {
  return backgroundBannerPages.includes(getBannerPageSlug(document));
}

function shouldUseBannerImage(document: unknown) {
  return splitImageBannerPages.includes(getBannerPageSlug(document));
}

export const schemaTypes = [
  defineType({
    name: "sitePage",
    title: "Pages",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "routePath", title: "Route Path", type: "string", validation: (Rule) => Rule.required() }),
      ...seoFields,
      statusField,
      sortOrderField,
      defineField({ name: "metadata", title: "Metadata", type: "object", fields: [{ name: "notes", title: "Notes", type: "text" }] }),
    ],
    preview: {
      select: { title: "title", subtitle: "routePath" },
    },
  }),

  defineType({
    name: "banner",
    title: "Banners",
    type: "document",
    fields: [
      defineField({ name: "pageSlug", title: "Page Slug", type: "string", description: "Contoh: home, products, company, contact" }),
      defineField({ name: "placement", title: "Placement", type: "string", initialValue: "hero" }),
      defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
      localizedStringField("eyebrowI18n", "Eyebrow Bilingual"),
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
      localizedStringField("subtitleI18n", "Subtitle Bilingual"),
      defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
      localizedTextField("descriptionI18n", "Description Bilingual", 4),
      defineField({
        name: "image",
        title: "Banner Side Image",
        description:
          "Dipakai untuk banner split layout seperti Products dan Industries. Tidak dipakai untuk Home/Company hero.",
        type: "image",
        options: { hotspot: true },
        hidden: ({ document }) => !shouldUseBannerImage(document),
      }),
      defineField({
        name: "backgroundImage",
        title: "Hero Background Image",
        description:
          "Dipakai untuk banner full-background seperti Home dan Company. Tidak dipakai untuk Products/Industries split banner.",
        type: "image",
        options: { hotspot: true },
        hidden: ({ document }) => !shouldUseBannerBackgroundImage(document),
      }),
      defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
      localizedStringField("ctaLabelI18n", "CTA Label Bilingual"),
      defineField({ name: "ctaHref", title: "CTA URL", type: "string" }),
      defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string" }),
      localizedStringField("secondaryCtaLabelI18n", "Secondary CTA Label Bilingual"),
      defineField({ name: "secondaryCtaHref", title: "Secondary CTA URL", type: "string" }),
      defineField({ name: "startsAt", title: "Starts At", type: "datetime" }),
      defineField({ name: "endsAt", title: "Ends At", type: "datetime" }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: {
        title: "title",
        subtitle: "pageSlug",
        image: "image",
        backgroundImage: "backgroundImage",
      },
      prepare({ title, subtitle, image, backgroundImage }) {
        return {
          title,
          subtitle,
          media: backgroundImage || image,
        };
      },
    },
  }),

  defineType({
    name: "bannerRotatingTerm",
    title: "Hero Rotating Terms",
    type: "document",
    fields: [
      defineField({ name: "pageSlug", title: "Page Slug", type: "string", initialValue: "home" }),
      defineField({
        name: "text",
        title: "Legacy Text",
        type: "string",
        readOnly: true,
        hidden: true,
      }),
      localizedStringField("textI18n", "Text Bilingual"),
      defineField({
        name: "language",
        title: "Legacy Language",
        type: "string",
        initialValue: "en",
        readOnly: true,
        hidden: true,
      }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "textI18n.en", subtitle: "textI18n.id" },
      prepare({ title, subtitle }) {
        return {
          title: title || subtitle || "Hero rotating term",
          subtitle: subtitle ? `ID: ${subtitle}` : "Indonesia translation empty",
        };
      },
    },
  }),

  defineType({
    name: "metric",
    title: "Homepage Metrics",
    type: "document",
    fields: [
      defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "suffix", title: "Suffix", type: "string" }),
      defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      defineField({ name: "pageSlug", title: "Page Slug", type: "string", initialValue: "home" }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "label", subtitle: "value" },
    },
  }),

  defineType({
    name: "serviceCard",
    title: "Homepage Service Cards",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
      defineField({ name: "iconName", title: "Icon Name", type: "string" }),
      defineField({
        name: "image",
        title: "Service Card Image",
        description: "Gambar ini tampil pada kartu What We Do di homepage.",
        type: "image",
        options: { hotspot: true },
      }),
      defineField({ name: "detailHref", title: "Detail URL", type: "string" }),
      defineField({
        name: "points",
        title: "Points",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
      }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "title", media: "image" },
    },
  }),

  defineType({
    name: "homeContactSection",
    title: "Homepage Contact Section",
    type: "document",
    fields: [
      defineField({
        name: "eyebrow",
        title: "Eyebrow",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      localizedStringField("eyebrowI18n", "Eyebrow Bilingual"),
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        rows: 3,
        validation: (Rule) => Rule.required(),
      }),
      localizedTextField("descriptionI18n", "Description Bilingual", 3),
      defineField({
        name: "details",
        title: "Left Side Details",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "label",
                title: "Label",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              localizedStringField("labelI18n", "Label Bilingual"),
              defineField({
                name: "value",
                title: "Value",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              localizedStringField("valueI18n", "Value Bilingual"),
              defineField({
                name: "href",
                title: "URL",
                type: "string",
              }),
              defineField({
                name: "iconName",
                title: "Icon Name",
                type: "string",
                options: {
                  list: [
                    { title: "Email", value: "email" },
                    { title: "Location", value: "location" },
                    { title: "Download", value: "download" },
                    { title: "Assessment", value: "assessment" },
                  ],
                },
              }),
            ],
            preview: {
              select: { title: "label", subtitle: "value" },
            },
          }),
        ],
      }),
      statusField,
    ],
    preview: {
      select: { title: "title", subtitle: "eyebrow" },
    },
  }),

  defineType({
    name: "product",
    title: "Products",
    type: "document",
    fields: [
      defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("nameI18n", "Name Bilingual"),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "shortName", title: "Short Name", type: "string" }),
      localizedStringField("shortNameI18n", "Short Name Bilingual"),
      defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
      localizedStringField("subtitleI18n", "Subtitle Bilingual"),
      defineField({ name: "category", title: "Category", type: "string" }),
      defineField({
        name: "theme",
        title: "Mockup Theme",
        type: "string",
        options: {
          list: ["dashboard", "map", "workflow", "monitoring", "analytics", "iot", "security", "noc", "finance"],
        },
      }),
      defineField({ name: "description", title: "Description", type: "text", rows: 5, validation: (Rule) => Rule.required() }),
      localizedTextField("descriptionI18n", "Description Bilingual", 5),
      defineField({
        name: "image",
        title: "Product Screen Image (Laptop Display)",
        description: "Gambar ini akan tampil di layar laptop pada card/list/detail product.",
        type: "image",
        options: { hotspot: true },
      }),
      defineField({ name: "brochureUrl", title: "Brochure URL", type: "string" }),
      defineField({ name: "demoUrl", title: "Demo URL", type: "string" }),
      defineField({ name: "isFeatured", title: "Featured", type: "boolean", initialValue: false }),
      defineField({
        name: "features",
        title: "Features",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
      }),
      localizedStringArrayField("featuresI18n", "Features Bilingual"),
      defineField({
        name: "benefits",
        title: "Benefits",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
      }),
      localizedStringArrayField("benefitsI18n", "Benefits Bilingual"),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "name", subtitle: "category", media: "image" },
    },
  }),

  defineType({
    name: "articleCategory",
    title: "Article Categories",
    type: "document",
    fields: [
      defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("nameI18n", "Name Bilingual"),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      localizedTextField("descriptionI18n", "Description Bilingual", 3),
      sortOrderField,
    ],
  }),

  defineType({
    name: "article",
    title: "Articles",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "articleCategory" }] }),
      defineField({ name: "categoryName", title: "Fallback Category Name", type: "string" }),
      localizedStringField("categoryNameI18n", "Fallback Category Name Bilingual"),
      defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      localizedTextField("excerptI18n", "Excerpt Bilingual", 3),
      defineField({ name: "readTime", title: "Read Time", type: "string" }),
      defineField({
        name: "coverImage",
        title: "Article Cover Image / Thumbnail",
        description: "Gambar ini tampil di card article, halaman detail article, dan Knowledge Center.",
        type: "image",
        options: { hotspot: true },
      }),
      defineField({
        name: "sections",
        title: "Content Sections",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
              localizedStringField("headingI18n", "Heading Bilingual"),
              defineField({
                name: "body",
                title: "Paragraphs",
                type: "array",
                of: [defineArrayMember({ type: "text", rows: 4 })],
              }),
              defineField({
                name: "bodyI18n",
                title: "Paragraphs Bilingual",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "object",
                    fields: [
                      defineField({ name: "en", title: "English", type: "text", rows: 4 }),
                      defineField({ name: "id", title: "Indonesia", type: "text", rows: 4 }),
                    ],
                    preview: { select: { title: "en", subtitle: "id" } },
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      ...seoFields,
      defineField({ name: "isFeatured", title: "Featured", type: "boolean", initialValue: false }),
      defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
      statusField,
    ],
    preview: {
      select: { title: "title", subtitle: "categoryName", media: "coverImage" },
    },
  }),

  defineType({
    name: "portfolioProject",
    title: "Portfolio Projects",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "clientName", title: "Client Name", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("clientNameI18n", "Client Name Bilingual"),
      defineField({ name: "category", title: "Category", type: "string" }),
      localizedStringField("categoryI18n", "Category Bilingual"),
      defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
      localizedTextField("summaryI18n", "Summary Bilingual", 3),
      defineField({ name: "description", title: "Description", type: "text", rows: 5 }),
      localizedTextField("descriptionI18n", "Description Bilingual", 5),
      defineField({ name: "outcome", title: "Outcome", type: "text", rows: 3 }),
      localizedTextField("outcomeI18n", "Outcome Bilingual", 3),
      defineField({
        name: "image",
        title: "Portfolio Card Image",
        description: "Gambar ini tampil pada card portfolio project.",
        type: "image",
        options: { hotspot: true },
      }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "title", subtitle: "clientName", media: "image" },
    },
  }),

  defineType({
    name: "client",
    title: "Clients / Partners",
    type: "document",
    fields: [
      defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
      defineField({
        name: "logo",
        title: "Client / Partner Logo",
        description: "Logo ini tampil di halaman Clients / Partners.",
        type: "image",
      }),
      defineField({ name: "websiteUrl", title: "Website URL", type: "string" }),
      defineField({ name: "category", title: "Category", type: "string" }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "name", subtitle: "category", media: "logo" },
    },
  }),

  defineType({
    name: "industry",
    title: "Industries",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
      localizedTextField("descriptionI18n", "Description Bilingual", 4),
      defineField({ name: "iconName", title: "Icon Name", type: "string" }),
      defineField({
        name: "image",
        title: "Unused Image",
        description:
          "Saat ini tidak tampil di UI industry page. Field disembunyikan agar tidak membingungkan editor.",
        type: "image",
        options: { hotspot: true },
        hidden: true,
      }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "title", subtitle: "iconName", media: "image" },
    },
  }),

  defineType({
    name: "solution",
    title: "Solutions",
    type: "document",
    fields: [
      defineField({ name: "label", title: "Tab Label", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("labelI18n", "Tab Label Bilingual"),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "label" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "tabId", title: "Tab ID", type: "string", description: "Contoh: infrastructure, delivery, telecommunication" }),
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
      localizedTextField("descriptionI18n", "Description Bilingual", 4),
      defineField({ name: "iconName", title: "Icon Name", type: "string" }),
      defineField({
        name: "image",
        title: "Solution Banner Image",
        description: "Gambar ini tampil pada banner/tab detail solusi.",
        type: "image",
        options: { hotspot: true },
      }),
      defineField({
        name: "capabilities",
        title: "Core Capabilities",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
              localizedStringField("titleI18n", "Title Bilingual"),
              defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
              localizedTextField("descriptionI18n", "Description Bilingual", 3),
              defineField({ name: "iconName", title: "Icon Name", type: "string" }),
            ],
          }),
        ],
      }),
      statusField,
      sortOrderField,
    ],
  }),

  defineType({
    name: "event",
    title: "Events",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
      localizedTextField("descriptionI18n", "Description Bilingual", 4),
      defineField({ name: "eventDate", title: "Event Date", type: "datetime" }),
      defineField({ name: "location", title: "Location", type: "string" }),
      localizedStringField("locationI18n", "Location Bilingual"),
      defineField({ name: "registrationUrl", title: "Registration URL", type: "string" }),
      defineField({
        name: "image",
        title: "Event Image",
        description: "Gambar ini tampil pada card event di halaman Resources / Event.",
        type: "image",
        options: { hotspot: true },
      }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "title", subtitle: "eventDate", media: "image" },
    },
  }),

  defineType({
    name: "companyStatement",
    title: "Company Statements",
    type: "document",
    fields: [
      defineField({ name: "key", title: "Key", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
      localizedStringField("eyebrowI18n", "Eyebrow Bilingual"),
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "description", title: "Description", type: "text", rows: 5, validation: (Rule) => Rule.required() }),
      localizedTextField("descriptionI18n", "Description Bilingual", 5),
      defineField({
        name: "image",
        title: "Unused Statement Image",
        description:
          "Saat ini statement company di UI tidak menampilkan gambar. Field disembunyikan agar tidak membingungkan editor.",
        type: "image",
        options: { hotspot: true },
        hidden: true,
      }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "title", subtitle: "key", media: "image" },
    },
  }),

  defineType({
    name: "companyValue",
    title: "Company Values",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      localizedTextField("descriptionI18n", "Description Bilingual", 3),
      defineField({ name: "iconName", title: "Icon Name", type: "string" }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "title", subtitle: "description" },
    },
  }),

  defineType({
    name: "companyLeader",
    title: "Company Leadership",
    type: "document",
    fields: [
      defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "role", title: "Role", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("roleI18n", "Role Bilingual"),
      defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
      localizedTextField("bioI18n", "Bio Bilingual", 4),
      defineField({
        name: "photo",
        title: "Leadership Photo",
        description: "Foto ini tampil pada card Executive Leadership.",
        type: "image",
        options: { hotspot: true },
      }),
      defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "string" }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "name", subtitle: "role", media: "photo" },
    },
  }),

  defineType({
    name: "navigationItem",
    title: "Navigation Items",
    type: "document",
    fields: [
      defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("labelI18n", "Label Bilingual"),
      defineField({ name: "href", title: "URL", type: "string", validation: (Rule) => Rule.required() }),
      defineField({
        name: "group",
        title: "Group",
        type: "string",
        options: {
          list: [
            { title: "Header", value: "header" },
            { title: "Footer Services", value: "footer_services" },
            { title: "Footer Company", value: "footer_company" },
            { title: "Footer Resources", value: "footer_resources" },
            { title: "Resources Drawer", value: "resources_drawer" },
          ],
        },
      }),
      defineField({ name: "iconName", title: "Icon Name", type: "string" }),
      defineField({ name: "openInNewTab", title: "Open in New Tab", type: "boolean", initialValue: false }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "label", subtitle: "href" },
    },
  }),

  defineType({
    name: "contactPage",
    title: "Contact Page",
    type: "document",
    fields: [
      defineField({
        name: "eyebrow",
        title: "Eyebrow",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      localizedStringField("eyebrowI18n", "Eyebrow Bilingual"),
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        rows: 3,
        validation: (Rule) => Rule.required(),
      }),
      localizedTextField("descriptionI18n", "Description Bilingual", 3),
      defineField({
        name: "actions",
        title: "Contact Actions",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "label",
                title: "Label",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              localizedStringField("labelI18n", "Label Bilingual"),
              defineField({
                name: "value",
                title: "Value / Description",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              localizedStringField("valueI18n", "Value Bilingual"),
              defineField({
                name: "href",
                title: "URL",
                type: "string",
              }),
              defineField({
                name: "iconName",
                title: "Icon Name",
                type: "string",
                options: {
                  list: [
                    { title: "Download", value: "download" },
                    { title: "WhatsApp", value: "whatsapp" },
                    { title: "Email", value: "email" },
                    { title: "Phone", value: "phone" },
                  ],
                },
              }),
            ],
            preview: {
              select: { title: "label", subtitle: "value" },
            },
          }),
        ],
      }),
      defineField({
        name: "locationLabel",
        title: "Location Label",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      localizedStringField("locationLabelI18n", "Location Label Bilingual"),
      defineField({
        name: "officeAddress",
        title: "Office Address",
        type: "text",
        rows: 3,
        validation: (Rule) => Rule.required(),
      }),
      localizedTextField("officeAddressI18n", "Office Address Bilingual", 3),
      defineField({
        name: "mapEmbedUrl",
        title: "Google Maps Embed URL",
        type: "url",
      }),
      statusField,
      ...seoFields,
    ],
    preview: {
      select: { title: "title", subtitle: "eyebrow" },
    },
  }),

  defineType({
    name: "documentResource",
    title: "Documents / Brochures",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      localizedTextField("descriptionI18n", "Description Bilingual", 3),
      defineField({ name: "documentType", title: "Document Type", type: "string", initialValue: "brochure" }),
      defineField({ name: "file", title: "File", type: "file" }),
      defineField({ name: "fileUrl", title: "External File URL", type: "string" }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "title", subtitle: "documentType" },
    },
  }),

  defineType({
    name: "legalPage",
    title: "Legal Pages",
    type: "document",
    fields: [
      defineField({
        name: "pageKey",
        title: "Page Key",
        type: "string",
        validation: (Rule) => Rule.required(),
        options: {
          list: [
            { title: "Privacy Policy", value: "privacy-policy" },
            { title: "Terms & Conditions", value: "terms-and-conditions" },
          ],
        },
      }),
      defineField({ name: "eyebrow", title: "Eyebrow", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("eyebrowI18n", "Eyebrow Bilingual"),
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      localizedTextField("descriptionI18n", "Description Bilingual", 3),
      defineField({
        name: "sections",
        title: "Content Sections",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "heading", title: "Heading", type: "string" }),
              localizedStringField("headingI18n", "Heading Bilingual"),
              defineField({
                name: "body",
                title: "Paragraphs",
                type: "array",
                of: [defineArrayMember({ type: "text", rows: 3 })],
              }),
              localizedStringArrayField("bodyI18n", "Paragraphs Bilingual"),
            ],
            preview: {
              select: { title: "heading" },
              prepare({ title }) {
                return { title: title || "Intro section" };
              },
            },
          }),
        ],
      }),
      statusField,
      ...seoFields,
    ],
    preview: {
      select: { title: "title", subtitle: "pageKey" },
    },
  }),

  defineType({
    name: "careersPage",
    title: "Careers Page",
    type: "document",
    fields: [
      defineField({ name: "eyebrow", title: "Eyebrow", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("eyebrowI18n", "Eyebrow Bilingual"),
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("titleI18n", "Title Bilingual"),
      defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      localizedTextField("descriptionI18n", "Description Bilingual", 3),
      defineField({ name: "sectionTitle", title: "Section Title", type: "string", validation: (Rule) => Rule.required() }),
      localizedStringField("sectionTitleI18n", "Section Title Bilingual"),
      defineField({ name: "sectionDescription", title: "Section Description", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
      localizedTextField("sectionDescriptionI18n", "Section Description Bilingual", 4),
      defineField({
        name: "departments",
        title: "Departments / Opportunity Cards",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
              localizedStringField("titleI18n", "Title Bilingual"),
              defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
              localizedTextField("descriptionI18n", "Description Bilingual", 3),
            ],
            preview: {
              select: { title: "title", subtitle: "description" },
            },
          }),
        ],
      }),
      statusField,
      ...seoFields,
    ],
    preview: {
      select: { title: "title", subtitle: "eyebrow" },
    },
  }),

  defineType({
    name: "siteSetting",
    title: "Site Settings",
    type: "document",
    fields: [
      defineField({ name: "key", title: "Key", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      defineField({ name: "value", title: "Value", type: "text", rows: 6 }),
    ],
    preview: {
      select: { title: "key", subtitle: "description" },
    },
  }),
];
