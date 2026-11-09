"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, ExternalLink, LoaderCircle, MapPin, RotateCcw, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export type PriceUsage = { page: string; path: string; spots: string };
export type EditablePrice = { key: string; group: string; label: string; unit: string; min: number; max?: number; defaultMin: number; defaultMax?: number; hasRange: boolean; updatedAt?: string; usage: PriceUsage[] };
type Draft = Record<string, { min: string; max: string }>;

const usd = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;
const show = (min: string | number, max?: string | number) => { const a = Number(min); const b = max === "" || max == null ? undefined : Number(max); return !a ? "—" : b && b !== a ? `${usd(a)} – ${usd(b)}` : usd(a); };
const when = (iso?: string) => iso ? new Date(iso.includes("T") ? iso : `${iso.replace(" ", "T")}Z`).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

function UsageList({ usage, compact = false }: { usage: PriceUsage[]; compact?: boolean }) {
  if (!usage.length) return null;
  return <ul className={`flex flex-col gap-1.5 ${compact ? "" : "mt-2.5"}`}>
    {usage.map((u) => <li key={u.path + u.spots}><a href={u.path} target="_blank" rel="noreferrer" className="group/u flex items-start gap-2 rounded-lg bg-[#f3efe6] px-2.5 py-2 text-xs leading-5 !text-ink/70 hover:bg-jungle/10">
      <MapPin size={13} className="mt-0.5 shrink-0 text-cinnamon"/>
      <span className="min-w-0 flex-1"><span className="font-semibold !text-jungle">{u.page}</span> <span className="text-ink/40">{u.path}</span><span className="block text-ink/60">{u.spots}</span></span>
      <ExternalLink size={13} className="mt-0.5 shrink-0 text-ink/30 group-hover/u:text-jungle"/>
    </a></li>)}
  </ul>;
}

