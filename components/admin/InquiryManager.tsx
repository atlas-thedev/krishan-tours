"use client";

import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { InquiryStatus } from "@/lib/inquiries-db";

const statuses: InquiryStatus[] = ["new", "contacted", "confirmed", "archived"];

export function InquiryManager({ id, currentStatus, currentNote }: { id: string; currentStatus: InquiryStatus; currentNote: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [adminNote, setAdminNote] = useState(currentNote);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const dirty = status !== currentStatus || adminNote !== currentNote;

  async function save() {
    setState("saving");
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, adminNote }) });
      if (!response.ok) throw new Error();
      setState("saved");
      router.refresh();
      window.setTimeout(() => setState("idle"), 1800);
    } catch { setState("error"); }
  }

  return <div className="mt-4 grid gap-3 border-t border-ink/10 pt-4">
    <div role="radiogroup" aria-label="Status" className="grid grid-cols-4 gap-1 rounded-xl bg-paper p-1">
      {statuses.map((item) => <button key={item} type="button" role="radio" aria-checked={status === item} onClick={() => setStatus(item)} className={`min-h-10 rounded-lg text-[.62rem] font-bold uppercase tracking-[.06em] transition-colors ${status === item ? "bg-jungle text-white shadow" : "text-ink/55"}`}>{item}</button>)}
    </div>
    <div className="flex flex-col gap-2 sm:flex-row">
      <input value={adminNote} onChange={(event) => setAdminNote(event.target.value)} placeholder="Private note, e.g. Sent quote on WhatsApp" className="min-h-12 flex-1 rounded-xl border border-ink/15 bg-white px-4 text-sm outline-none focus:border-cinnamon" />
      <button onClick={save} disabled={state === "saving" || (!dirty && state !== "error")} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-jungle px-6 text-xs font-bold uppercase tracking-[.08em] text-white disabled:opacity-40">{state === "saving" ? <LoaderCircle className="animate-spin" size={15}/> : <Check size={15}/>} {state === "saved" ? "Saved" : state === "error" ? "Retry" : "Save"}</button>
    </div>
  </div>;
}
