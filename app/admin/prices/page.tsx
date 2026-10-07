import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { PriceEditor } from "@/components/admin/PriceEditor";
import { isAdmin } from "@/lib/admin-auth";
import { getPriceRows } from "@/lib/content-db";
import { inquiryCounts } from "@/lib/inquiries-db";

export const metadata: Metadata = { title: "Prices · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const prices = getPriceRows().map((row) => ({ key: row.key, group: row.group, label: row.label, unit: row.unit, min: row.min, max: row.max, defaultMin: row.defaultMin, defaultMax: row.defaultMax, hasRange: row.defaultMax != null, updatedAt: row.updatedAt }));
  return <AdminShell active="prices" title="Prices" subtitle="Every price on the website, in USD. Changes go live on all pages and languages — including Google’s price data — as soon as you publish." badge={inquiryCounts().new}>
    <PriceEditor prices={prices}/>
  </AdminShell>;
}
