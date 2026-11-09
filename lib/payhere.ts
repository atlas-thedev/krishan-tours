import { createHash, timingSafeEqual } from "node:crypto";

export type PaymentMode = "sandbox" | "live";
export const checkoutUrls = { sandbox: "https://sandbox.payhere.lk/pay/checkout", live: "https://www.payhere.lk/pay/checkout" } as const;
const md5 = (s: string) => createHash("md5").update(s).digest("hex").toUpperCase();
export function checkoutHash(merchantId: string, orderId: string, amount: string, currency: string, secret: string) {
  return md5(merchantId + orderId + amount + currency + md5(secret));
}
export function notificationHash(merchantId: string, orderId: string, amount: string, currency: string, code: string, secret: string) {
  return md5(merchantId + orderId + amount + currency + code + md5(secret));
}
export function equalHash(a: string, b: string) {
  return /^[A-Fa-f0-9]{32}$/.test(b) && timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}
export function amountInCents(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,9}(\.\d{1,2})?$/.test(value)) throw new Error("Enter an amount with no more than two decimal places.");
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
export const formatAmount = (cents: number) => (cents / 100).toFixed(2);
