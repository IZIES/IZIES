import assert from "node:assert/strict";
import http from "node:http";
import https from "node:https";

const origin = process.env.SEO_TEST_ORIGIN || "http://localhost:3101";
const canonicalOrigin = "https://izies.in";
const businessPages = ["/", "/services"];
const titles = new Set();
const anchors = [];

for (const path of businessPages) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const title = [...html.matchAll(/<title>(.*?)<\/title>/g)];
  assert.equal(title.length, 1, `${path}: one title`);
  assert(!titles.has(title[0][1]), `${path}: unique title`);
  titles.add(title[0][1]);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one H1`);
  const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
  assert.equal(canonicals.length, 1, `${path}: one canonical`);
  assert.equal(new URL(canonicals[0][1]).href, new URL(path, canonicalOrigin).href);
  assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
  assert(html.includes('property="og:url"'), `${path}: Open Graph URL`);
  assert(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html));
  assert(!response.headers.get("x-robots-tag")?.includes("noindex"));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1]));
  for (const type of ["Organization", "WebSite", "OfferCatalog"]) {
    assert.equal(schemas.filter(schema => schema["@type"] === type).length, 1, `${path}: ${type}`);
  }
  const catalog = schemas.find(schema => schema["@type"] === "OfferCatalog");
  assert.equal(catalog.itemListElement.length, 13);
  assert.equal(schemas.find(schema => schema["@type"] === "Organization").email, "company.izies@gmail.com");
  assert(html.includes("company.izies@gmail.com"));
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    if (match[1].startsWith("/") || match[1].startsWith("#")) anchors.push(new URL(match[1], new URL(path, origin)));
  }
  console.log(`PASS ${path}: metadata, canonical, H1, indexability and JSON-LD`);
}

const pages = new Map();
for (const url of anchors) {
  if (!pages.has(url.pathname)) {
    const response = await fetch(new URL(url.pathname, origin), { redirect: "manual" });
    assert.equal(response.status, 200, `Internal link ${url.pathname}`);
    pages.set(url.pathname, await response.text());
  }
  if (url.hash) assert(pages.get(url.pathname).includes(`id="${url.hash.slice(1)}"`), `Missing anchor ${url.pathname}${url.hash}`);
}
console.log(`PASS ${anchors.length} internal links / anchors`);

const robotsResponse = await fetch(`${origin}/robots.txt`);
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
assert(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
assert(!/^Disallow:\s*\/$/m.test(robots));
assert(!robots.includes("/_next/"));
const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200);
assert(sitemapResponse.headers.get("content-type")?.includes("xml"));
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert(urls.includes(`${canonicalOrigin}/services`));
assert(urls.includes(canonicalOrigin) || urls.includes(`${canonicalOrigin}/`));
assert.equal(new Set(urls).size, urls.length);
assert(urls.every(url => url.startsWith(`${canonicalOrigin}/`) || url === canonicalOrigin));
assert(!urls.some(url => /\/(admin|candidate|api)(\/|$)/.test(url)));
console.log(`PASS robots and sitemap (${urls.length} URLs; existing careers entries retained)`);

for (const path of ["/brand/izies-social-card-1200x630.png", "/brand/izies-logo-512.png", "/icons/favicon-32x32.png", "/manifest.webmanifest", "/sw.js"]) {
  assert.equal((await fetch(`${origin}${path}`)).status, 200, path);
}
assert.equal((await fetch(`${origin}/__seo_missing_page__`)).status, 404);
const slash = await fetch(`${origin}/services/`, { redirect: "manual" });
assert.equal(slash.status, 308);
assert.equal(new URL(slash.headers.get("location"), origin).pathname, "/services");
// node:http preserves a custom Host header; Node fetch may replace it.
const www = await new Promise((resolve, reject) => {
  const transport = origin.startsWith("https:") ? https : http;
  transport.get(`${origin}/services?source=check`, { headers: { Host: "www.izies.in" } }, response => {
    response.resume();
    resolve({ status: response.statusCode, location: response.headers.location });
  }).on("error", reject);
});
assert.equal(www.status, 308);
assert.equal(www.location, "https://izies.in/services?source=check");
console.log("PASS assets, missing-page 404, trailing slash and www redirect");
