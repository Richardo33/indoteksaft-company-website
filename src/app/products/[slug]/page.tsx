import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailContent } from "@/components/products/product-detail-content";
import { pickLocalized } from "@/lib/i18n/localized-content";
import {
  getProductBySlug,
  getProductSlugs,
} from "@/sanity/products";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: pickLocalized(product.shortName, "en", "Product"),
    description: pickLocalized(product.description, "en"),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailContent product={product} />;
}