export function PriceEditor({ prices }: { prices: EditablePrice[] }) {
  const router = useRouter();
  const initial = useMemo<Draft>(() => Object.fromEntries(prices.map((p) => [p.key, { min: String(p.min), max: p.max != null ? String(p.max) : "" }])), [prices]);
  const [draft, setDraft] = useState<Draft>(initial);
  const [filter, setFilter] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [published, setPublished] = useState<{ label: string; from: string; to: string; usage: PriceUsage[] }[]>([]);

  const changed = prices.filter((p) => draft[p.key].min !== initial[p.key].min || draft[p.key].max !== initial[p.key].max);
  const groups = useMemo(() => {
    const term = filter.trim().toLowerCase();
    const map = new Map<string, EditablePrice[]>();
    for (const p of prices) {
      if (term && !`${p.group} ${p.label}`.toLowerCase().includes(term)) continue;
      map.set(p.group, [...(map.get(p.group) || []), p]);
    }
    return [...map.entries()];
  }, [prices, filter]);

  const set = (key: string, field: "min" | "max", value: string) => { setDraft((d) => ({ ...d, [key]: { ...d[key], [field]: value.replace(/[^\d.]/g, "") } })); setState("idle"); };

  async function save(items = changed) {
    const updates = items.map((p) => ({ key: p.key, min: Number(draft[p.key].min), max: draft[p.key].max === "" ? null : Number(draft[p.key].max) }));
    const invalid = updates.find((u) => !Number.isFinite(u.min) || u.min <= 0 || (u.max != null && (!Number.isFinite(u.max) || u.max < u.min)));
    if (invalid) { setState("error"); setMessage("Check the highlighted price: the first amount must be above 0 and the second must not be lower."); return; }
    setState("saving");
    try {
      const response = await fetch("/api/admin/prices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ updates }) });
      const result = await response.json() as { ok: boolean; message?: string };
      if (!response.ok) throw new Error(result.message || "Could not save prices.");
      const pages = new Set(items.flatMap((p) => p.usage.map((u) => u.path)));
      setPublished(items.map((p) => ({ label: `${p.group} · ${p.label}`, from: show(p.min, p.max), to: show(draft[p.key].min, draft[p.key].max), usage: p.usage })));
      setState("saved"); setMessage(`${updates.length} price${updates.length === 1 ? "" : "s"} live on ${pages.size} page${pages.size === 1 ? "" : "s"} in all 12 languages.`);
      router.refresh();
    } catch (reason) { setState("error"); setMessage(reason instanceof Error ? reason.message : "Could not save prices."); }
  }

  async function reset(p: EditablePrice) {
    setState("saving");
    const response = await fetch("/api/admin/prices", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: p.key }) });
    if (response.ok) {
      setDraft((d) => ({ ...d, [p.key]: { min: String(p.defaultMin), max: p.defaultMax != null ? String(p.defaultMax) : "" } }));
      setState("saved"); setMessage(`${p.label} reset to default.`); router.refresh();
    } else { setState("error"); setMessage("Could not reset this price."); }
  }

  return <div>
    <label className="relative block"><span className="sr-only">Find a price</span><Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"/><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Find a price, e.g. Galle, van, 10-day…" className="min-h-12 w-full rounded-xl border border-ink/15 bg-white pl-11 pr-4 text-sm outline-none focus:border-cinnamon"/></label>

    {state === "saved" && published.length > 0 && <section className="mt-4 rounded-2xl border border-jungle/20 bg-white p-4 md:p-5">
      <div className="flex items-start justify-between gap-3"><p className="flex items-center gap-2 text-sm font-semibold text-jungle"><Check size={16} className="text-green-700"/>Published — check it live:</p><button type="button" onClick={() => setPublished([])} className="text-xs text-ink/45">Hide</button></div>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">{published.map((item) => <li key={item.label} className="rounded-xl border border-ink/10 p-3">
        <p className="text-xs font-semibold text-ink">{item.label}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm"><span className="text-ink/45 line-through">{item.from}</span><ArrowRight size={13}/><span className="font-bold text-jungle">{item.to}</span></p>
        <div className="mt-2"><UsageList usage={item.usage} compact/></div>
      </li>)}</ul>
    </section>}

    <div className="mt-4 grid gap-3">
      {groups.map(([group, items]) => <details key={group} open={!!filter || group === groups[0][0]} className="group overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-4 marker:hidden md:px-5 [&::-webkit-details-marker]:hidden">
          <span><span className="block text-base font-semibold text-jungle">{group}</span><span className="text-xs text-ink/45">{items.length} price{items.length === 1 ? "" : "s"}</span></span>
          <ChevronDown size={18} className="text-ink/40 transition-transform group-open:rotate-180"/>
        </summary>
        <ul className="divide-y divide-ink/8 border-t border-ink/10">
          {items.map((p) => {
            const d = draft[p.key];
            const isChanged = d.min !== initial[p.key].min || d.max !== initial[p.key].max;
            const custom = p.min !== p.defaultMin || p.max !== p.defaultMax;
            const bad = Number(d.min) <= 0 || (d.max !== "" && Number(d.max) < Number(d.min));
            return <li key={p.key} className={`grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center md:px-5 ${isChanged ? "bg-gold/10" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{p.label}</p>
                <p className="mt-0.5 text-xs text-ink/50">{p.unit} · default {show(p.defaultMin, p.defaultMax)}{custom && p.updatedAt ? ` · changed ${when(p.updatedAt)}` : ""}</p>
                {isChanged && !bad && <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 rounded-lg bg-gold/25 px-2.5 py-1 text-xs font-semibold text-jungle"><span className="text-ink/50 line-through">{show(initial[p.key].min, initial[p.key].max)}</span><ArrowRight size={12}/>{show(d.min, d.max)} <span className="font-normal text-ink/55">— not published yet</span></p>}
                <details className="mt-2 [&_summary::-webkit-details-marker]:hidden" open={isChanged}>
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-cinnamon"><MapPin size={12}/>Shown on {p.usage.length} place{p.usage.length === 1 ? "" : "s"}</summary>
                  <UsageList usage={p.usage}/>
                </details>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative flex-1 md:w-28 md:flex-none"><span className="sr-only">{p.hasRange ? "From" : "Price"}</span><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">$</span><input inputMode="decimal" value={d.min} onChange={(e) => set(p.key, "min", e.target.value)} aria-invalid={bad} className={`min-h-12 w-full rounded-xl border bg-white pl-7 pr-2 text-base tabular-nums outline-none focus:border-cinnamon ${bad ? "border-red-500" : "border-ink/15"}`}/></label>
                {p.hasRange && <><span className="text-ink/35">–</span><label className="relative flex-1 md:w-28 md:flex-none"><span className="sr-only">To</span><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">$</span><input inputMode="decimal" value={d.max} onChange={(e) => set(p.key, "max", e.target.value)} aria-invalid={bad} placeholder="—" className={`min-h-12 w-full rounded-xl border bg-white pl-7 pr-2 text-base tabular-nums outline-none focus:border-cinnamon ${bad ? "border-red-500" : "border-ink/15"}`}/></label></>}
                <button type="button" onClick={() => reset(p)} disabled={!custom} title="Reset to default" aria-label={`Reset ${p.label} to default`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink/15 text-ink/50 disabled:opacity-25"><RotateCcw size={16}/></button>
              </div>
            </li>;
          })}
        </ul>
      </details>)}
      {groups.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-sm text-ink/50">No prices match “{filter}”.</p>}
    </div>

    <div className={`fixed inset-x-0 bottom-16 z-30 px-4 pb-3 transition-transform md:bottom-0 md:pb-6 ${changed.length || state === "saved" || state === "error" ? "translate-y-0" : "translate-y-[150%]"}`}>
      <div className="mx-auto flex max-w-3xl flex-col gap-2 rounded-2xl bg-jungle p-3 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:pl-5">
        <p role="status" className={`text-sm ${state === "error" ? "text-red-200" : "text-white/80"}`}>{message && state !== "idle" ? message : `${changed.length} unsaved change${changed.length === 1 ? "" : "s"}`}</p>
        <div className="flex gap-2">
          {changed.length > 0 && <button type="button" onClick={() => { setDraft(initial); setState("idle"); }} className="min-h-11 flex-1 rounded-xl border border-white/25 px-4 text-xs font-bold uppercase tracking-[.08em]">Discard</button>}
          <button type="button" onClick={() => save()} disabled={!changed.length || state === "saving"} className="flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gold px-4 text-xs font-bold uppercase tracking-[.08em] text-jungle disabled:opacity-50">{state === "saving" ? <LoaderCircle size={15} className="animate-spin"/> : <Check size={15}/>}Publish prices</button>
        </div>
      </div>
    </div>
  </div>;
}
