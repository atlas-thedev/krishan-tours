"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";

type Day = { date: string; route: string; details: string };
type Invoice = {
  number: string; date: string; customer: string; travellers: string; duration: string;
  travelDates: string; mileage: string; packageLabel: string; amount: string; currency: string;
  summary: string; days: Day[];
};

const initialInvoice: Invoice = {
  number: "", date: "", customer: "", travellers: "", duration: "", travelDates: "", mileage: "",
  packageLabel: "Tour package", amount: "", currency: "USD", summary: "",
  days: [{ date: "", route: "", details: "" }],
};

function formatDate(value: string) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function InvoiceMaker() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const controlsRef = useRef<HTMLDivElement>(null);
  const switchView = (view: "edit" | "preview") => {
    setMobileView(view);
    controlsRef.current?.scrollIntoView({ block: "start" });
  };
  const update = (key: keyof Omit<Invoice, "days">, value: string) => setInvoice((current) => ({ ...current, [key]: value }));
  const updateDay = (index: number, key: keyof Day, value: string) => setInvoice((current) => ({ ...current, days: current.days.map((day, i) => i === index ? { ...day, [key]: value } : day) }));
  const amount = Number(invoice.amount);
  const formattedAmount = invoice.amount !== "" && Number.isFinite(amount) ? amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
  const summary = invoice.summary.split("\n").map((line) => line.trim()).filter(Boolean);
  const field = (label: string, key: keyof Omit<Invoice, "days">, type = "text", placeholder = "") => <label className="invoice-field"><span>{label}</span><input type={type} value={invoice[key]} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} {...(type === "number" ? { min: 0, step: "0.01" } : {})} /></label>;

  return <section className="admin-surface invoice-maker">
    <div className={`invoice-controls invoice-mode-${mobileView}`} ref={controlsRef}>
      <header className="invoice-admin-header"><div><Link href="/admin" className="invoice-back">← Back to inquiry desk</Link><p className="invoice-eyebrow">Krishan Tours · Private</p><h1>Invoice maker</h1><p>Create a personalised tour invoice, then print it or save it as a PDF.</p></div><button type="button" className="invoice-print" onClick={() => window.print()}><Printer size={16}/> Print / Save PDF</button></header>
      <div className="invoice-mobile-switch" role="group" aria-label="Invoice view">
        <button type="button" aria-pressed={mobileView === "edit"} onClick={() => switchView("edit")}>Edit invoice</button>
        <button type="button" aria-pressed={mobileView === "preview"} onClick={() => switchView("preview")}>Preview invoice</button>
      </div>
      <div className="invoice-edit-layout">
        <div className="invoice-form">
          <p className="invoice-notice">Your changes stay on this page only. Print or save a PDF before leaving.</p>
          <section className="invoice-form-section"><h2>Invoice details</h2><div className="invoice-fields">{field("Invoice number", "number", "text", "e.g. KT-2026-1048")}{field("Invoice date", "date", "date")}{field("Billed to", "customer", "text", "Traveller name")}{field("Travellers", "travellers", "text", "e.g. 4 People")}</div></section>
          <section className="invoice-form-section"><h2>Tour details</h2><div className="invoice-fields">{field("Duration", "duration", "text", "e.g. 8 Days / 7 Nights")}{field("Travel dates", "travelDates", "text", "e.g. 05 – 12 December 2026")}{field("Mileage", "mileage", "text", "e.g. 1,100 KM")}</div></section>
          <section className="invoice-form-section"><div className="invoice-section-heading"><h2>Itinerary</h2><button type="button" className="invoice-add" onClick={() => setInvoice((current) => ({ ...current, days: [...current.days, { date: "", route: "", details: "" }] }))}><Plus size={15}/> Add day</button></div>
            {invoice.days.map((day, index) => <div className="invoice-day" key={index}><div className="invoice-section-heading"><h3>Day {index + 1}</h3><button type="button" className="invoice-remove" aria-label={`Remove day ${index + 1}`} onClick={() => setInvoice((current) => ({ ...current, days: current.days.filter((_, i) => i !== index) }))}><Trash2 size={15}/> Remove</button></div><div className="invoice-fields"><label className="invoice-field"><span>Date</span><input type="date" value={day.date} onChange={(event) => updateDay(index, "date", event.target.value)}/></label><label className="invoice-field"><span>Route</span><input value={day.route} placeholder="Airport → Colombo" onChange={(event) => updateDay(index, "route", event.target.value)}/></label><label className="invoice-field invoice-field-wide"><span>Details (optional)</span><input value={day.details} placeholder="Airport pick-up and transfer" onChange={(event) => updateDay(index, "details", event.target.value)}/></label></div></div>)}
          </section>
          <section className="invoice-form-section"><h2>Summary &amp; payment</h2><div className="invoice-fields">{field("Package label", "packageLabel")}{field("Amount", "amount", "number", "0.00")}{field("Currency", "currency", "text", "USD")}<label className="invoice-field invoice-field-wide"><span>Tour summary (one point per line)</span><textarea rows={4} value={invoice.summary} placeholder={'Private tour in Sri Lanka.\nMileage included.'} onChange={(event) => update("summary", event.target.value)}/></label></div></section>
        </div>
        <div className="invoice-preview-wrap"><div className="invoice-preview-heading"><div><p className="invoice-eyebrow">Live preview</p><p>Print on A4 with background graphics enabled. The mobile preview adapts to your screen; the PDF keeps the A4 layout.</p></div></div><div className="invoice-preview-scroll"><InvoicePreview invoice={invoice} formattedAmount={formattedAmount} summary={summary}/></div></div>
      </div>
    </div>
  </section>;
}

