import { defineLocations } from "sanity/presentation";

const previewOrigin =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL ??
  process.env.SITE_URL ??
  "http://localhost:3000";

function url(path: string) {
  return new URL(path, previewOrigin).toString();
}

function slugLocation(
  title: string,
  pathPrefix: string,
  slug?: { current?: string },
) {
  if (!slug?.current) return null;

  return {
    locations: [
      {
        title,
        href: url(`${pathPrefix}/${slug.current}`),
      },
    ],
  };
}

export const previewUrl = {
  initial: url("/"),
  previewMode: {
    enable: "/api/draft-mode/enable",
    disable: "/api/draft-mode/disable",
    shareAccess: false,
  },
};

export const resolvePresentation = {
  mainDocuments: [
    {
      route: "/",
      filter: '_type == "sitePage" && routePath == "/"',
    },
    {
      route: "/products",
      filter: '_type == "sitePage" && routePath == "/products"',
    },
    {
      route: "/products/:slug",
      filter: '_type == "product" && slug.current == $slug',
      params: ({ params }: { params: Record<string, string> }) => ({
        slug: params.slug,
      }),
    },
    {
      route: "/articles",
      filter: '_type == "sitePage" && routePath == "/articles"',
    },
    {
      route: "/articles/:slug",
      filter: '_type == "article" && slug.current == $slug',
      params: ({ params }: { params: Record<string, string> }) => ({
        slug: params.slug,
      }),
    },
    {
      route: [
        "/solutions",
        "/industries",
        "/resources",
        "/resources/portfolio",
        "/resources/client",
        "/resources/brosur",
        "/resources/event",
        "/company",
        "/contact",
        "/careers",
        "/privacy-policy",
        "/terms-and-conditions",
      ],
      filter: '_type == "sitePage" && routePath == $routePath',
      params: ({ path }: { path: string }) => ({
        routePath: path,
      }),
    },
  ],
  locations: {
    sitePage: defineLocations({
      select: {
        title: "title",
        routePath: "routePath",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Page",
            href: url(doc?.routePath ?? "/"),
          },
        ],
      }),
    }),
    banner: defineLocations({
      select: {
        title: "title",
        pageSlug: "pageSlug",
      },
      resolve: (doc) => {
        const pathByPage: Record<string, string> = {
          home: "/",
          products: "/products",
          industries: "/industries",
          company: "/company",
          "resources-portfolio": "/resources/portfolio",
          "resources-client": "/resources/client",
        };

        return {
          locations: [
            {
              title: doc?.title ?? "Banner",
              href: url(pathByPage[doc?.pageSlug ?? ""] ?? "/"),
            },
          ],
        };
      },
    }),
    product: defineLocations({
      select: {
        title: "name",
        slug: "slug",
      },
      resolve: (doc) => slugLocation(doc?.title ?? "Product", "/products", doc?.slug),
    }),
    article: defineLocations({
      select: {
        title: "title",
        slug: "slug",
      },
      resolve: (doc) => slugLocation(doc?.title ?? "Article", "/articles", doc?.slug),
    }),
    solution: defineLocations({
      select: {
        title: "title",
        tabId: "tabId",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Solution",
            href: url(`/solutions${doc?.tabId ? `#${doc.tabId}` : ""}`),
          },
        ],
      }),
    }),
    industry: defineLocations({
      select: {
        title: "title",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Industry",
            href: url("/industries"),
          },
        ],
      }),
    }),
    portfolioProject: defineLocations({
      select: {
        title: "title",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Portfolio Project",
            href: url("/resources/portfolio"),
          },
        ],
      }),
    }),
    client: defineLocations({
      select: {
        title: "name",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Client",
            href: url("/resources/client"),
          },
        ],
      }),
    }),
    companyLeader: defineLocations({
      select: {
        title: "name",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Company Leadership",
            href: url("/company"),
          },
        ],
      }),
    }),
    companyStatement: defineLocations({
      select: {
        title: "title",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Company Statement",
            href: url("/company"),
          },
        ],
      }),
    }),
    companyValue: defineLocations({
      select: {
        title: "title",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Company Value",
            href: url("/company"),
          },
        ],
      }),
    }),
  },
};
