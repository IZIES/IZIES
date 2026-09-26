import "./globals.css";
import type { Metadata, Viewport } from "next";
import { BUSINESS_DESCRIPTION, SITE_URL } from "@/lib/seo";
import { BUSINESS_EMAIL } from "@/lib/business";

import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

import ProgressBarProvider from "@/components/ProgressBarProvider";
import { RegisterSW } from "@/components/RegisterSW";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://izies.in/#organization",
  name: "IZIES",
  alternateName: "IZIES.in",
  legalName: "IZIES",
  email: BUSINESS_EMAIL,
  url: "https://izies.in",
  logo: {
    "@type": "ImageObject",
    url: "https://izies.in/brand/izies-logo-512.png",
    width: 512,
    height: 512,
    caption: "IZIES logo",
  },
  image: "https://izies.in/brand/izies-logo-512.png",
  description: BUSINESS_DESCRIPTION,
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "Place", name: "Worldwide" },
  ],
  sameAs: [
    "https://github.com/IZIES",
    "https://www.linkedin.com/company/izies",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://izies.in/#website",
  name: "IZIES",
  alternateName: "IZIES Digital Engineering",
  url: "https://izies.in",
  publisher: { "@id": "https://izies.in/#organization" },
  inLanguage: "en-IN",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IZIES | Digital Engineering & Software Development",
    template: "%s | IZIES",
  },
  description: BUSINESS_DESCRIPTION,
  authors: [{ name: "IZIES" }],
  creator: "IZIES",
  publisher: "IZIES",
  verification: {
    google: "fQV6uFp2rcWwW2Xo_2jMwZYqa2YRWafO9edEV-l06-8"
  },
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "IZIES",
    title: "IZIES | Digital Engineering & Software Development",
    description: "Website, mobile app, SaaS, AI and automation development for your business.",
    images: [{
      url: "/brand/izies-social-card-1200x630.png",
      width: 1200,
      height: 630,
      alt: "IZIES software development services",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IZIES | Digital Engineering & Software Development",
    description: "Website, mobile app, SaaS, AI and automation development for your business.",
    images: ["/brand/izies-social-card-1200x630.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#04060A] text-slate-100">
        <RegisterSW />
        <ProgressBarProvider>
          {children}
        </ProgressBarProvider>
      </body>
    </html>
  );
}

