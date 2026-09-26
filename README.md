# IZIES Website

Next.js 14 App Router website for IZIES business services and hiring workflows.

## Stack

- Next.js 14.2.15
- React 18.3
- TypeScript
- Tailwind CSS
- Prisma
- Vercel production target

## Business SEO Scope

The business SEO surface is focused on:

- `/`
- `/services`
- `/services/ai-development`
- `/services/web-development`
- `/services/mobile-app-development`
- `/services/business-automation`
- `/services/api-development`
- `/services/cloud-devops`
- `/services/data-engineering-analytics`
- `/services/blockchain-web3-development`
- `/services/media-streaming-development`
- `/services/gaming-3d-development`
- `/services/software-testing-qa`
- `/services/dedicated-development-teams`
- `/services/software-support-maintenance`
- `/team`

Careers, jobs, candidate and admin flows are part of the same application, but business SEO work should not change them unless that scope is explicitly requested.

## SEO Files

- `src/app/layout.tsx` - global metadata, favicon, manifest, Organization schema and WebSite schema.
- `src/lib/seo.ts` - shared SEO helpers, canonical metadata and service catalog schema.
- `src/lib/capabilities.ts` - visible service catalog content and service slugs.
- `src/lib/service-details.ts` - long-form service detail page content.
- `src/app/(public)/services/page.tsx` - services hub.
- `src/app/(public)/services/[slug]/page.tsx` - service detail route.
- `src/app/sitemap.ts` - production sitemap.
- `src/app/robots.ts` - robots rules.
- `src/middleware.ts` - route guards, including invalid service slug handling.
- `SEO_REPORT.md` - audit notes, validation results and next SEO priorities.

## Local Development

```powershell
npm install
npm run dev
```

If Prisma client generation is needed:

```powershell
npm run prisma:generate
```

## Validation

Run these before deploying SEO-related code:

```powershell
npx tsc --noEmit --incremental false
npx next build
```

For local production verification with an isolated build output:

```powershell
$env:NEXT_BUILD_DIR = '.next-seo-check'
npx next build
npm run start -- -p 3101
```

Then verify:

```powershell
node tests/business-seo.mjs
```

## Current SEO Status

Implemented:

- Production domain metadata uses `https://izies.in`.
- Homepage, services hub and service detail pages have canonical metadata.
- Service detail pages are included in `sitemap.xml`.
- Invalid `/services/*` slugs return `404` with `noindex`.
- Organization, WebSite, OfferCatalog, Service, Breadcrumb and FAQ schema are present where applicable.
- Favicon, manifest and social image paths are configured.
- `robots.txt` allows public pages and excludes admin/candidate/API paths.

Still needs verification after deployment:

- Google Search Console indexing status.
- Sitemap submission status.
- Core Web Vitals field data.
- Rich Results Test output.
- Backlinks and brand mentions.
- Google Business Profile eligibility and setup.

## Next SEO Work

High priority:

- Update OfferCatalog service item URLs so they point to the service detail pages instead of old `#service-*` anchors.
- Improve ranking intent on the highest demand pages: web development, mobile app development, AI development and business automation.
- Add real trust pages: Privacy Policy, Terms of Service and Security/Trust.
- Submit the deployed sitemap in Google Search Console.
- Set up Google Business Profile only with real remote/service-area business information. Do not add a fake office address.

Content growth:

- Publish helpful guides around real search intent, such as website planning, mobile app planning, AI automation and custom software development.
- Add case studies only when real public projects are available.
- Add industry/location pages only when there is real service-specific content and a valid reason to target that market.

No SEO change should invent clients, reviews, awards, addresses, phone numbers, statistics or guarantees.
