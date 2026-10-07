# KrishanTours

A production-ready Next.js tourism website for a private Sri Lankan tour operator.

## Run locally

```bash
npm install
npm run dev
```

The production domain, telephone, WhatsApp number and Panadura address are configured in `lib/site.ts`. Contact and trip-planner submissions post to the server-side inquiry endpoint; SMTP delivery settings are documented below.

## VPS deployment

The site runs under PM2 using `ecosystem.config.cjs` on `127.0.0.1:3417`. The Nginx reverse-proxy configuration is in `deploy/nginx/krishantours.com`. Inquiry submissions are validated server-side, saved outside the public web root, and delivered over SMTP when the variables documented in `.env.example` are configured.

## Admin panel (`/admin`)

Mobile-first dashboard with a bottom tab bar on phones:

- **Inquiries** – search, filter by status, one-tap WhatsApp / call / email replies.
- **Prices** – edit every price on the site (driver day rates, private tours, packages, airport transfers). Changes are live immediately on all pages, FAQ answers and Google structured data. "Reset" restores the default from `data/prices.ts`.
- **Trips** – pin trips to the top of listings, reorder, hide, and set the "from" price per person.
- **Settings** – password change and quick links to Google Business Profile, TripAdvisor and Search Console.

Prices and trip settings are stored in the same SQLite database as inquiries (`INQUIRY_DATA_DIR`). Required env: `ADMIN_SESSION_SECRET` (32+ chars) and `ADMIN_PASSWORD_HASH`.

## Languages

12 locales: en, ar, cs, fr, pl, de, es, it, nl, ru, zh, ja (`lib/i18n/config.ts`). Add a locale there, then run `node scripts/generate-translations.mjs`.

## Media

Photography is downloaded locally from Unsplash. The hero uses aerial Sri Lankan coastline footage from Pexels (video 32504550), used under the Pexels licence. The interactive island geometry is the free commercial-use Sri Lanka SVG from SimpleMaps. Replace preview assets with the operator's commissioned photography when available.
