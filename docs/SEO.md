# SEO notes

## What is in place
- Unique, length-checked titles (`%s | Krishan Tours`) and meta descriptions (≤160 chars, auto-clipped by `clip()` in `lib/i18n/metadata.ts`).
- Canonical + hreflang for all 6 locales **plus `x-default`**, identical in page `<head>` and `sitemap.xml`.
- JSON-LD: `TravelAgency` + `WebSite` (site-wide, `@id` referenced by every page), `FAQPage`, `TouristTrip`, `TouristDestination`, `BlogPosting`, `BreadcrumbList`. Use `components/JsonLd.tsx` for new schema.
- Every visible string on landing pages is translated. SEO-critical wording per language lives in `lib/i18n/seo-overrides.ts` and overrides the machine catalogs.
- `/tours` renders all tour cards in the static HTML (filters still work client-side).

## Adding content
1. Write English strings through `t()` (or in a `data/*.ts` file).
2. Run `node scripts/generate-translations.mjs` to fill missing translations (clean-up runs automatically via `scripts/i18n-postprocess.mjs`).
3. For titles/H1s in FR/DE, add a hand-written entry to `lib/i18n/seo-overrides.ts`.

## After each deploy
- Search Console → Sitemaps → resubmit `https://krishantours.com/sitemap.xml`.
- URL Inspection → request indexing for `/`, `/sri-lanka-private-driver`, `/sri-lanka-tour-packages`, `/airport-transfer-sri-lanka`, `/fr`, `/de`.
- Optional: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to verify via meta tag.
