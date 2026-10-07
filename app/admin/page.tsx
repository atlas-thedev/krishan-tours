import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { InquiryCard } from "@/components/admin/InquiryCard";
import { isAdmin } from "@/lib/admin-auth";
import { inquiryCounts, InquiryStatus, listInquiries } from "@/lib/inquiries-db";

export const metadata: Metadata = { title: "Inquiries · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const validStatuses: InquiryStatus[] = ["new", "contacted", "confirmed", "archived"];

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const params = await searchParams;
  const status = validStatuses.includes(params.status as InquiryStatus) ? params.status as InquiryStatus : undefined;
  const q = (params.q || "").slice(0, 80);
  const inquiries = listInquiries(status, q);
  const counts = inquiryCounts();
  const href = (next: string) => {
    const query = new URLSearchParams();
    if (next !== "all") query.set("status", next);
    if (q) query.set("q", q);
    return `/admin${query.size ? `?${query}` : ""}`;
  };

  return <AdminShell active="inquiries" title="Inquiries" subtitle="Trip requests from the website. Reply fast — WhatsApp within an hour wins most bookings." badge={counts.new}>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {([["New", counts.new, "text-cinnamon"], ["Contacted", counts.contacted, "text-jungle"], ["Confirmed", counts.confirmed, "text-tea"], ["Total", counts.all, "text-ink"]] as const).map(([label, value, color]) => <div key={label} className="rounded-2xl bg-white p-4 shadow-[0_6px_24px_rgba(23,56,43,.05)]"><p className="text-[.62rem] font-bold uppercase tracking-[.1em] text-ink/45">{label}</p><p className={`mt-1 text-3xl font-semibold tabular-nums ${color}`}>{value}</p></div>)}
    </div>

    <form action="/admin" className="mt-5 flex gap-2">
      {status && <input type="hidden" name="status" value={status}/>}
      <label className="relative flex-1"><span className="sr-only">Search inquiries</span><Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"/><input name="q" defaultValue={q} placeholder="Search name, email, phone, message…" className="min-h-12 w-full rounded-xl border border-ink/15 bg-white pl-11 pr-4 text-sm outline-none focus:border-cinnamon"/></label>
      <button className="min-h-12 rounded-xl bg-jungle px-5 text-xs font-bold uppercase tracking-[.08em] text-white">Search</button>
    </form>

    <nav aria-label="Filter inquiries" className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0">
      {(["all", ...validStatuses] as const).map((item) => {
        const active = (!status && item === "all") || status === item;
        return <Link key={item} href={href(item)} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-bold capitalize ${active ? "border-jungle bg-jungle !text-white" : "border-ink/15 bg-white !text-ink/65"}`}>{item}<span className={`tabular-nums ${active ? "!text-white/70" : "!text-ink/40"}`}>{counts[item]}</span></Link>;
      })}
    </nav>

    <p className="mt-5 text-xs text-ink/50">Showing {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}{q ? ` for “${q}”` : ""}</p>
    <div className="mt-3 grid gap-3">
      {inquiries.length === 0 && <div className="rounded-2xl border border-dashed border-ink/20 bg-white/60 px-6 py-14 text-center"><Inbox className="mx-auto text-ink/30"/><h2 className="display mt-4 text-3xl text-jungle">Nothing here yet.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink/55">New trip requests appear here the moment travellers send them.</p></div>}
      {inquiries.map((inquiry, index) => <InquiryCard key={inquiry.id} inquiry={inquiry} open={index === 0 && inquiry.status === "new"}/>)}
    </div>
  </AdminShell>;
}
