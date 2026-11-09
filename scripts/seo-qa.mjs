// Read-only technical SEO smoke test against a running local or deployed site.
const base = (process.env.QA_BASE_URL || "http://127.0.0.1:3418").replace(/\/$/, "");
const canonicalOrigin = (process.env.QA_CANONICAL_ORIGIN || "https://krishantours.com").replace(/\/$/, "");
const locales = ["en", "ar", "cs", "fr", "pl", "de", "es", "it", "nl", "ru", "zh", "ja"];
const routes = ["/", "/sri-lanka-private-driver", "/plan-your-trip", "/contact", "/destinations/ella", "/tours/sri-lanka-essentials", "/experiences/wildlife", "/stories/sunrise-above-sigiriya", "/destinations/kandy", "/sri-lanka-7-day-tour", "/sigiriya-kandy-ella-tour", "/destinations/arugam-bay", "/destinations/anuradhapura", "/terms", "/sri-lanka-10-day-tour"];
const failures = [];
const normalise = (url) => url.replace(/\/$/, "");
const hrefFor = (path, locale) => locale === "en" ? path : `/${locale}${path === "/" ? "" : path}`;
function tagAttribute(html, tag, match, attribute) {
  const tags = html.match(new RegExp(`<${tag}\\b[^>]*>`, "gi")) || [];
  const element = tags.find((candidate) => match.test(candidate));
  return element?.match(new RegExp(`\\b${attribute}="([^"]*)"`, "i"))?.[1];
}

for (const route of routes) {
  for (const locale of locales) {
    const path = hrefFor(route, locale);
    const response = await fetch(`${base}${path}`, { headers: { "user-agent": "Googlebot" } });
    const html = await response.text();
    const expected = `${canonicalOrigin}${path}`;
    if (response.status !== 200) failures.push(`${path}: status ${response.status}`);
    const canonical = tagAttribute(html, "link", /rel="canonical"/i, "href");
    if (!canonical || normalise(canonical) !== normalise(expected)) failures.push(`${path}: canonical ${canonical}`);
    if (!new RegExp(`<html[^>]+lang="${locale}"`, "i").test(html)) failures.push(`${path}: incorrect html language`);
    if (!/<h1\b/i.test(html)) failures.push(`${path}: missing h1`);
    if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${path}: missing title`);
    const robotsTag = tagAttribute(html, "meta", /name="robots"/i, "content") || "";
    if (/noindex/i.test(robotsTag) || /noindex/i.test(response.headers.get("x-robots-tag") || "")) failures.push(`${path}: unexpectedly noindex`);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
      try { JSON.parse(match[1]); } catch { failures.push(`${path}: invalid JSON-LD`); }
    }
    if (!/<meta name="description" content="[^"]+/i.test(html)) failures.push(`${path}: missing description`);
    if (!/<link rel="alternate" hrefLang="x-default"/i.test(html)) failures.push(`${path}: missing x-default`);
    for (const alternate of locales) {
      const expectedAlternate = `${canonicalOrigin}${hrefFor(route, alternate)}`;
      const value = tagAttribute(html, "link", new RegExp(`hrefLang="${alternate}"`, "i"), "href");
      if (!value || normalise(value) !== normalise(expectedAlternate)) failures.push(`${path}: ${alternate} alternate ${value}`);
    }
    const image = tagAttribute(html, "meta", /property="og:image"/i, "content");
    if (!image?.startsWith(canonicalOrigin + "/")) failures.push(`${path}: invalid OG image ${image}`);
    else if (!(await fetch(`${base}${image.slice(canonicalOrigin.length)}`, { method: "HEAD" })).ok) failures.push(`${path}: missing OG image ${image}`);
    if (/^\/(destinations|tours|experiences|stories)\//.test(route)) {
      if (!html.includes('"@type":"BreadcrumbList"')) failures.push(`${path}: missing breadcrumb schema`);
      if (!html.includes('aria-current="page"')) failures.push(`${path}: missing visible breadcrumb`);
    }
  }
}
// Tour-specific planner links should retain their context without creating new canonical URLs.
for (const [locale, tour, expectedName] of [["en", "sri-lanka-essentials", "Sri Lanka Essentials"], ["fr", "sri-lanka-essentials", "Circuit sélectionné"]]) {
  const path = hrefFor("/plan-your-trip", locale);
  const response = await fetch(`${base}${path}?tour=${tour}`);
  const html = await response.text();
  const canonical = tagAttribute(html, "link", /rel="canonical"/i, "href");
  if (!response.ok || !html.includes(expectedName)) failures.push(`${path}: selected tour not shown`);
  if (!canonical || normalise(canonical) !== normalise(`${canonicalOrigin}${path}`)) failures.push(`${path}: query variant canonical ${canonical}`);
}
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
for (const route of routes) for (const locale of locales) {
  const expected = `${canonicalOrigin}${hrefFor(route, locale)}`;
  if (!Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), match => normalise(match[1])).includes(normalise(expected))) failures.push(`sitemap missing ${expected}`);
}
if (!sitemap.includes('hreflang="x-default"')) failures.push("sitemap missing x-default");
const robots = await (await fetch(`${base}/robots.txt`)).text();
if (!robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) failures.push("robots: missing sitemap");
if ((await fetch(`${base}/this-route-does-not-exist`)).status !== 404) failures.push("missing route did not return 404");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`SEO_QA_OK: ${routes.length * locales.length} pages, metadata, images, sitemap, robots and 404`);
