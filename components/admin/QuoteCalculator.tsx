"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Delete, MessageCircle, Plus, RotateCcw, Trash2 } from "lucide-react";

export type QuotePreset = { key: string; group: string; label: string; unit: string; min: number; max?: number };
type Line = { id: number; label: string; price: string; qty: string };

const field = "h-12 w-full rounded-xl border border-ink/15 bg-white px-3 text-base text-ink outline-none focus:border-jungle focus:ring-2 focus:ring-jungle/15";
const num = (value: string) => { const n = Number(String(value).replace(/,/g, "")); return Number.isFinite(n) ? n : 0; };
const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const lkr = (n: number) => `LKR ${Math.round(n).toLocaleString("en-US")}`;

/** Tiny safe arithmetic evaluator (+ − × ÷ %, parentheses). No eval(). */
function evaluate(expression: string): number | null {
  const tokens = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").match(/\d*\.?\d+|[-+*/%()]/g);
  if (!tokens) return null;
  let i = 0;
  const peek = () => tokens[i];
  const factor = (): number => {
    const token = tokens[i++];
    if (token === "-") return -factor();
    if (token === "(") { const value = expr(); i++; return value; }
    const value = Number(token);
    if (!Number.isFinite(value)) throw new Error("bad");
    if (peek() === "%") { i++; return value / 100; }
    return value;
  };
  const term = (): number => { let value = factor(); while (peek() === "*" || peek() === "/") { const op = tokens[i++]; const rhs = factor(); value = op === "*" ? value * rhs : value / rhs; } return value; };
  const expr = (): number => { let value = term(); while (peek() === "+" || peek() === "-") { const op = tokens[i++]; const rhs = term(); value = op === "+" ? value + rhs : value - rhs; } return value; };
  try { const value = expr(); return i === tokens.length && Number.isFinite(value) ? Math.round(value * 1e6) / 1e6 : null; } catch { return null; }
}

function Keypad() {
  const [input, setInput] = useState("");
  const [last, setLast] = useState<string | null>(null);
  const result = evaluate(input);
  const press = (key: string) => {
    if (key === "C") { setInput(""); setLast(null); return; }
    if (key === "⌫") { setInput((v) => v.slice(0, -1)); return; }
    if (key === "=") { if (result !== null) { setLast(`${input} =`); setInput(String(result)); } return; }
    setInput((v) => v + key);
  };
  const keys = ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "%", "0", ".", "="];
  return <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
    <h2 className="text-xs font-bold uppercase tracking-[.14em] text-ink/50">Quick calculator</h2>
    <div className="mt-3 rounded-xl bg-[#f3efe6] px-4 py-3 text-right">
      <div className="h-4 text-xs text-ink/45">{last}</div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") press("="); }} inputMode="decimal" aria-label="Calculation" placeholder="0" className="w-full bg-transparent text-right text-3xl font-semibold tabular-nums text-jungle outline-none"/>
      <div className="h-5 text-sm tabular-nums text-ink/55">{result !== null && input && String(result) !== input ? `= ${result.toLocaleString("en-US")}` : ""}</div>
    </div>
    <div className="mt-3 grid grid-cols-4 gap-2">
      {keys.map((key) => <button key={key} type="button" onClick={() => press(key)} className={`h-14 rounded-xl text-xl font-semibold transition active:scale-95 ${key === "=" ? "bg-cinnamon text-white" : /[÷×−+]/.test(key) ? "bg-jungle text-white" : key === "C" ? "bg-ink/10 text-cinnamon" : "bg-[#f3efe6] text-ink"}`}>{key}</button>)}
      <button type="button" onClick={() => press("⌫")} className="col-span-4 flex h-11 items-center justify-center gap-2 rounded-xl border border-ink/10 text-sm font-semibold text-ink/60"><Delete size={16}/>Backspace</button>
    </div>
  </section>;
}

