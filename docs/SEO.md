# SEO notes

## What is in place
- Unique, length-checked titles (`%s | Krishan Tours`) and meta descriptions (≤160 chars, auto-clipped by `clip()` in `lib/i18n/metadata.ts`).
- Canonical + hreflang for all 12 locales (en, ar, cs, fr, pl, de, es, it, nl, ru, zh, ja) **plus `x-default`**, identical in page `<head>` and `sitemap.xml`.
- JSON-LD: `TravelAgency` + `WebSite` (site-wide, `@id` referenced by every page), `FAQPage`, `TouristTrip`, `TouristDestination`, `BlogPosting`, `BreadcrumbList`. Use `components/JsonLd.tsx` for new schema.
- Every visible string on landing pages is translated. SEO-critical wording per language lives in `lib/i18n/seo-overrides.ts` and overrides the machine catalogs.
- Prices in titles, FAQs and `Offer` schema come from the admin price table, so Google always sees current prices.
- `TravelAgency.sameAs` links Google Business Profile (CID 7285712492221722532), TripAdvisor, Facebook and Instagram.
- `/tours` renders all tour cards in the static HTML (filters still work client-side).

## Adding content
1. Write English strings through `t()` (or in a `data/*.ts` file).
2. Run `node scripts/generate-translations.mjs` to fill missing translations (clean-up runs automatically via `scripts/i18n-postprocess.mjs`).
3. For titles/H1s, add a hand-written entry to `lib/i18n/seo-overrides.ts`.

## After each deploy
- Search Console → Sitemaps → resubmit `https://krishantours.com/sitemap.xml`.
- URL Inspection → request indexing for `/`, `/sri-lanka-private-driver`, `/sri-lanka-tour-packages`, `/airport-transfer-sri-lanka`, `/fr`, `/de`.
- Optional: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to verify via meta tag.
- Set `NEXT_PUBLIC_GOOGLE_REVIEW_URL` to the "Ask for reviews" link from Google Business Profile (`https://g.page/r/.../review`) so the footer/admin review buttons go straight to the review form.

## Google Business Profile & TripAdvisor checklist
- GBP: category "Tour operator" (primary) + "Travel agency"; add the Panadura service areas (Colombo, Negombo, Galle, Kandy…); upload 20+ real photos (vehicles, driver, guests); add every service with prices; post weekly updates; reply to every review.
- Ask every guest for a Google review (WhatsApp the review link at drop-off) and a TripAdvisor review. Reviews count and recency are the strongest local ranking factors.
- Keep name, phone (+94 77 603 9102) and website identical on GBP, TripAdvisor, Facebook and the site footer.
- TripAdvisor: claim the listing via Tripadvisor Management Center, add photos, tour description, and link the website.
