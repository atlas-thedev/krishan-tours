"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
export function BookingPaymentForm({currency,mode}:{currency:"USD"|"LKR";mode:"sandbox"|"live"}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setError("");
    const data=Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response=await fetch("/api/payments/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,confirmed:data.confirmed==="on"})});
      const result=await response.json();if(!response.ok)throw new Error(result.message||"Could not prepare checkout.");
      if(!["https://sandbox.payhere.lk/pay/checkout","https://www.payhere.lk/pay/checkout"].includes(result.action))throw new Error("Invalid payment destination.");
      const form=document.createElement("form");form.method="POST";form.action=result.action;
      for(const [name,value] of Object.entries(result.fields)){const field=document.createElement("input");field.type="hidden";field.name=name;field.value=String(value);form.appendChild(field)}
      document.body.appendChild(form);form.submit();
    } catch(e){setError(e instanceof Error?e.message:"Please try again.");setBusy(false)}
  }
  const input="mt-2 min-h-12 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-base text-ink focus:border-jungle";
  return <form onSubmit={submit} className="space-y-6">
    {mode==="sandbox"&&<div className="rounded-lg border border-gold bg-gold/15 p-4 text-sm leading-6 text-ink"><strong>Sandbox test mode.</strong> No real money is collected. Use only PayHere sandbox test details on the next page.</div>}
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-semibold">Booking reference<input className={input} name="booking_reference" required minLength={2} maxLength={80} placeholder="Reference provided by Krishan"/></label>
      <label className="text-sm font-semibold">Amount ({currency})<input className={input} name="amount" type="number" inputMode="decimal" min={currency==="USD"?1:100} max={currency==="USD"?50000:1000000} step="0.01" required placeholder="Agreed amount"/></label>
      <label className="text-sm font-semibold">First name<input className={input} name="first_name" autoComplete="given-name" maxLength={60} required/></label>
      <label className="text-sm font-semibold">Last name<input className={input} name="last_name" autoComplete="family-name" maxLength={60} required/></label>
      <label className="text-sm font-semibold">Email<input className={input} name="email" type="email" autoComplete="email" maxLength={254} required/></label>
      <label className="text-sm font-semibold">Phone<input className={input} name="phone" type="tel" autoComplete="tel" minLength={7} maxLength={30} required/></label>
      <label className="text-sm font-semibold sm:col-span-2">Billing address<input className={input} name="address" autoComplete="street-address" minLength={2} maxLength={160} required/></label>
      <label className="text-sm font-semibold">City<input className={input} name="city" autoComplete="address-level2" minLength={2} maxLength={80} required/></label>
      <label className="text-sm font-semibold">Country<input className={input} name="country" autoComplete="country-name" minLength={2} maxLength={80} required/></label>
    </div>
    <p className="text-sm leading-6 text-ink/65">Pay only the amount agreed with Krishan for your booking. A payment receipt does not, by itself, confirm the whole booking or that its full balance is paid.</p>
    <label className="flex min-h-12 items-start gap-3 text-sm leading-6"><input type="checkbox" name="confirmed" required className="mt-1 h-5 w-5 shrink-0 accent-[#17382b]"/><span>I have checked my booking reference, currency and agreed payment amount, and have read the <a className="underline" href="/terms">terms</a> and <a className="underline" href="/privacy">privacy policy</a>.</span></label>
    {error&&<p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    <button disabled={busy} className="btn-primary w-full disabled:opacity-50">{busy?"Preparing secure checkout…":mode==="sandbox"?"Continue to sandbox checkout":"Continue to secure payment"}<ArrowUpRight size={16}/></button>
    <p className="flex items-center gap-2 text-sm text-ink/65"><ShieldCheck size={18} className="shrink-0"/>Card details are entered only on PayHere’s secure checkout.</p>
  </form>;
}
