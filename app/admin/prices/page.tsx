import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { PriceEditor } from "@/components/admin/PriceEditor";
import { isAdmin } from "@/lib/admin-auth";
import { getPriceRows } from "@/lib/content-db";
import { priceUsage } from "@/data/prices";
import Link from "next/link";
import { inquiryCounts } from "@/lib/inquiries-db";

export const metadata: Metadata = { title: "Prices · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const prices = getPriceRows().map((row) => ({ key: row.key, group: row.group, label: row.label, unit: row.unit, min: row.min, max: row.max, defaultMin: row.defaultMin, defaultMax: row.defaultMax, hasRange: row.defaultMax != null, updatedAt: row.updatedAt, usage: priceUsage[row.key] || [] }));
  return <AdminShell active="prices" title="Prices" subtitle="Every price on the website, in USD. Changes go live on all pages and languages — including Google’s price data — as soon as you publish." badge={inquiryCounts().new}>
    <p className="mb-4 rounded-xl border border-ink/10 bg-white px-4 py-3 text-xs leading-5 text-ink/60">Tap <b className="text-cinnamon">Shown on</b> under any price to see every page and spot where it appears. The “From $X / person” prices of the itinerary tours (Sri Lanka Essentials, Wild Sri Lanka…) are set on the <Link href="/admin/trips" className="font-semibold !text-jungle underline">Trips</Link> tab.</p>
    <PriceEditor prices={prices}/>
  </AdminShell>;
}
