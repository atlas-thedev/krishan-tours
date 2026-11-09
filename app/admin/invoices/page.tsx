import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { InvoiceMaker } from "@/components/admin/InvoiceMaker";
import "./invoice.css";

export const metadata: Metadata = { title: "Invoice maker", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function InvoicePage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <InvoiceMaker />;
}
