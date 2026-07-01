import type { StructureResolver } from "sanity/structure";

const singleton = (
  S: Parameters<StructureResolver>[0],
  title: string,
  schemaType: string,
  documentId: string,
) =>
  S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(
      S.document()
        .schemaType(schemaType)
        .documentId(documentId)
        .title(title),
    );

const documentList = (
  S: Parameters<StructureResolver>[0],
  title: string,
  schemaType: string,
) =>
  S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(S.documentTypeList(schemaType).title(title));

const filteredList = (
  S: Parameters<StructureResolver>[0],
  title: string,
  schemaType: string,
  filter: string,
  params: Record<string, string>,
) =>
  S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(
      S.documentList()
        .title(title)
        .schemaType(schemaType)
        .filter(filter)
        .params(params),
    );

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Indoteksaft CMS")
    .items([
      S.listItem()
        .title("01. Landing Page")
        .child(
          S.list()
            .title("Landing Page")
            .items([
              filteredList(
                S,
                "Hero Banner",
                "banner",
                '_type == "banner" && pageSlug == $pageSlug',
                { pageSlug: "home" },
              ),
              filteredList(
                S,
                "Hero Rotating Text",
                "bannerRotatingTerm",
                '_type == "bannerRotatingTerm" && pageSlug == $pageSlug',
                { pageSlug: "home" },
              ),
              filteredList(
                S,
                "Metrics / Numbers",
                "metric",
                '_type == "metric" && pageSlug == $pageSlug',
                { pageSlug: "home" },
              ),
              documentList(S, "Industry Summary Cards", "industry"),
              documentList(S, "What We Do Cards", "serviceCard"),
              documentList(S, "Product Carousel", "product"),
              documentList(S, "Knowledge Center Articles", "article"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("02. Products")
        .child(
          S.list()
            .title("Products")
            .items([
              filteredList(
                S,
                "Products Page Banner",
                "banner",
                '_type == "banner" && pageSlug == $pageSlug',
                { pageSlug: "products" },
              ),
              documentList(S, "Product List & Detail", "product"),
              documentList(S, "Documents / Brochures", "documentResource"),
            ]),
        ),

      S.listItem()
        .title("03. Solutions")
        .child(
          S.list()
            .title("Solutions")
            .items([
              documentList(S, "Solution Tabs & Core Capabilities", "solution"),
              filteredList(
                S,
                "Solution-related Service Cards",
                "serviceCard",
                '_type == "serviceCard"',
                {},
              ),
            ]),
        ),

      S.listItem()
        .title("04. Industries")
        .child(
          S.list()
            .title("Industries")
            .items([
              filteredList(
                S,
                "Industries Page Banner",
                "banner",
                '_type == "banner" && pageSlug == $pageSlug',
                { pageSlug: "industries" },
              ),
              documentList(S, "Industry Cards", "industry"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("05. Resources")
        .child(
          S.list()
            .title("Resources")
            .items([
              filteredList(
                S,
                "Portfolio Page Banner",
                "banner",
                '_type == "banner" && pageSlug == $pageSlug',
                { pageSlug: "resources-portfolio" },
              ),
              documentList(S, "Portfolio Projects", "portfolioProject"),
              filteredList(
                S,
                "Client Page Banner",
                "banner",
                '_type == "banner" && pageSlug == $pageSlug',
                { pageSlug: "resources-client" },
              ),
              documentList(S, "Clients / Partner Logos", "client"),
              documentList(S, "Blog & Articles", "article"),
              documentList(S, "Article Categories", "articleCategory"),
              documentList(S, "Events", "event"),
            ]),
        ),

      S.listItem()
        .title("06. Company")
        .child(
          S.list()
            .title("Company")
            .items([
              filteredList(
                S,
                "Company Page Banner",
                "banner",
                '_type == "banner" && pageSlug == $pageSlug',
                { pageSlug: "company" },
              ),
              documentList(S, "Vision & Mission", "companyStatement"),
              documentList(S, "Core Values", "companyValue"),
              documentList(S, "Leadership", "companyLeader"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("07. Navigation & Settings")
        .child(
          S.list()
            .title("Navigation & Settings")
            .items([
              documentList(S, "Website Pages / SEO", "sitePage"),
              filteredList(
                S,
                "Header Navigation",
                "navigationItem",
                '_type == "navigationItem" && group == $group',
                { group: "header" },
              ),
              filteredList(
                S,
                "Resources Drawer",
                "navigationItem",
                '_type == "navigationItem" && group == $group',
                { group: "resources_drawer" },
              ),
              filteredList(
                S,
                "Footer Services",
                "navigationItem",
                '_type == "navigationItem" && group == $group',
                { group: "footer_services" },
              ),
              filteredList(
                S,
                "Footer Company",
                "navigationItem",
                '_type == "navigationItem" && group == $group',
                { group: "footer_company" },
              ),
              filteredList(
                S,
                "Footer Resources",
                "navigationItem",
                '_type == "navigationItem" && group == $group',
                { group: "footer_resources" },
              ),
              documentList(S, "Site Settings", "siteSetting"),
            ]),
        ),

      S.divider(),

      singleton(
        S,
        "Download Company Profile Settings",
        "siteSetting",
        "siteSetting.company-profile-download",
      ),
    ]);
