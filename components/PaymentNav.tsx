"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { LockKeyhole, CreditCard } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
export function PaymentNav({mobile=false,onNavigate}:{mobile?:boolean;onNavigate?:()=>void}) {
  const {t}=useI18n(); const pathname=usePathname(); const [unlocked,setUnlocked]=useState(false);
  useEffect(()=>{const controller=new AbortController();fetch("/api/payments/status",{cache:"no-store",signal:controller.signal}).then(r=>r.json()).then(s=>setUnlocked(s.unlocked===true)).catch(()=>{});return()=>controller.abort();},[pathname]);
  const label=t("Pay for My Booking");
  const cls=mobile?"flex min-h-14 w-full items-center justify-between border-b border-white/15 py-3.5 text-left":"payment-nav-control flex min-h-11 items-center gap-1.5 whitespace-nowrap text-[.65rem] font-bold uppercase tracking-[.08em]";
  const content=<><span className={mobile?"display text-[clamp(2rem,7.5vw,4rem)] leading-none":""}>{label}</span>{unlocked?<CreditCard size={mobile?18:13}/>:<LockKeyhole size={mobile?18:13}/>}</>;
  return unlocked ? <Link href="/pay-for-booking" onClick={onNavigate} className={cls}>{content}</Link> : <button type="button" disabled aria-label={`${label} — locked`} title="Payments are currently locked" className={`${cls} cursor-not-allowed opacity-60`}>{content}</button>;
}