function InvoicePreview({ invoice, formattedAmount, summary }: { invoice: Invoice; formattedAmount: string; summary: string[] }) {
  return <article className="invoice-page" aria-label="Invoice preview">
    <div className="inv-band"><div className="inv-brand"><svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="64" height="64" rx="12" fill="#17382b" stroke="#2c5a48" strokeWidth="1.5"/><path d="M32 8C20 17 15 27 15 39c0 10 7 16 17 18 10-2 17-8 17-18 0-12-5-22-17-31Z" fill="none" stroke="#f4f0e7" strokeWidth="2"/><path d="M32 15v34M23 30c6 0 9-4 9-10M41 36c-6 0-9-4-9-10" fill="none" stroke="#d6aa4b" strokeWidth="2" strokeLinecap="round"/></svg><div><div className="inv-brand-name">Krishan Tours</div><div className="inv-brand-sub">Sri Lanka · Private Tours &amp; Drivers</div></div></div><div className="inv-title"><div>Invoice</div><p>No. <b>{invoice.number || "—"}</b> · {formatDate(invoice.date)}</p></div></div>
    <div className="inv-body"><div className="inv-meta"><div><div className="inv-label">Billed To</div><strong>{invoice.customer || "Traveller name"}</strong><br/>{invoice.travellers || "—"}</div><div><div className="inv-label">Tour</div><strong>{invoice.duration || "—"}</strong><br/>{invoice.travelDates || "—"}<br/>Private Tour{invoice.mileage && <> · <strong>{invoice.mileage}</strong></>}</div><div><div className="inv-label">From</div><strong>Krishan Tours Sri Lanka</strong><br/>Panadura, Sri Lanka<br/>+94 77 603 9102</div></div>
      <div className="inv-section"><h3><span>01</span> Tour Itinerary</h3><div>{[invoice.duration, invoice.mileage, invoice.travelDates].filter(Boolean).join(" · ")}</div></div>
      <table className="inv-table"><thead><tr><th>Day</th><th>Date</th><th>Route / Tour Details</th></tr></thead><tbody>{invoice.days.map((day, index) => <tr key={index}><td>{index + 1}</td><td>{formatDate(day.date)}</td><td><strong>{day.route || "—"}</strong>{day.details && <div>{day.details}</div>}</td></tr>)}</tbody></table>
      <div className="inv-bottom"><div className="inv-notes"><div className="inv-label">Tour Summary</div>{summary.length ? <ul>{summary.map((line, index) => <li key={index}>{line}</li>)}</ul> : <span>Tour details and inclusions</span>}</div><div className="inv-totals"><div className="inv-trow"><span>{invoice.packageLabel || "Tour package"}</span><strong>{formattedAmount}</strong></div><div className="inv-grand"><span>Total Due</span><strong>{formattedAmount} <small>{invoice.currency || "USD"}</small></strong></div></div></div>
      <div className="inv-signoff"><div><div className="inv-thanks">Thank you for travelling with us.</div><p>We look forward to welcoming you to Sri Lanka.<br/>Questions about this invoice? WhatsApp +94 77 603 9102 · krishan.soysa@yahoo.com</p></div><div className="inv-signature">{/* Signature supplied with the sample invoice. */}<Image src="/images/krishan-signature.png" alt="Krishan's signature" width={220} height={54} unoptimized/><div>Krishan</div><span>Krishan Tours Sri Lanka</span></div></div>
    </div><div className="inv-foot"><span>Krishan Tours Sri Lanka · Panadura, Sri Lanka</span><span><b>krishantourssrilanka.com</b> · +94 77 603 9102</span></div>
  </article>;
}
