"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Eye, EyeOff, LoaderCircle, Pin } from "lucide-react";
import { useRouter } from "next/navigation";

export type ManagedTrip = { slug: string; name: string; list: string; duration: number; href: string; pinned: boolean; hidden: boolean; fromPrice: string; priceKey?: string };

export function TripManager({ initial }: { initial: ManagedTrip[] }) {
  const router = useRouter();
  const [trips, setTrips] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const dirty = JSON.stringify(trips) !== JSON.stringify(initial);
  const lists = [...new Set(trips.map((t) => t.list))];

  const update = (slug: string, patch: Partial<ManagedTrip>) => { setTrips((all) => all.map((t) => t.slug === slug ? { ...t, ...patch } : t)); setState("idle"); };
  function move(slug: string, delta: number) {
    setTrips((all) => {
      const list = all.find((t) => t.slug === slug)!.list;
      const group = all.filter((t) => t.list === list);
      const index = group.findIndex((t) => t.slug === slug);
      const target = index + delta;
      if (target < 0 || target >= group.length) return all;
      [group[index], group[target]] = [group[target], group[index]];
      return [...all.filter((t) => t.list !== list), ...group].sort((a, b) => lists.indexOf(a.list) - lists.indexOf(b.list));
    });
    setState("idle");
  }

  async function save() {
    const bad = trips.find((t) => t.fromPrice !== "" && !(Number(t.fromPrice) > 0));
    if (bad) { setState("error"); setMessage(`Check the price for ${bad.name}.`); return; }
    setState("saving");
    try {
      const payload = trips.map((t) => ({ slug: t.slug, pinned: t.pinned, hidden: t.hidden, sortOrder: trips.filter((x) => x.list === t.list).indexOf(t) + 1, fromPrice: t.fromPrice === "" ? null : Number(t.fromPrice), priceKey: t.priceKey }));
      const response = await fetch("/api/admin/trips", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trips: payload }) });
      if (!response.ok) throw new Error();
      setState("saved"); setMessage("Trip order, visibility and prices are live."); router.refresh();
    } catch { setState("error"); setMessage("Could not save. Please try again."); }
  }

  return <div className="grid gap-6">
    {lists.map((list) => <section key={list}>
      <h2 className="text-[.65rem] font-bold uppercase tracking-[.12em] text-ink/50">{list}</h2>
      <ol className="mt-2 grid gap-2">
        {trips.filter((t) => t.list === list).map((t, index, group) => <li key={t.slug} className={`rounded-2xl border bg-white p-4 shadow-[0_6px_24px_rgba(23,56,43,.05)] ${t.pinned ? "border-gold" : "border-ink/10"} ${t.hidden ? "opacity-60" : ""}`}>
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => move(t.slug, -1)} disabled={index === 0} aria-label={`Move ${t.name} up`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 disabled:opacity-25"><ArrowUp size={15}/></button>
              <button type="button" onClick={() => move(t.slug, 1)} disabled={index === group.length - 1} aria-label={`Move ${t.name} down`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 disabled:opacity-25"><ArrowDown size={15}/></button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold tabular-nums text-cinnamon">#{index + 1}</span><a href={t.href} target="_blank" rel="noreferrer" className="truncate text-base font-semibold text-jungle underline-offset-2 hover:underline">{t.name}</a>{t.pinned && <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[.58rem] font-bold uppercase tracking-[.08em] text-jungle">Pinned to top</span>}{t.hidden && <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[.58rem] font-bold uppercase tracking-[.08em]">Hidden</span>}</p>
              <p className="mt-0.5 text-xs text-ink/50">{t.duration} days</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <label className="relative"><span className="sr-only">From price per person</span><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">From $</span><input inputMode="decimal" value={t.fromPrice} onChange={(e) => update(t.slug, { fromPrice: e.target.value.replace(/[^\d.]/g, "") })} placeholder="price on request" className="min-h-11 w-full rounded-xl border border-ink/15 bg-white pl-[3.75rem] pr-16 text-base tabular-nums outline-none focus:border-cinnamon"/><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40">/ person</span></label>
                <button type="button" onClick={() => update(t.slug, { pinned: !t.pinned })} aria-pressed={t.pinned} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold ${t.pinned ? "border-gold bg-gold/20 text-jungle" : "border-ink/15 text-ink/60"}`}><Pin size={14}/>{t.pinned ? "Pinned" : "Pin to top"}</button>
                <button type="button" onClick={() => update(t.slug, { hidden: !t.hidden })} aria-pressed={t.hidden} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ink/15 px-4 text-xs font-bold text-ink/60">{t.hidden ? <><EyeOff size={14}/>Hidden</> : <><Eye size={14}/>Visible</>}</button>
              </div>
            </div>
          </div>
        </li>)}
      </ol>
    </section>)}

    <div className={`fixed inset-x-0 bottom-16 z-30 px-4 pb-3 transition-transform md:bottom-0 md:pb-6 ${dirty || state !== "idle" ? "translate-y-0" : "translate-y-[150%]"}`}>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl bg-jungle p-3 pl-5 text-white shadow-2xl">
        <p role="status" className={`text-sm ${state === "error" ? "text-red-200" : "text-white/80"}`}>{state !== "idle" && message ? message : "Unsaved changes"}</p>
        <button type="button" onClick={save} disabled={!dirty || state === "saving"} className="flex min-h-11 items-center gap-2 rounded-xl bg-gold px-5 text-xs font-bold uppercase tracking-[.08em] text-jungle disabled:opacity-50">{state === "saving" ? <LoaderCircle size={15} className="animate-spin"/> : <Check size={15}/>}Publish</button>
      </div>
    </div>
  </div>;
}
