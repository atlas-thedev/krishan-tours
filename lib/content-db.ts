import { getDatabase } from "@/lib/inquiries-db";
import { priceDefinitions, type PriceDefinition } from "@/data/prices";
import { tours, type Tour } from "@/data/tours";

export type Price = { min: number; max?: number; plus?: boolean };
export type PriceRow = PriceDefinition & { defaultMin: number; defaultMax?: number; updatedAt?: string };
export type TripSetting = { slug: string; pinned: boolean; sortOrder: number; fromPrice?: number; hidden: boolean };
export type ListedTour = Tour & { fromPrice?: number; pinned?: boolean };

/** Reads safely: if the database is unavailable (e.g. during a CI build) defaults are used. */
function safe<T>(read: () => T, fallback: T): T {
  try { return read(); } catch { return fallback; }
}

export function getPriceRows(): PriceRow[] {
  const overrides = safe(() => getDatabase().prepare("SELECT key, min, max, updated_at FROM prices").all() as { key: string; min: number; max: number | null; updated_at: string }[], []);
  const byKey = new Map(overrides.map((row) => [row.key, row]));
  return priceDefinitions.map((definition) => {
    const row = byKey.get(definition.key);
    return {
      ...definition,
      defaultMin: definition.min,
      defaultMax: definition.max,
      min: row ? row.min : definition.min,
      max: row ? (row.max ?? undefined) : definition.max,
      updatedAt: row?.updated_at,
    };
  });
}

export function getPrices(): Record<string, Price> {
  return Object.fromEntries(getPriceRows().map((row) => [row.key, { min: row.min, max: row.max, plus: row.plus }]));
}

export function savePrices(updates: { key: string; min: number; max?: number | null }[]) {
  const known = new Set(priceDefinitions.map((item) => item.key));
  const db = getDatabase();
  const upsert = db.prepare(`INSERT INTO prices (key, min, max, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET min = excluded.min, max = excluded.max, updated_at = excluded.updated_at`);
  const now = new Date().toISOString();
  db.transaction(() => {
    for (const item of updates) if (known.has(item.key)) upsert.run(item.key, item.min, item.max ?? null, now);
  })();
}

export function resetPrice(key: string) {
  getDatabase().prepare("DELETE FROM prices WHERE key = ?").run(key);
}

export function getTripSettings(): Record<string, TripSetting> {
  const rows = safe(() => getDatabase().prepare("SELECT slug, pinned, sort_order, from_price, hidden FROM trip_settings").all() as { slug: string; pinned: number; sort_order: number; from_price: number | null; hidden: number }[], []);
  return Object.fromEntries(rows.map((row) => [row.slug, { slug: row.slug, pinned: !!row.pinned, sortOrder: row.sort_order, fromPrice: row.from_price ?? undefined, hidden: !!row.hidden }]));
}

export function saveTripSettings(settings: TripSetting[]) {
  const db = getDatabase();
  const upsert = db.prepare(`INSERT INTO trip_settings (slug, pinned, sort_order, from_price, hidden, updated_at) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET pinned = excluded.pinned, sort_order = excluded.sort_order, from_price = excluded.from_price, hidden = excluded.hidden, updated_at = excluded.updated_at`);
  const now = new Date().toISOString();
  db.transaction(() => {
    for (const item of settings) upsert.run(item.slug, item.pinned ? 1 : 0, Math.round(item.sortOrder), item.fromPrice ?? null, item.hidden ? 1 : 0, now);
  })();
}

/** Orders any list of slugged items: pinned first, then by admin order, then original order. Hidden items are removed. */
export function orderBySettings<T extends { slug: string }>(items: readonly T[], settings = getTripSettings()): T[] {
  return items
    .map((item, index) => ({ item, index, s: settings[item.slug] }))
    .filter(({ s }) => !s?.hidden)
    .sort((a, b) => Number(!!b.s?.pinned) - Number(!!a.s?.pinned) || (a.s?.sortOrder ?? 100 + a.index) - (b.s?.sortOrder ?? 100 + b.index) || a.index - b.index)
    .map(({ item }) => item);
}

/** Public tour list with admin ordering, pinning and "from" prices applied. */
export function getListedTours(): ListedTour[] {
  const settings = getTripSettings();
  return orderBySettings(tours, settings).map((tour) => ({ ...tour, fromPrice: settings[tour.slug]?.fromPrice, pinned: settings[tour.slug]?.pinned }));
}