export function QuoteCalculator({ presets, whatsapp }: { presets: QuotePreset[]; whatsapp: string }) {
  const [lines, setLines] = useState<Line[]>([{ id: 1, label: "AC sedan with driver", price: String(presets.find((p) => p.key === "driver.sedan")?.min ?? 55), qty: "7" }]);
  const [guests, setGuests] = useState("2");
  const [discount, setDiscount] = useState("0");
  const [rate, setRate] = useState("300");
  const [client, setClient] = useState("");
  const [copied, setCopied] = useState(false);

  // Restore the last exchange rate after hydration (localStorage is browser-only).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const saved = localStorage.getItem("kt_lkr_rate"); if (saved) setRate(saved); }, []);
  useEffect(() => { localStorage.setItem("kt_lkr_rate", rate); }, [rate]);

  const groups = useMemo(() => [...new Set(presets.map((p) => p.group))], [presets]);
  const subtotal = lines.reduce((sum, line) => sum + num(line.price) * num(line.qty || "1"), 0);
  const discountAmount = subtotal * Math.min(100, Math.max(0, num(discount))) / 100;
  const total = subtotal - discountAmount;
  const perPerson = num(guests) > 0 ? total / num(guests) : total;
  const lkrTotal = total * num(rate);

  const update = (id: number, patch: Partial<Line>) => setLines((all) => all.map((line) => line.id === id ? { ...line, ...patch } : line));
  const add = (preset?: QuotePreset) => setLines((all) => [...all, { id: Date.now(), label: preset ? `${preset.group === "Airport transfers" ? "Transfer: " : ""}${preset.label}` : "", price: preset ? String(preset.min) : "", qty: "1" }]);

  const quote = [
    `Krishan Tours Sri Lanka – quote${client ? ` for ${client}` : ""}`,
    "",
    ...lines.filter((l) => num(l.price)).map((l) => `• ${l.label || "Item"}: ${num(l.qty || "1")} × ${usd(num(l.price))} = ${usd(num(l.price) * num(l.qty || "1"))}`),
    "",
    ...(discountAmount ? [`Subtotal: ${usd(subtotal)}`, `Discount (${num(discount)}%): −${usd(discountAmount)}`] : []),
    `Total: ${usd(total)} (≈ ${lkr(lkrTotal)})`,
    ...(num(guests) > 1 ? [`Per person (${num(guests)} guests): ${usd(perPerson)}`] : []),
  ].join("\n");

  async function copy() {
    await navigator.clipboard.writeText(quote);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  }

  return <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
    <div className="space-y-5">
      <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[.14em] text-ink/50">Trip quote</h2>
          <button type="button" onClick={() => { setLines([]); setDiscount("0"); setClient(""); }} className="flex items-center gap-1 text-xs font-semibold text-ink/50"><RotateCcw size={13}/>Clear</button>
        </div>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Guest name (optional)" className={`${field} mt-3`}/>
        <select value="" onChange={(e) => { const p = presets.find((x) => x.key === e.target.value); if (p) add(p); }} className={`${field} mt-3 font-semibold text-jungle`} aria-label="Add from price list">
          <option value="">+ Add from your price list…</option>
          {groups.map((group) => <optgroup key={group} label={group}>{presets.filter((p) => p.group === group).map((p) => <option key={p.key} value={p.key}>{p.label} — {usd(p.min)}{p.max ? `–${usd(p.max)}` : ""} {p.unit}</option>)}</optgroup>)}
        </select>

        <ul className="mt-4 space-y-3">
          {lines.map((line) => <li key={line.id} className="rounded-xl border border-ink/10 bg-[#faf8f3] p-3">
            <div className="flex gap-2">
              <input value={line.label} onChange={(e) => update(line.id, { label: e.target.value })} placeholder="Item (e.g. Hotel, entrance tickets)" className={`${field} h-11 text-sm`}/>
              <button type="button" onClick={() => setLines((all) => all.filter((l) => l.id !== line.id))} aria-label="Remove line" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink/40 hover:bg-cinnamon/10 hover:text-cinnamon"><Trash2 size={17}/></button>
            </div>
            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <label className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">$</span><input value={line.price} onChange={(e) => update(line.id, { price: e.target.value })} inputMode="decimal" aria-label="Unit price" placeholder="Price" className={`${field} h-11 pl-7 tabular-nums`}/></label>
              <span className="text-ink/40">×</span>
              <label className="relative"><input value={line.qty} onChange={(e) => update(line.id, { qty: e.target.value })} inputMode="decimal" aria-label="Quantity (days, people…)" placeholder="Qty" className={`${field} h-11 tabular-nums`}/><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[.65rem] uppercase tracking-wider text-ink/35">qty</span></label>
            </div>
            <div className="mt-2 text-right text-sm font-semibold tabular-nums text-jungle">{usd(num(line.price) * num(line.qty || "1"))}</div>
          </li>)}
        </ul>
        <button type="button" onClick={() => add()} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-jungle/40 text-sm font-bold text-jungle"><Plus size={16}/>Add custom item</button>
      </section>

      <section className="grid grid-cols-3 gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <label className="text-[.65rem] font-bold uppercase tracking-[.1em] text-ink/50">Guests<input value={guests} onChange={(e) => setGuests(e.target.value)} inputMode="numeric" className={`${field} mt-1 tabular-nums`}/></label>
        <label className="text-[.65rem] font-bold uppercase tracking-[.1em] text-ink/50">Discount %<input value={discount} onChange={(e) => setDiscount(e.target.value)} inputMode="decimal" className={`${field} mt-1 tabular-nums`}/></label>
        <label className="text-[.65rem] font-bold uppercase tracking-[.1em] text-ink/50">1 USD = LKR<input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className={`${field} mt-1 tabular-nums`}/></label>
      </section>
    </div>

    <div className="space-y-5 lg:sticky lg:top-24">
      <section className="rounded-2xl bg-jungle p-5 text-white shadow-sm">
        <div className="text-xs font-bold uppercase tracking-[.14em] text-white/60">Total</div>
        <div className="display mt-1 text-5xl tabular-nums">{usd(total)}</div>
        <div className="mt-1 text-sm tabular-nums text-white/70">≈ {lkr(lkrTotal)}</div>
        <dl className="mt-4 space-y-1.5 border-t border-white/15 pt-4 text-sm tabular-nums">
          <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd>{usd(subtotal)}</dd></div>
          {discountAmount > 0 && <div className="flex justify-between"><dt className="text-white/60">Discount</dt><dd>−{usd(discountAmount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-white/60">Per person ({num(guests) || 1})</dt><dd className="font-semibold text-gold">{usd(perPerson)}</dd></div>
        </dl>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={copy} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white/10 text-xs font-bold uppercase tracking-[.08em]"><Copy size={15}/>{copied ? "Copied" : "Copy"}</button>
          <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(quote)}`} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-cinnamon text-xs font-bold uppercase tracking-[.08em] !text-white"><MessageCircle size={15}/>WhatsApp</a>
        </div>
        <p className="mt-2 text-[.7rem] leading-5 text-white/50">WhatsApp opens with the quote ready — choose the guest’s chat to send it.</p>
      </section>
      <Keypad/>
    </div>
  </div>;
}
