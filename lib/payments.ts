import "server-only";
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/inquiries-db";
import { checkoutHash, notificationHash, equalHash, amountInCents, formatAmount, checkoutUrls, type PaymentMode } from "@/lib/payhere";
import { siteConfig } from "@/lib/site";

export const receiptCookie = "krishantours_payment_receipt";
export const unlockCookie = "krishantours_payment_preview";
const ttl = 24 * 60 * 60;
export type PaymentSettings = { mode: PaymentMode; enabled: boolean; currency: "USD" | "LKR"; sandbox: { merchantId: string; secret: string }; live: { merchantId: string; secret: string } };
export type PaymentOrder = { id: string; booking_reference: string; amount_cents: number; currency: string; mode: PaymentMode; merchant_id: string; secret_encrypted: string; receipt_hash: string; status: string; provider_payment_id: string | null; created_at: string; updated_at: string };
function db() {
  const d = getDatabase();
  d.exec(`CREATE TABLE IF NOT EXISTS payment_settings (id INTEGER PRIMARY KEY CHECK(id=1), value_encrypted TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS payment_orders (id TEXT PRIMARY KEY, booking_reference TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents>0), currency TEXT NOT NULL, mode TEXT NOT NULL CHECK(mode IN ('sandbox','live')), merchant_id TEXT NOT NULL, secret_encrypted TEXT NOT NULL, receipt_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', provider_payment_id TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE UNIQUE INDEX IF NOT EXISTS payment_provider_id ON payment_orders(mode, provider_payment_id) WHERE provider_payment_id IS NOT NULL;
    CREATE TABLE IF NOT EXISTS payment_events (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES payment_orders(id), status_code TEXT NOT NULL, received_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS payment_created_at ON payment_orders(created_at DESC);`);
  return d;
}
export const encryptionReady = () => /^[a-fA-F0-9]{64}$/.test(process.env.PAYMENT_ENCRYPTION_KEY || "");
function key() {
  if (!encryptionReady()) throw new Error("Payment encryption key is not configured on the server.");
  return Buffer.from(process.env.PAYMENT_ENCRYPTION_KEY!, "hex");
}
function encrypt(text: string) {
  const iv = randomBytes(12); const c = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), ciphertext].map(v => v.toString("base64url")).join(".");
}
function decrypt(text: string) {
  const [iv, tag, ciphertext] = text.split(".").map(v => Buffer.from(v, "base64url"));
  const d = createDecipheriv("aes-256-gcm", key(), iv); d.setAuthTag(tag);
  return Buffer.concat([d.update(ciphertext), d.final()]).toString("utf8");
}
function signingKey() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("Server signing key is not configured.");
  return s;
}
export function createUnlockToken() {
  const exp = String(Math.floor(Date.now() / 1000) + ttl);
  return exp + "." + createHmac("sha256", signingKey()).update("payments-preview:" + exp).digest("hex");
}
export function verifyUnlockToken(token?: string) {
  if (!token) return false;
  const [exp, sig, extra] = token.split(".");
  if (extra || !/^\d+$/.test(exp) || !/^[a-f0-9]{64}$/.test(sig || "") || Number(exp) <= Date.now() / 1000 || Number(exp) > Date.now()/1000 + ttl + 60) return false;
  const expected = createHmac("sha256", signingKey()).update("payments-preview:" + exp).digest();
  return timingSafeEqual(expected, Buffer.from(sig, "hex"));
}
export async function paymentsUnlocked() { return verifyUnlockToken((await cookies()).get(unlockCookie)?.value); }
export function getPaymentSettings(): PaymentSettings {
  const row = db().prepare("SELECT value_encrypted FROM payment_settings WHERE id=1").get() as {value_encrypted: string} | undefined;
  return row ? JSON.parse(decrypt(row.value_encrypted)) : { mode: "sandbox", enabled: false, currency: "USD", sandbox: {merchantId: "", secret: ""}, live: {merchantId: "", secret: ""} };
}
export function publicSettings() {
  const s = getPaymentSettings();
  return { mode: s.mode, enabled: s.enabled, currency: s.currency, encryptionReady: encryptionReady(), sandbox: {merchantId: s.sandbox.merchantId, hasSecret: !!s.sandbox.secret}, live: {merchantId: s.live.merchantId, hasSecret: !!s.live.secret} };
}
export function ready(s: PaymentSettings) { return s.enabled && encryptionReady() && !!s[s.mode].merchantId && !!s[s.mode].secret; }
export function savePaymentSettings(input: Record<string, unknown>) {
  const current = getPaymentSettings();
  if (input.mode !== "sandbox" && input.mode !== "live") throw new Error("Choose sandbox or live mode.");
  if (input.currency !== "USD" && input.currency !== "LKR") throw new Error("Choose USD or LKR.");
  if (typeof input.enabled !== "boolean") throw new Error("Choose whether checkout is enabled.");
  if (input.mode === "live" && input.enabled && input.liveConfirmation !== "GO LIVE") throw new Error("Confirm GO LIVE before enabling real payments.");
  const next: PaymentSettings = { ...current, mode: input.mode, enabled: input.enabled, currency: input.currency };
  for (const mode of ["sandbox", "live"] as const) {
    const profile = input[mode] as Record<string, unknown> | undefined;
    if (!profile || typeof profile.merchantId !== "string" || !/^\d{5,20}$|^$/.test(profile.merchantId.trim())) throw new Error("Merchant IDs must contain digits only.");
    const secret = typeof profile.secret === "string" ? profile.secret.trim() : "";
    if (secret && (secret.length < 8 || secret.length > 512)) throw new Error("Enter a valid merchant secret.");
    next[mode] = { merchantId: profile.merchantId.trim(), secret: profile.clearSecret === true ? "" : secret || current[mode].secret };
  }
  if (next.enabled && (!next[next.mode].merchantId || !next[next.mode].secret)) throw new Error("Add the merchant ID and secret for the selected mode before enabling checkout.");
  db().prepare("INSERT INTO payment_settings(id,value_encrypted,updated_at) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET value_encrypted=excluded.value_encrypted,updated_at=excluded.updated_at").run(encrypt(JSON.stringify(next)), new Date().toISOString());
  return publicSettings();
}
const digest = (s: string) => createHash("sha256").update(s).digest("hex");
export function createCheckout(input: Record<string, unknown>) {
  const s = getPaymentSettings(); if (!ready(s)) throw new Error("Payments are not configured yet. Please contact Krishan.");
  const text = (key: string, min = 1, max = 160) => { const v = typeof input[key] === "string" ? input[key].trim() : ""; if (v.length < min || v.length > max || /[<>\u0000-\u001f]/.test(v)) throw new Error("Check your " + key.replaceAll("_", " ") + "."); return v; };
  const booking = text("booking_reference", 2, 80);
  const email = text("email", 3, 254); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  const phone = text("phone", 7, 30); if (!/^\+?[\d\s().-]{7,30}$/.test(phone)) throw new Error("Enter a valid phone number.");
  if (input.confirmed !== true) throw new Error("Confirm the booking reference and agreed payment amount.");
  const cents = amountInCents(input.amount); const min = s.currency === "LKR" ? 10000 : 100; const max = s.currency === "LKR" ? 100000000 : 5000000;
  if (cents < min || cents > max) throw new Error(s.currency === "LKR" ? "Enter an amount from LKR 100 to 1,000,000." : "Enter an amount from USD 1 to 50,000.");
  const customer = { first_name: text("first_name", 1, 60), last_name: text("last_name", 1, 60), email, phone, address: text("address", 2), city: text("city", 2, 80), country: text("country", 2, 80) };
  const id = "KT-" + randomUUID(); const token = randomBytes(32).toString("hex"); const now = new Date().toISOString(); const profile = s[s.mode]; const amount = formatAmount(cents);
  db().prepare("INSERT INTO payment_orders(id,booking_reference,amount_cents,currency,mode,merchant_id,secret_encrypted,receipt_hash,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,'pending',?,?)")
    .run(id, booking, cents, s.currency, s.mode, profile.merchantId, encrypt(profile.secret), digest(token), now, now);
  const result = `${siteConfig.url}/payments/result?order=${id}`;
  return { receiptToken: token, orderId: id, action: checkoutUrls[s.mode], mode: s.mode, fields: { ...customer, merchant_id: profile.merchantId, order_id: id, items: `Booking payment: ${booking}`, amount, currency: s.currency, return_url: result, cancel_url: result + "&cancelled=1", notify_url: `${siteConfig.url}/api/payments/notify`, hash: checkoutHash(profile.merchantId, id, amount, s.currency, profile.secret) } };
}
export function receipt(id: string, token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const o = db().prepare("SELECT * FROM payment_orders WHERE id=? AND receipt_hash=?").get(id, digest(token)) as PaymentOrder | undefined;
  if (!o) return null;
  return { id: o.id, bookingReference: o.booking_reference, amount: formatAmount(o.amount_cents), currency: o.currency, mode: o.mode, status: o.status };
}
export function processNotification(p: URLSearchParams) {
  const id = p.get("order_id") || ""; const code = p.get("status_code") || "";
  if (!["2", "0", "-1", "-2", "-3"].includes(code)) throw new Error("Invalid status");
  const d = db(); const o = d.prepare("SELECT * FROM payment_orders WHERE id=?").get(id) as PaymentOrder | undefined;
  if (!o) throw new Error("Unknown order");
  const merchant = p.get("merchant_id") || "", amount = p.get("payhere_amount") || "", currency = p.get("payhere_currency") || "";
  if (merchant !== o.merchant_id || currency !== o.currency || amountInCents(amount) !== o.amount_cents) throw new Error("Payment does not match order");
  const sig = notificationHash(merchant, id, amount, currency, code, decrypt(o.secret_encrypted));
  if (!equalHash(sig, p.get("md5sig") || "")) throw new Error("Invalid signature");
  const paymentId = (p.get("payment_id") || "").trim(); if (!paymentId || paymentId.length > 100) throw new Error("Invalid payment ID");
  const statuses: Record<string, string> = {"2":"paid", "0":"pending", "-1":"cancelled", "-2":"failed", "-3":"charged_back"};
  const eventId = digest([id, paymentId, code, amount, currency].join("|"));
  d.transaction(() => {
    if (d.prepare("SELECT id FROM payment_events WHERE id=?").get(eventId)) return;
    if (o.provider_payment_id && o.provider_payment_id !== paymentId) throw new Error("Payment ID mismatch");
    const current = d.prepare("SELECT status FROM payment_orders WHERE id=?").get(id) as {status: string};
    let next = statuses[code];
    if (current.status === "charged_back" || (current.status === "paid" && next !== "charged_back")) next = current.status;
    d.prepare("UPDATE payment_orders SET status=?,provider_payment_id=?,updated_at=? WHERE id=?").run(next, paymentId, new Date().toISOString(), id);
    d.prepare("INSERT INTO payment_events(id,order_id,status_code,received_at) VALUES(?,?,?,?)").run(eventId, id, code, new Date().toISOString());
  })();
}
export function listPaymentOrders() {
  return db().prepare("SELECT id,booking_reference,amount_cents,currency,mode,status,provider_payment_id,created_at FROM payment_orders ORDER BY created_at DESC LIMIT 100").all() as Pick<PaymentOrder,"id"|"booking_reference"|"amount_cents"|"currency"|"mode"|"status"|"provider_payment_id"|"created_at">[];
}
