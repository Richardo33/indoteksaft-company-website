import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Indoteksaft Corporate Website",
    short_name: "Indoteksaft",
    description:
      "Enterprise technology solutions for critical infrastructure and digital transformation.",
    start_url: "/",
    display: "standalone",
    background_color: "#050b18",
    theme_color: "#050b18",
  };
}
