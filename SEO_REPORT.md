# IZIES business SEO audit and implementation

## Scope and confirmed facts

Business SEO only: `/`, `/services`, the 13 service detail pages and supporting company/contact/trust surfaces. Careers, candidate and recruitment page SEO was explicitly excluded by the owner after the initial audit. Their existing sitemap entries and functionality remain unless explicitly requested later.

Owner-confirmed: IZIES is a remote digital engineering business, targeting India and international clients, from startups/SMBs to enterprises. All existing service categories are relevant. Service availability is 24×7. Business contact: `company.izies@gmail.com`. There is currently no public portfolio or public office. No new locations, clients, testimonials, ratings, awards, employee counts, certifications or performance statistics were created.

## Read-only audit findings

| Area | Finding before this implementation |
| --- | --- |
| Framework | Installed Next.js 14.2.15, React 18.3.1, TypeScript, App Router; no Pages Router found in this project. Vercel is the intended host. |
| Metadata | Homepage already had metadataBase, canonical, OG and Twitter metadata from earlier work. Shared descriptions were narrower than the full business. Jobs/team lacked self-canonicals; careers and client-rendered job details lacked route metadata. Those recruitment findings were deferred after scope clarification. |
| Schema | Organization and WebSite each rendered once at root; homepage OfferCatalog described services. Earlier global FAQ/ProfessionalService markup had already been removed. No verified office or local-business facts justify adding it back. |
| Crawling | Dynamic sitemap existed with published jobs but no services hub; static pages used current time as lastModified. Robots allowed public pages/assets and disallowed admin/candidate/API paths. No business pagination exists. |
| Navigation | Navbar section destinations were buttons; footer fragment links resolved against the current page, breaking on inner pages. No service route existed. |
| Page semantics | Homepage had one H1; some H2 sections jumped to H4 card headings. A service catalog was present but no separate business directory page. |
| Images/fonts | Public logo, social image and icon files available; public images generally used next/image with alt text and dimensions. Hero/logo already prioritized; leadership fill images specify sizes. Largest local branded source images are roughly 450–470 KB, and the transparent source logo about 313 KB; Next image optimization serves responsive derivatives. Font uses next/font with swap. No new image library was needed. |
| Performance | Several static sections unnecessarily used use client. Scroll wrappers shipped Framer Motion and initially hid content. Client-fetched recruitment data and responsive job/team image gaps were recorded but left outside the business scope. No measured CWV baseline was available. |
| Claims | Some business copy promised zero defects, sub-30/sub-50ms performance or zero downtime without evidence. Leadership included fallback people when the public DB list was empty. |
| Runtime | Prisma generation targets src/generated/prisma; the shared runtime import used @prisma/client. A standalone runtime check found that package lacked heroTechDomain, although tsconfig aliases could mask the discrepancy during Next compilation. |
| 404/redirects | No custom 404; no explicit www policy. Missing job detail used client-side messaging, deferred with recruitment SEO. |
| Tooling | next lint opened a configuration prompt; ESLint/config were not installed. Concurrent dev servers and builds shared .next. The registered service worker file was missing from public. |
| Live domain | At audit time izies.in and its sitemap path returned Hostinger parked-domain HTML; izies.vercel.app returned a Next site. Owner confirmed the custom domain had been purchased but not connected/deployed yet. This is a deployment prerequisite, not evidence about the new code. |

## Files and changes

Paths are relative to `kosma-careers`.

