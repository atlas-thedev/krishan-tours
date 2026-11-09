import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import { InquiryManager } from "@/components/admin/InquiryManager";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { PasswordChanger } from "@/components/admin/PasswordChanger";
import { MobileInquiryCard } from "@/components/admin/MobileInquiryCard";
import { isAdmin } from "@/lib/admin-auth";
import { inquiryCounts, InquiryStatus, listInquiries } from "@/lib/inquiries-db";

export const metadata: Metadata = { title: "Inquiry desk", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const validStatuses: InquiryStatus[] = ["new", "contacted", "confirmed", "archived"];

function readable(value: string) {
  if (!value) return "—";
  return value.replaceAll("-", " ");
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const selected = (await searchParams).status;
  const status = validStatuses.includes(selected as InquiryStatus) ? selected as InquiryStatus : undefined;
  const inquiries = listInquiries(status);
  const counts = inquiryCounts();

  return <section className="admin-surface min-h-screen bg-paper pb-20">
    <header className="bg-jungle text-white">
      <div className="shell flex items-start justify-between gap-5 pb-12 pt-8 md:items-end md:pb-16 md:pt-12">
        <div><p className="eyebrow text-gold">KrishanTours · Private</p><h1 className="display mt-3 text-5xl leading-none md:text-7xl">Inquiry desk</h1><p className="mt-3 max-w-md text-sm leading-6 text-white/60">Read new trip requests, follow up and keep each conversation moving.</p></div>
        <div className="flex flex-wrap items-center justify-end gap-3"><Link href="/admin/invoices" className="border border-gold px-4 py-3 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-jungle">Invoice maker</Link><LogoutButton /></div>
      </div>
    </header>
    <div className="shell">
      <nav aria-label="Filter inquiries" className="relative -mt-5 grid grid-cols-2 gap-2 bg-paper p-2 shadow-[0_16px_50px_rgba(23,56,43,.12)] sm:grid-cols-5">
        {(["all", ...validStatuses] as const).map((item) => {
          const active = (!status && item === "all") || status === item;
          return <Link key={item} href={item === "all" ? "/admin" : `/admin?status=${item}`} style={active ? { color: "#fff" } : undefined} className={`flex min-h-16 items-center justify-between gap-3 border px-4 text-[.68rem] font-bold uppercase tracking-[.1em] transition-colors ${item === "archived" ? "col-span-2 sm:col-span-1" : ""} ${active ? "border-jungle bg-jungle" : "border-ink/12 bg-white text-ink/60 hover:border-jungle"}`}><span>{item}</span><span className={`text-base font-semibold tabular-nums tracking-normal ${active ? "text-white/70" : "text-jungle"}`}>{counts[item]}</span></Link>;
        })}
      </nav>

      <div className="mt-8 flex items-end justify-between gap-4 border-b border-ink/10 pb-4"><div><p className="eyebrow text-cinnamon">Traveller conversations</p><p className="mt-2 text-sm text-ink/50">Showing {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}</p></div></div>
      <div className="mt-4 grid gap-4">
        {inquiries.length === 0 && <div className="border border-dashed border-ink/20 bg-ivory px-6 py-14 text-center md:py-20"><MessageCircle className="mx-auto text-ink/30"/><h2 className="display mt-5 text-3xl text-jungle">No inquiries here.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink/55">New trip requests will appear here as soon as travellers send them.</p></div>}
        {inquiries.map((inquiry) => <div key={inquiry.id}><MobileInquiryCard inquiry={inquiry}/><article className="hidden border border-ink/10 bg-ivory p-7 shadow-[0_12px_40px_rgba(23,56,43,.045)] md:block">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 items-start gap-4"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${inquiry.status === "new" ? "bg-cinnamon" : inquiry.status === "confirmed" ? "bg-tea" : "bg-ink/25"}`}/><div><div className="flex flex-wrap items-center gap-3"><h2 className="display text-3xl leading-none text-jungle">{inquiry.name}</h2><span className="bg-jungle/8 px-2.5 py-1 text-[.62rem] font-bold uppercase tracking-[.12em] text-jungle">{inquiry.type === "planner" ? "Trip plan" : "Contact"}</span></div><p className="mt-2 text-xs text-ink/50">Received {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Colombo" }).format(new Date(inquiry.receivedAt))} · Ref {inquiry.id.slice(0, 8).toUpperCase()}</p></div></div>
            <span className="w-fit border border-ink/15 px-3 py-2 text-[.62rem] font-bold uppercase tracking-[.12em] text-ink/60">{inquiry.status}</span>
          </div>

          <div className="mt-6 grid gap-3 border-y border-ink/10 py-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <a href={`mailto:${inquiry.email}`} className="flex min-w-0 items-center gap-2 hover:text-cinnamon"><Mail size={15} className="shrink-0 text-cinnamon"/><span className="truncate">{inquiry.email}</span></a>
            {inquiry.phone ? <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 hover:text-cinnamon"><Phone size={15} className="text-cinnamon"/>{inquiry.phone}</a> : <span className="flex items-center gap-2 text-ink/35"><Phone size={15}/> No phone</span>}
            <span className="flex items-center gap-2"><MapPin size={15} className="text-cinnamon"/>{readable(inquiry.country)}</span>
            <span className="flex items-center gap-2"><CalendarDays size={15} className="text-cinnamon"/>{readable(inquiry.month || inquiry.timing)}</span>
          </div>

          {inquiry.message && <div className="mt-5"><p className="eyebrow text-ink/40">Traveller&apos;s message</p><p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-ink/75">{inquiry.message}</p></div>}

          {inquiry.type === "planner" && <div className="mt-5 grid gap-x-8 gap-y-4 bg-white/60 p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div><p className="eyebrow text-ink/40">Duration</p><p className="mt-1 capitalize">{readable(inquiry.duration)}</p></div>
            <div><p className="eyebrow text-ink/40">Travellers</p><p className="mt-1 flex items-center gap-2 capitalize"><Users size={14}/>{readable(inquiry.group)}</p></div>
            <div><p className="eyebrow text-ink/40">Pace / stay</p><p className="mt-1 capitalize">{readable(inquiry.pace)} · {readable(inquiry.stay)}</p></div>
            <div><p className="eyebrow text-ink/40">Budget</p><p className="mt-1 capitalize">{readable(inquiry.budget)}</p></div>
            {inquiry.interests.length > 0 && <div className="sm:col-span-2 lg:col-span-4"><p className="eyebrow text-ink/40">Interests</p><p className="mt-1 capitalize">{inquiry.interests.map(readable).join(" · ")}</p></div>}
          </div>}
          <InquiryManager id={inquiry.id} currentStatus={inquiry.status} currentNote={inquiry.adminNote}/>
        </article></div>)}
      </div>
      <PasswordChanger />
    </div>
  </section>;
}
