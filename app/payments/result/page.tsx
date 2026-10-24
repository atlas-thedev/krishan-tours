import type {Metadata} from "next";
import {PaymentReceipt} from "@/components/PaymentReceipt";
export const metadata:Metadata={title:"Payment status",robots:{index:false,follow:false},referrer:"no-referrer"};
export const dynamic="force-dynamic";
export default async function PaymentResult({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const p=await searchParams;return <div><section className="bg-jungle pb-14 pt-36 text-white"><div className="shell"><p className="eyebrow text-gold">Krishan Tours</p><h1 className="display mt-5 text-6xl md:text-8xl">Your payment.</h1></div></section><section className="bg-ivory px-4 py-12 pb-28"><div className="mx-auto max-w-2xl rounded-xl border border-ink/10 bg-paper p-6 sm:p-8"><PaymentReceipt order={typeof p.order==="string"?p.order:""} cancelled={p.cancelled==="1"}/></div></section></div>;
}
