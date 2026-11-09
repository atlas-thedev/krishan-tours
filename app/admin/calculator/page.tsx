import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { QuoteCalculator } from "@/components/admin/QuoteCalculator";
import { isAdmin } from "@/lib/admin-auth";
import { getPriceRows } from "@/lib/content-db";
import { inquiryCounts } from "@/lib/inquiries-db";

export const metadata: Metadata = { title: "Calculator · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminCalculatorPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const presets = getPriceRows().map(({ key, group, label, unit, min, max }) => ({ key, group, label, unit, min, max }));
  return <AdminShell active="calculator" title="Calculator" subtitle="Build a trip quote from your live prices, then copy it or send it on WhatsApp." badge={inquiryCounts().new}>
    <QuoteCalculator presets={presets} whatsapp=""/>
  </AdminShell>;
}
