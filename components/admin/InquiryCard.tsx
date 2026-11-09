import { CalendarDays, ChevronDown, Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import { localeNames, type Locale } from "@/lib/i18n/config";
import type { InquiryRecord } from "@/lib/inquiries-db";
import { InquiryManager } from "@/components/admin/InquiryManager";

const readable = (value: string) => (value ? value.replaceAll("-", " ") : "—");
const statusStyle: Record<string, string> = {
  new: "bg-cinnamon text-white",
  contacted: "bg-gold/30 text-jungle",
  confirmed: "bg-tea text-white",
  archived: "bg-ink/10 text-ink/60",
};

function waLink(phone: string, name: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 8) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Hello ${name.split(" ")[0]}, this is Krishan from Krishan Tours Sri Lanka. Thank you for your inquiry!`)}`;
}

export function InquiryCard({ inquiry, open = false }: { inquiry: InquiryRecord; open?: boolean }) {
  const received = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" }).format(new Date(inquiry.receivedAt));
  const wa = inquiry.phone ? waLink(inquiry.phone, inquiry.name) : "";
  return <details open={open} className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_8px_30px_rgba(23,56,43,.06)]">
    <summary className="flex min-h-20 cursor-pointer list-none items-center gap-3 p-4 marker:hidden md:p-5 [&::-webkit-details-marker]:hidden">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-jungle/8 text-sm font-bold uppercase text-jungle">{inquiry.name.trim().slice(0, 2)}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate text-base font-semibold text-ink md:text-lg">{inquiry.name}</span>
          <span className={`rounded-full px-2 py-0.5 text-[.58rem] font-bold uppercase tracking-[.08em] ${statusStyle[inquiry.status]}`}>{inquiry.status}</span>
          {inquiry.language && inquiry.language !== "en" && <span title={localeNames[inquiry.language as Locale] || inquiry.language} className="rounded-full bg-gold/25 px-2 py-0.5 text-[.58rem] font-bold uppercase tracking-[.08em] text-jungle">{localeNames[inquiry.language as Locale] || inquiry.language}</span>}
          {inquiry.type === "planner" && <span className="rounded-full border border-jungle/20 px-2 py-0.5 text-[.58rem] font-bold uppercase tracking-[.08em] text-jungle">Trip plan</span>}
        </span>
        <span className="mt-1 block truncate text-xs text-ink/50">{received} · {readable(inquiry.month || inquiry.timing || inquiry.duration)} · Ref {inquiry.id.slice(0, 6).toUpperCase()}</span>
      </span>
      <ChevronDown size={18} className="shrink-0 text-ink/40 transition-transform group-open:rotate-180"/>
    </summary>

    <div className="border-t border-ink/10 p-4 md:p-5">
      <div className="grid grid-cols-3 gap-2">
        {wa ? <a href={wa} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1f7a4d] text-xs font-bold !text-white"><MessageCircle size={16}/>WhatsApp</a> : <span className="flex min-h-12 items-center justify-center rounded-xl bg-ink/5 text-xs !text-ink/35">No WhatsApp</span>}
        {inquiry.phone ? <a href={`tel:${inquiry.phone}`} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/15 text-xs font-bold !text-jungle"><Phone size={16}/>Call</a> : <span className="flex min-h-12 items-center justify-center rounded-xl bg-ink/5 text-xs !text-ink/35">No phone</span>}
        <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent("Your Sri Lanka trip – Krishan Tours")}`} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/15 text-xs font-bold !text-jungle"><Mail size={16}/>Email</a>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex min-w-0 items-center gap-2"><Mail size={15} className="shrink-0 text-cinnamon"/><span className="truncate">{inquiry.email}</span></div>
        <div className="flex items-center gap-2"><Phone size={15} className="shrink-0 text-cinnamon"/>{inquiry.phone || "—"}</div>
        <div className="flex items-center gap-2 capitalize"><MapPin size={15} className="shrink-0 text-cinnamon"/>{readable(inquiry.country)}</div>
        <div className="flex items-center gap-2 capitalize"><CalendarDays size={15} className="shrink-0 text-cinnamon"/>{readable(inquiry.month || inquiry.timing)}</div>
      </dl>

      {inquiry.message && <div className="mt-4 rounded-xl bg-paper p-4"><div className="flex items-center justify-between gap-2"><p className="text-[.62rem] font-bold uppercase tracking-[.1em] text-ink/45">Message{inquiry.page ? ` · sent from ${inquiry.page}` : ""}</p><a href={`https://translate.google.com/?sl=auto&tl=en&op=translate&text=${encodeURIComponent(inquiry.message)}`} target="_blank" rel="noreferrer" className="text-[.65rem] font-bold uppercase tracking-[.08em] !text-cinnamon">Translate</a></div><p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-ink/80">{inquiry.message}</p></div>}

      {inquiry.type === "planner" && <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-paper p-4 text-sm lg:grid-cols-5">
        {[["Duration", inquiry.duration], ["Travellers", inquiry.group], ["Pace", inquiry.pace], ["Stay", inquiry.stay], ["Budget", inquiry.budget]].map(([label, value]) => <div key={label}><p className="text-[.62rem] font-bold uppercase tracking-[.1em] text-ink/45">{label === "Travellers" ? <span className="inline-flex items-center gap-1"><Users size={11}/>{label}</span> : label}</p><p className="mt-1 capitalize">{readable(value)}</p></div>)}
        {inquiry.interests.length > 0 && <div className="col-span-2 lg:col-span-5"><p className="text-[.62rem] font-bold uppercase tracking-[.1em] text-ink/45">Interests</p><div className="mt-1.5 flex flex-wrap gap-1.5">{inquiry.interests.map((item) => <span key={item} className="rounded-full bg-white px-2.5 py-1 text-xs capitalize">{readable(item)}</span>)}</div></div>}
      </div>}

      <InquiryManager id={inquiry.id} currentStatus={inquiry.status} currentNote={inquiry.adminNote}/>
    </div>
  </details>;
}
