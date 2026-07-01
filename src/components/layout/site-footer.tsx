import { SiteFooterContent } from "@/components/layout/site-footer-content";
import { getFooterNavigation } from "@/sanity/navigation";

export async function SiteFooter() {
  const groups = await getFooterNavigation();
  const currentYear = new Date().getFullYear();

  return <SiteFooterContent groups={groups} currentYear={currentYear} />;
}
