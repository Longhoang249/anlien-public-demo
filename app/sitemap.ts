import type { MetadataRoute } from "next";

const origin = "https://anlien-public-demo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/demo", "/demo/ops", "/demo/loyalty", "/demo/marketing", "/demo/day"].map(
    (path) => ({
      url: `${origin}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );
}
