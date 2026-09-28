import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/hero-tech"],
      disallow: ["/admin/", "/candidate/", "/api/"],
    },
    sitemap: "https://izies.in/sitemap.xml",
  };
}
