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
  const cls=mobile?"payment-nav-control payment-nav-mobile":"payment-nav-control";
  const content=<><span>{label}</span>{unlocked?<CreditCard size={17}/>:<LockKeyhole size={17}/>}</>;
  return unlocked ? <Link href="/pay-for-booking" onClick={onNavigate} className={cls}>{content}</Link> : <button type="button" disabled aria-label={`${label} — locked`} title="Payments are currently locked" className={cls}>{content}</button>;
}
