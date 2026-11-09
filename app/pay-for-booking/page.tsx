import type { Metadata } from "next";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { paymentsUnlocked, getPaymentSettings, ready } from "@/lib/payments";
import { BookingPaymentForm } from "@/components/BookingPaymentForm";
import { whatsappUrl } from "@/lib/site";
export const metadata:Metadata={title:"Pay for My Booking",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function BookingPaymentPage(){
  const unlocked=await paymentsUnlocked();const s=unlocked?getPaymentSettings():null;const available=!!s&&ready(s);
  return <div><section className="bg-jungle pb-16 pt-36 text-white"><div className="shell"><p className="eyebrow text-gold">Krishan Tours · Booking payments</p><h1 className="display mt-5 max-w-3xl text-6xl leading-none md:text-8xl">Pay for <em>my booking.</em></h1><p className="mt-6 max-w-xl text-base leading-7 text-white/75">A secure payment for the journey you have planned with Krishan.</p></div></section>
    <section className="bg-ivory px-4 py-12 pb-28 md:py-20"><div className="mx-auto max-w-2xl rounded-xl border border-ink/10 bg-paper p-5 sm:p-8">
      {available&&s?<BookingPaymentForm currency={s.currency} mode={s.mode}/>:<div className="py-8"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-jungle/10 text-jungle">{unlocked?<ShieldCheck/>:<LockKeyhole/>}</div><h2 className="display text-4xl text-jungle">{unlocked?"Payment preview unlocked":"Payments are locked"}</h2><p className="mt-5 text-base leading-7 text-ink/70">{unlocked?"This browser is unlocked, but checkout is not enabled and configured yet. No payment can be taken. Please contact Krishan if you need help with your booking.":"Online booking payments are not publicly available yet. Please contact Krishan for payment arrangements."}</p><a className="btn-primary mt-7" href={whatsappUrl()}>Contact Krishan</a></div>}
    </div></section></div>;
}
