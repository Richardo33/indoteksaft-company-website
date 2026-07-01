import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { previewUrl, resolvePresentation } from "./src/sanity/presentation";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "indoteksaft-company-website",
  title: "Indoteksaft Company Website",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: "Preview",
      previewUrl,
      resolve: resolvePresentation,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
