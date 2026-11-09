# SEO and inquiry checklist

## What the site does

- Public pages provide titles, descriptions, self-canonical URLs and language alternates. The sitemap lists the English and translated pages; it is linked from robots.txt. Detail pages have visible breadcrumbs with matching structured data. `npm run qa:seo` checks a representative set against a running server (set `QA_BASE_URL` and, if needed, `QA_CANONICAL_ORIGIN`).
- Visitors can skip the trip-planner questions and send their contact details, or use WhatsApp. If an inquiry form fails, it offers a WhatsApp link.
- The server saves an inquiry to SQLite before attempting email. A successful response with `delivered: false` means it was **saved, not emailed**. Check the admin desk regularly, including all status filters. The desk warns when SendGrid or SMTP settings are absent, and marks new inquiries whose email alert failed or was not confirmed. Statuses are recorded for new submissions only; older inquiries are not retroactively checked. Check logs and test delivery too.
- With optional analytics consent, submitted forms emit `generate_lead` with method `contact_form` or `trip_planner`. WhatsApp and phone link clicks emit `contact` with the respective method. These are anonymous interaction events; WhatsApp/phone clicks are not confirmed inquiries. Client-side page navigations also send page views. Configure GA4 key events and reports if desired, and disable GA4 enhanced measurement's history-based page changes to avoid double-counting SPA page views. Visitors who decline analytics are not counted by these events.

## Production reconciliation

The live site observed on 9 November 2026 served 12 languages, while the earlier main branch supported only six. The existing production `seo-optimization` branch has now been reconciled into this working branch, preserving its translations and admin/email features alongside the invoice maker. Verify the actual deployed revision and environment before release; local integration is not proof that production matches it.

The reported `?tour=` planner URLs are variants of the planner, not separate tour pages; their canonicalization is expected if they point to the corresponding language's plain planner URL. The three HTTP/www redirects are expected if they lead to the preferred HTTPS host. `favicon.ico` and `sitemap.xml` are resources, not pages to get indexed. Inspect the remaining discovered/crawled pages individually in Search Console. A local check cannot establish Google's selected canonical or why Google hasn't indexed a URL.

## Verify after deployment

1. Confirm `https://krishantours.com` in `lib/site.ts` is the actual preferred public domain; check that the other domain/`www`/HTTP versions redirect to it. The website cannot determine this from the repository. Domain changes require coordinated redirects, DNS, certificates, canonical URLs and Search Console updates.
2. In Google Search Console, verify the preferred domain, submit `/sitemap.xml`, inspect important URLs (including translated versions), and check indexing, crawl errors, search queries, clicks and impressions. Compare periods before deciding whether the issue is visibility or conversion. These changes do not guarantee rankings or inquiries.
3. In the real deployed environment, send a clearly labelled test inquiry through **both** forms. Confirm it appears in the admin desk and that the notification reaches the intended inbox, including spam. Check PM2/server logs for `Unable to persist inquiry` and `Inquiry saved but email delivery failed`. Confirm `SENDGRID_API_KEY` and `MAIL_FROM`, or the SMTP settings (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`), and `CONTACT_TO_EMAIL` are configured with valid values and that the database directory is writable and backed up. Do not put credentials in Git.
4. In GA4 DebugView, with analytics consent accepted, test one submitted form and one WhatsApp click. Confirm the property receives the right anonymous events and mark `generate_lead` as a key event if appropriate. Without consent those events will not fire, so GA4 is not a complete count of inquiries.
5. Verify the Google Business Profile, phone, business name, address, website and opening details; request genuine reviews from customers and reply to them. Link directly to real profiles rather than search result pages.
6. Review factual and commercial claims before relying on them: current driver rates and inclusions, license/insurance, airport waiting fees, deposit and cancellation terms, and package descriptions should match what Krishan actually offers. Keep them updated and avoid publishing invented offers or reviews. The driver-page prices and metadata use the editable price data, but the actual rates and terms still need owner verification.
7. Improve content using the search terms and questions that real travellers use: add first-hand route advice, real photos, transparent inclusions and clear next steps. Check translations for natural wording with fluent speakers. Reassess Search Console and inquiry counts over several weeks rather than expecting immediate changes.

## Local checks

Run `npm ci`, `npm run lint`, `npm run build`, then start the site and run `npm run qa:seo`. To test form submissions locally, use a separate temporary `INQUIRY_DATA_DIR`, leave SMTP unset, and inspect the test database; do not send test submissions to the live site or real customer inbox without coordination.