| File(s) | Change |
| --- | --- |
| src/lib/seo.ts | Shared production-domain metadata, canonical/OG/Twitter helpers, safe JSON-LD serialization and service catalog with stable service IDs. |
| src/lib/business.ts | Confirmed public business email constant. |
| src/lib/capabilities.ts | Shared descriptions and deliverables for 13 existing services; confirmed 24×7 availability. No technology-list display or invented proof. |
| src/app/layout.tsx | Digital-engineering company defaults; one Organization and one WebSite definition, confirmed email, working icon/manifest URLs. No global homepage canonical or irrelevant global FAQ. |
| src/app/(public)/page.tsx | Unique business homepage metadata and a page-specific catalog referencing the same organization. |
| src/app/(public)/services/page.tsx | Server-rendered, substantive service directory with 13 capabilities, service-detail links, scope guidance, process/product links and enquiry CTAs. No dozens of thin keyword pages. |
| src/app/(public)/services/[slug]/page.tsx | Service detail route for 13 real services with unique metadata, one H1, service-specific copy, visible FAQs, related-service links, Breadcrumb/Service/FAQ schema and enquiry CTAs. |
| src/app/robots.ts | Public crawling and asset access preserved; sitemap uses production domain. Existing private/API exclusions retained. |
| src/app/sitemap.ts | Added canonical services URL and all 13 service detail URLs; removed invented current-date timestamps from static pages. Existing public/recruitment discovery retained without new recruitment SEO. |
| src/app/not-found.tsx | Custom 404 with one H1 and crawlable links to home/services. |
| src/middleware.ts | Existing admin/candidate route guards retained. Unknown `/services/*` slugs now return HTTP 404 with `noindex` to avoid soft-404 or duplicate service URLs. |
| src/app/manifest.ts | Business-focused app description. |
| src/components/public/Navbar.tsx | Real anchor destinations while preserving same-page smooth scrolling, mobile closing and modified-click behavior. |
| src/components/public/Footer.tsx | Correct home-fragment destinations from inner pages, services hub link, confirmed email fallback. |
| src/components/public/landing/HeroSection.tsx | Business/digital-engineering H1 and explanatory copy. Existing interactive capability cards remain. |
| src/components/public/landing/CapabilitiesSection.tsx | Shared service copy and crawlable services-hub link; filters retained; no technology chips. |
| src/components/public/landing/CompanyIntroSection.tsx | Existing revised planning/build/testing/support copy; static Server Component. |
| src/components/public/landing/AboutSection.tsx | Confirmed remote operation, markets and availability; static Server Component. |
| src/components/public/landing/IndustriesSection.tsx | Removed unnecessary client boundary. |
| src/components/public/landing/WhatWeBuildSection.tsx | Server Component; H3 cards under section H2. |
| src/components/public/landing/WhyChooseUsSection.tsx | Server Component; unsupported timing/uptime guarantees removed; confirmed availability. |
| src/components/public/landing/ApproachSection.tsx | Removed unsupported zero-defect and fixed-latency guarantees. Interactive process retained. |
| src/components/public/landing/DeliveryModelsSection.tsx | Removed unsupported latency/zero-defect guarantees; corrected heading level. Existing delivery choices retained. |
| src/components/public/landing/LeadershipSection.tsx | Displays existing public DB records only; no fallback fabricated team and no placeholder # social links. |
| src/components/public/landing/ContactSection.tsx | Confirmed remote/market/availability/email details and direct mailto link; removed unconfirmed 24-hour reply promise. Form retained. |
| src/components/public/landing/FadeInScroll.tsx | Visible server HTML, native IntersectionObserver/Web Animations progressive enhancement, reduced-motion support; removed Framer Motion from this wrapper. |
| src/app/api/contact/route.ts | Business email fallback; removed unsupported response-time promise. Existing SMTP identity/configuration and inquiry persistence retained. No messages sent during testing. |
| src/lib/prisma.ts | Explicit import/re-export of the client generated by this project's schema. |
| public/sw.js | Restored existing network-only service worker from the project's existing source so registration no longer requests a missing file. |
| next.config.js | Permanent www-to-non-www redirect, explicit non-trailing-slash policy, optional isolated local build directory. Default Vercel output remains .next. |
| package.json, package-lock.json, .eslintrc.json | Configured existing lint command with Next core-web-vitals; added compatible lint dependencies and patched vulnerable glob dependency within the lint plugin. No rules suppressed. |
| src/app/(admin)/admin/settings/page.tsx | Escaped one existing JSX apostrophe that blocked lint/build; no admin or careers functionality/SEO changed. |
| .gitignore, tsconfig.json | Ignore isolated build output; Next added that output's generated types to tsconfig includes. |
| tests/business-seo.mjs | Repeatable production HTTP smoke checks for the business SEO surfaces. |

Prisma generation also refreshed generated client artifacts. Existing unrelated staged changes were preserved.

## Database changes

Only the confirmed public business settings were changed in this SEO work: `systemSetting.contactEmail` is `company.izies@gmail.com`, and `officeAddress` is unset because there is no public office. No SMTP credentials, candidate data or recruitment records were changed. Earlier in this conversation the hero capability seed data was separately synchronized at the owner's request.

## Structured data

- Organization: IZIES, production URL, existing logo, business description and confirmed email.
- WebSite: stable ID and publisher reference to Organization.
- OfferCatalog containing 13 Service objects: based on the same content visibly rendered on the business pages, with stable service URLs and provider reference.
- No ProfessionalService/LocalBusiness address, FAQPage rich-result claim, reviews, ratings, prices or new sameAs profiles.
- JSON-LD parsing and one-per-type assertions passed; this is not a claim of Google rich-result eligibility or a substitute for Search Console/Rich Results Test after launch.

## Validation results

- `npm run lint`: passed with five pre-existing React hook warnings in admin/candidate/jobs files; no SEO-file lint errors.
- `npm run build` with isolated output: passed. A later repeat hit Windows EPERM because a running dev process held Prisma's native DLL; final content was then successfully compiled with `npx next build` using the already-generated client. No build errors were ignored.
- `npx tsc --noEmit --incremental false`: passed on final application code.
- Final production server: homepage and services returned HTTP 200; unique title/description, exactly one canonical and H1, expected indexability and OG URL.
- One Organization, WebSite and OfferCatalog per business page; 13 services per catalog and confirmed email verified.
- 64 internal links/anchors checked from business pages.
- robots.txt and XML sitemap passed. After the latest service-sitemap fix, local production verification returned 13 service detail URLs in the sitemap. The count can be higher on production when published job URLs are also present.
- Social image, logo, favicon, manifest and service-worker paths returned 200.
- Unknown page returned 404; invalid service slugs now return HTTP 404 with `noindex`; services trailing slash and www redirects returned 308; www redirect preserved query parameters.
- Build output: homepage approximately 130 KB first-load JS; services approximately 94.7 KB, with 185 B route code for the server-rendered services hub. No before/after percentage or CWV score is claimed.

