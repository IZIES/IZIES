import type { Metadata } from "next";
import { capabilityContent } from "@/lib/capabilities";

export const SITE_URL = "https://izies.in";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const BUSINESS_DESCRIPTION = "IZIES provides digital engineering services across software, web, mobile, AI, automation, cloud and data for businesses in India and international teams.";

export function businessMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, SITE_URL).href;
  const fullTitle = `${title} | IZIES`;
  const image = { url: "/brand/izies-social-card-1200x630.png", width: 1200, height: 630, alt: "IZIES digital engineering services" };
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: "website", url, siteName: "IZIES", locale: "en_IN", title: fullTitle, description, images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image.url] },
  };
}

export function serviceCatalog(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_URL}${path}#services`,
    name: "IZIES Digital Engineering Services",
    url: new URL(path, SITE_URL).href,
    itemListElement: Object.entries(capabilityContent).map(([id, service]) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": `${SITE_URL}/services#service-${id}`,
        name: service.title,
        description: service.description,
        url: `${SITE_URL}/services#service-${id}`,
        provider: { "@id": ORGANIZATION_ID },
      },
    })),
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
