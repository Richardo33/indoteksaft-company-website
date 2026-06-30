import { SimplePageShell } from "@/components/shared/simple-page-shell";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return (
    <SimplePageShell
      eyebrow="CMS"
      title="Sanity Studio is prepared for the next phase"
      description="The CMS entry point is intentionally disabled for the current production deployment while the content model and integration are being finalized."
    />
  );
}
