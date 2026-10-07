import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PasswordChanger } from "@/components/admin/PasswordChanger";
import { isAdmin } from "@/lib/admin-auth";
import { inquiryCounts } from "@/lib/inquiries-db";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Settings · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const links = [
  { label: "Google Business Profile", note: "Reply to reviews, add photos and posts weekly", href: siteConfig.social.google },
  { label: "TripAdvisor listing", note: "Ask every happy guest for a review", href: siteConfig.social.tripadvisor },
  { label: "Google Search Console", note: "Rankings, clicks and indexing", href: "https://search.google.com/search-console?resource_id=sc-domain%3Akrishantours.com" },
  { label: "Google review link", note: "Send this to guests after the trip", href: siteConfig.reviewUrl },
];

export default async function AdminSettingsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminShell active="settings" title="Settings" subtitle="Your listings, growth shortcuts and account security." badge={inquiryCounts().new}>
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_6px_24px_rgba(23,56,43,.05)] hover:border-cinnamon"><span><span className="block text-sm font-semibold text-jungle">{link.label}</span><span className="text-xs text-ink/50">{link.note}</span></span><ExternalLink size={16} className="shrink-0 text-ink/40"/></a>)}
    </div>
    <PasswordChanger />
  </AdminShell>;
}