Latest local production proof after the service sitemap and invalid-slug fix:

```text
LOCAL_SERVICE_DETAIL_URLS 13
/services/ai-development        status=200  robots=index, follow
/services/not-a-real-service    status=404  robots=noindex
/services/xyz-test              status=404  robots=noindex
```

## What to do next

High priority before/after deployment:

1. Deploy the latest `main` branch to Vercel and confirm the live `https://izies.in/sitemap.xml` includes all 13 service detail pages.
2. In Google Search Console, submit `https://izies.in/sitemap.xml`, then inspect the homepage, `/services`, and the most important service pages.
3. Confirm live invalid service URLs such as `/services/not-a-real-service` return `404` and are not indexed.
4. Update OfferCatalog service item URLs so they point directly to `/services/{slug}` detail pages instead of old `/services#service-*` anchors.
5. Improve ranking intent on the highest-demand service pages first: web development, mobile app development, AI development and business automation.

Business ranking content priorities:

1. Strengthen `/services/web-development` for searches like "website banwana hai", "business website development", "web app development" and "SaaS development".
2. Strengthen `/services/mobile-app-development` for "app banwana hai", "mobile app development", "Android app development" and "iOS app development".
3. Strengthen `/services/ai-development` for "AI chatbot development", "AI automation for business" and "AI assistant for business".
4. Strengthen `/services/business-automation` for "business automation", "workflow automation" and "CRM automation".
5. Add a dedicated custom software development page only if it is treated as a real service page with useful content, not a thin keyword page.

Trust and authority priorities:

1. Create real Privacy Policy, Terms of Service and Security/Trust pages when the business details are ready.
2. Set up Google Business Profile only with real remote/service-area business information. Do not add a fake office address.
3. Keep official LinkedIn and GitHub profiles complete and consistent with the website.
4. Add real case studies, testimonials, client logos or reviews only when they can be shown publicly and truthfully.
5. Avoid fake/spam backlinks. Use genuine brand profiles, useful content, real mentions and legitimate directories.

Measurement priorities:

1. Track GSC impressions, clicks, CTR and average position by page and query.
2. Watch "Discovered - currently not indexed", "Crawled - currently not indexed", soft 404 and duplicate canonical reports.
3. Run PageSpeed Insights on mobile for `/`, `/services`, `/services/web-development`, `/services/mobile-app-development` and `/services/ai-development`.
4. Keep a monthly keyword/content review based on actual GSC data rather than guessing.

## Local validation commands

Normal build, after stopping dev servers that hold the Windows Prisma DLL:

```powershell
npm run lint
npx tsc --noEmit
npm run build
npm run start -- -p 3101
```

For an isolated production output beside a running dev server (client already generated):

```powershell
$env:NEXT_BUILD_DIR = '.next-seo-check'
npx next build
npm run start -- -p 3101
```

In another terminal:

```powershell
node tests/business-seo.mjs
```

The smoke script defaults to localhost:3101. It is a local production test; its custom Host-header redirect check should not be treated as a public DNS verification.

## Launch prerequisites and limits

1. Deploy with Vercel project root `kosma-careers`, correct production environment variables and database access. Connect izies.in using the exact DNS records Vercel supplies; configure www to redirect. Do not point the production domain at an unverified project.
2. Once the custom domain works, review the old Vercel alias/preview indexing policy in Vercel. No forced redirect from the currently usable Vercel URL was added while the custom domain is parked.
3. Verify the domain property in Google Search Console, submit `https://izies.in/sitemap.xml`, and inspect `/` and `/services`. Do not paste credentials into chat. Test structured data with Google's and Schema.org's public validators after launch.
4. Measure mobile LCP/CLS/INP on the deployed site with PageSpeed Insights and field data as it becomes available. Browser visual QA, Vercel routing, real-world speed and indexing were not verified here.
5. Existing Next.js 14.2.15/PostCSS dependency advisories remain: npm audit reported one critical and one high issue after the lint dependency fix. A separately tested framework/dependency update is needed before public launch; no forced major-version upgrade was made in this SEO task.
6. No email was sent and SMTP delivery was not tested. Confirm production mail delivery to the business address separately.
7. No Search Console history, Keyword Planner data, country-level demand or competitor analysis was available. Service coverage is grounded in the existing business, not invented search-volume estimates. Research actual demand and conversion intent before prioritizing deeper service pages.
8. Recruitment SEO findings remain deferred by explicit instruction. Existing public team records/contact phones/social links were not independently identity-verified; no new versions of those facts were put into schema.
9. No guarantee of #1 rankings, indexing times or universal visibility. Useful service content, real project evidence when available, technical quality and ongoing measurement are required beyond metadata.

## References used

- [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Next.js 14 metadata conventions](https://nextjs.org/docs/14/app/api-reference/file-conventions/metadata)
