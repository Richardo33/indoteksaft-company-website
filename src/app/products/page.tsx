import type { Metadata } from "next";

import { ProductsPageContent } from "@/components/products/products-page-content";
import { getHomeArticlePages } from "@/sanity/home";
import { getProductsPageData } from "@/sanity/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Enterprise software products by Indoteksaft for infrastructure, monitoring, security, operations, and digital transformation.",
  alternates: {
    canonical: "/products",
  },
};

export default async function ProductsPage() {
  const [data, articlePagesData] = await Promise.all([
    getProductsPageData(),
    getHomeArticlePages(),
  ]);

  return <ProductsPageContent data={data} articlePagesData={articlePagesData} />;
}
