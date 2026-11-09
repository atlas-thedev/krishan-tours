import type { Price } from "@/lib/content-db";

export const money = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;

/** "$55 – $65", "$220 – $350+" or "$22" */
export function priceRange(price: Price | undefined, separator = " – ") {
  if (!price) return "";
  const high = price.max && price.max > price.min ? `${separator}${money(price.max)}` : "";
  return `${money(price.min)}${high}${price.plus ? "+" : ""}`;
}

/** Placeholder values for translated copy: {driver.sedan} → "$55 – $65", {driver.sedan.min} → "$55", {driver.sedan.max} → "$65". */
export function priceValues(prices: Record<string, Price>) {
  const values: Record<string, string> = {};
  for (const [key, price] of Object.entries(prices)) {
    values[key] = priceRange(price);
    values[`${key}.min`] = money(price.min);
    values[`${key}.max`] = money(price.max ?? price.min);
  }
  return values;
}

type Translate = (source: string, values?: Record<string, string | number>) => string;

/** Translates FAQ items on the server and fills in live prices. */
export function localizeFaqs(items: { q: string; a: string }[], t: Translate, values: Record<string, string>) {
  return items.map((item) => ({ q: t(item.q, values), a: t(item.a, values) }));
}
