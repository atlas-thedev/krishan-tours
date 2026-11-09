import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getPrices, savePrices, saveTripSettings } from "@/lib/content-db";
import { readJsonObject } from "@/lib/request-security";
import { tours } from "@/data/tours";
import { landingPackages } from "@/data/prices";

export const runtime = "nodejs";

const knownSlugs = new Set<string>([...tours.map((t) => t.slug), ...landingPackages.map((p) => p.slug)]);
const packageKeys = new Map<string, string>(landingPackages.map((p) => [p.slug, p.priceKey]));

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, message: "Your session has expired." }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await readJsonObject(request); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const items = Array.isArray(body.trips) ? body.trips as Record<string, unknown>[] : [];
  const settings = [];
  const priceUpdates = [];
  const prices = getPrices();
  for (const item of items.slice(0, 50)) {
    const slug = String(item.slug || "");
    if (!knownSlugs.has(slug)) return NextResponse.json({ ok: false, message: "Unknown trip." }, { status: 400 });
    const fromPrice = item.fromPrice == null ? undefined : Number(item.fromPrice);
    if (fromPrice !== undefined && !(fromPrice > 0 && fromPrice < 1_000_000)) return NextResponse.json({ ok: false, message: "Invalid price." }, { status: 400 });
    const priceKey = packageKeys.get(slug);
    // Package "From" prices live in the shared price table so every page stays consistent.
    if (priceKey && fromPrice !== undefined && fromPrice !== prices[priceKey].min) {
      const max = prices[priceKey].max;
      priceUpdates.push({ key: priceKey, min: fromPrice, max: max != null && max < fromPrice ? fromPrice : max ?? null });
    }
    settings.push({ slug, pinned: !!item.pinned, hidden: !!item.hidden, sortOrder: Math.max(0, Math.min(999, Number(item.sortOrder) || 100)), fromPrice: priceKey ? undefined : fromPrice });
  }
  saveTripSettings(settings);
  if (priceUpdates.length) savePrices(priceUpdates);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
