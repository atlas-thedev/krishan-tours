import Link from "next/link";
import { BadgeDollarSign, ExternalLink, Inbox, Map, Settings } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

const tabs = [
  { key: "inquiries", href: "/admin", label: "Inquiries", icon: Inbox },
  { key: "prices", href: "/admin/prices", label: "Prices", icon: BadgeDollarSign },
  { key: "trips", href: "/admin/trips", label: "Trips", icon: Map },
  { key: "settings", href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export type AdminTab = (typeof tabs)[number]["key"];

export function AdminShell({ active, title, subtitle, badge, children }: { active: AdminTab; title: string; subtitle?: string; badge?: number; children: React.ReactNode }) {
  return <div className="admin-surface min-h-screen bg-[#f3efe6] pb-28 md:pb-16">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-jungle text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <Link href="/admin" className="flex items-baseline gap-2"><span className="display text-2xl leading-none">Krishan Tours</span><span className="hidden text-[.6rem] font-bold uppercase tracking-[.16em] text-gold sm:inline">Admin</span></Link>
        <nav aria-label="Admin sections" className="hidden items-center gap-1 md:flex">
          {tabs.map(({ key, href, label, icon: Icon }) => <Link key={key} href={href} aria-current={active === key ? "page" : undefined} className={`relative flex h-10 items-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[.08em] transition-colors ${active === key ? "bg-white text-jungle" : "text-white/70 hover:bg-white/10 hover:text-white"}`}><Icon size={15}/>{label}{key === "inquiries" && badge ? <span className="ml-1 rounded-full bg-cinnamon px-1.5 py-0.5 text-[.6rem] text-white">{badge}</span> : null}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="hidden h-10 items-center gap-1.5 rounded-full border border-white/25 px-3 text-[.65rem] font-bold uppercase tracking-[.08em] text-white/80 hover:bg-white/10 sm:flex"><ExternalLink size={13}/>View site</a>
          <LogoutButton />
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-10">
      <h1 className="display text-4xl leading-none text-jungle md:text-6xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">{subtitle}</p>}
      <div className="mt-6 md:mt-8">{children}</div>
    </div>

    <nav aria-label="Admin sections" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {tabs.map(({ key, href, label, icon: Icon }) => <Link key={key} href={href} aria-current={active === key ? "page" : undefined} className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-[.62rem] font-bold uppercase tracking-[.06em] ${active === key ? "text-jungle" : "text-ink/45"}`}>
        {active === key && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-cinnamon"/>}
        <Icon size={20}/>{label}
        {key === "inquiries" && badge ? <span className="absolute right-[calc(50%-1.4rem)] top-2 rounded-full bg-cinnamon px-1.5 text-[.55rem] leading-4 text-white">{badge}</span> : null}
      </Link>)}
    </nav>
  </div>;
}
