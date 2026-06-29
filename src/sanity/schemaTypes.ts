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
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
      defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
      defineField({ name: "backgroundImage", title: "Background Image", type: "image", options: { hotspot: true } }),
      defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
      defineField({ name: "ctaHref", title: "CTA URL", type: "string" }),
      defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string" }),
      defineField({ name: "secondaryCtaHref", title: "Secondary CTA URL", type: "string" }),
      defineField({ name: "startsAt", title: "Starts At", type: "datetime" }),
      defineField({ name: "endsAt", title: "Ends At", type: "datetime" }),
      statusField,
      sortOrderField,
    ],
    preview: {
      select: { title: "title", subtitle: "pageSlug", media: "image" },
    },
  }),

  defineType({
    name: "product",
    title: "Products",
    type: "document",
    fields: [
      defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "shortName", title: "Short Name", type: "string" }),
      defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
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
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
      defineField({ name: "brochureUrl", title: "Brochure URL", type: "string" }),
      defineField({ name: "demoUrl", title: "Demo URL", type: "string" }),
      defineField({ name: "isFeatured", title: "Featured", type: "boolean", initialValue: false }),
      defineField({
        name: "features",
        title: "Features",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
      }),
      defineField({
        name: "benefits",
        title: "Benefits",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
      }),
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
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      sortOrderField,
    ],
  }),

  defineType({
    name: "article",
    title: "Articles",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "articleCategory" }] }),
      defineField({ name: "categoryName", title: "Fallback Category Name", type: "string" }),
      defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      defineField({ name: "readTime", title: "Read Time", type: "string" }),
      defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
      defineField({
        name: "sections",
        title: "Content Sections",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
              defineField({
                name: "body",
                title: "Paragraphs",
                type: "array",
                of: [defineArrayMember({ type: "text", rows: 4 })],
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
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "clientName", title: "Client Name", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "category", title: "Category", type: "string" }),
      defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
      defineField({ name: "description", title: "Description", type: "text", rows: 5 }),
      defineField({ name: "outcome", title: "Outcome", type: "text", rows: 3 }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
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
      defineField({ name: "logo", title: "Logo", type: "image" }),
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
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
      defineField({ name: "iconName", title: "Icon Name", type: "string" }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
      statusField,
      sortOrderField,
    ],
  }),

  defineType({
    name: "solution",
    title: "Solutions",
    type: "document",
    fields: [
      defineField({ name: "label", title: "Tab Label", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "label" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "tabId", title: "Tab ID", type: "string", description: "Contoh: infrastructure, delivery, telecommunication" }),
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
      defineField({ name: "iconName", title: "Icon Name", type: "string" }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
      defineField({
        name: "capabilities",
        title: "Core Capabilities",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
              defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
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
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
      defineField({ name: "eventDate", title: "Event Date", type: "datetime" }),
      defineField({ name: "location", title: "Location", type: "string" }),
      defineField({ name: "registrationUrl", title: "Registration URL", type: "string" }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
      statusField,
      sortOrderField,
    ],
  }),

  defineType({
    name: "documentResource",
    title: "Documents / Brochures",
    type: "document",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      defineField({ name: "documentType", title: "Document Type", type: "string", initialValue: "brochure" }),
      defineField({ name: "file", title: "File", type: "file" }),
      defineField({ name: "fileUrl", title: "External File URL", type: "string" }),
      statusField,
      sortOrderField,
    ],
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
