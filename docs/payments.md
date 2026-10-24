# PayHere booking payments

## Safety defaults

- Navigation shows a disabled **Pay for My Booking** control for locked browsers.
- Visiting `https://krishantours.com/unlockedpayments` sets a signed, HttpOnly, Secure browser cookie for 24 hours and redirects to `/pay-for-booking`. This URL is a preview gate, not authentication: anyone who knows it can unlock their browser. It never enables all visitors.
- Checkout requires both that cookie and enabled, configured admin settings. Direct API calls cannot bypass it.
- Defaults are sandbox, disabled, no credentials. No real merchant credentials are committed to the repository.
- Admin → Payments stores separate sandbox/live profiles and a USD or LKR currency. Empty secret fields retain existing values. Explicit removal is available.
- Switching to enabled live mode requires explicit real-money confirmation. PayHere must approve/activate the live account and the krishantours.com integration; a website switch cannot bypass that requirement.

## Server setup

Set `PAYMENT_ENCRYPTION_KEY` to a cryptographically random 32-byte hex key (`openssl rand -hex 32`). Keep it stable, private, and backed up with `.env.production`. AES-256-GCM encrypts all payment credentials in SQLite and the order-specific verification secret snapshots. Losing or changing the key prevents decrypting existing settings and in-flight order secrets. This key is separate from the admin session secret.

Nginx CSP must allow `form-action 'self' https://sandbox.payhere.lk https://www.payhere.lk`. Keep the `strict-origin-when-cross-origin` referrer policy on checkout pages; PayHere checks the origin. Do not expose the localhost application port publicly.

## Configure and test

1. In the PayHere **sandbox** portal, add the `krishantours.com` integration. Obtain its merchant ID and domain-specific merchant secret.
2. In `/admin/payments`, enter sandbox credentials, select Sandbox, choose currency, and enable checkout for unlocked browsers. Save.
3. Open `/unlockedpayments`, enter a test booking reference and agreed amount, then continue to hosted sandbox checkout. Never use real card details in sandbox.
4. PayHere posts to `https://krishantours.com/api/payments/notify`. The notification must be reachable without an interactive Cloudflare challenge. If needed, configure a narrowly scoped rule for this exact callback path; signature verification still applies.
5. Check the receipt and admin ledger: the order must show **paid / sandbox**, not just a return-page redirect. Test cancellation/failure too. Do not infer a successful sandbox integration until a real PayHere sandbox notification has arrived.
6. For live use, enter the separately approved live credentials, select Live, enable checkout, explicitly confirm real-money mode, and save. No deployment is required. The browser unlock gate remains in force as requested.

Checkout API requires a merchant ID and domain-specific merchant secret, not API client ID/client secret credentials for PayHere management APIs.

## Payment records

- Customer details required for checkout are forwarded to PayHere, not stored in payment order records. Card numbers/CVV never reach this application.
- Server-generated IDs, integer minor-unit amounts, and currency are stored before redirect. The hash is generated server-side.
- Callback signatures, merchant, order, amount, currency and status are validated. No signature or card fields are written to logs or payment events.
- Verification uses an encrypted per-order secret snapshot, so credential rotation or mode changes do not invalidate in-flight notifications.
- Callbacks are idempotent; a late pending/failed notification cannot downgrade a paid transaction. Verified chargebacks are recorded.
- Receipt access uses a separate HttpOnly cookie and an opaque order ID. Receipt tokens are not put in URLs or returned in JSON.
- Payment status comes only from verified callbacks, never return/cancel query parameters. A paid amount is not automatic confirmation that the whole booking balance has been paid.
- Admin lists the latest 100 attempts with clearly separated sandbox/live badges. Refunds are handled through PayHere; there is no automated refund action here.
- Daily SQLite backups include payment configuration, orders and events. Also back up the encryption key separately and privately.

## Routes

- `/pay-for-booking`: locked / not-configured / checkout states
- `/unlockedpayments`: browser unlock + redirect (not linked publicly)
- `/payments/result?order=...`: verified receipt for the browser that initiated checkout
- `/admin/payments`: authenticated settings and ledger
- `/api/payments/notify`: signed server-to-server callback, no browser unlock required

Reference: https://support.payhere.lk/api-%26-mobile-sdk/checkout-api
