"use client";

import { FormEvent, useState } from "react";
import { Check, KeyRound, LoaderCircle } from "lucide-react";

export function PasswordChanger() {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const currentPassword = String(values.get("currentPassword") || "");
    const newPassword = String(values.get("newPassword") || "");
    const confirmation = String(values.get("confirmation") || "");
    if (newPassword !== confirmation) {
      setState("error");
      setMessage("The new passwords do not match.");
      return;
    }

    setState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      const result = await response.json() as { ok: boolean; message?: string };
      if (!response.ok) throw new Error(result.message || "Could not update the password.");
      form.reset();
      setState("saved");
      setMessage("Password updated successfully.");
    } catch (reason) {
      setState("error");
      setMessage(reason instanceof Error ? reason.message : "Could not update the password.");
    }
  }

  return <details open className="group mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 text-xs font-bold uppercase tracking-[.11em] text-jungle marker:hidden"><span className="flex items-center gap-2"><KeyRound size={16}/> Security settings</span><span className="text-xl font-normal transition-transform group-open:rotate-45">+</span></summary>
    <form onSubmit={submit} className="grid gap-5 border-t border-ink/10 p-5 md:grid-cols-3 md:items-end">
      <label className="grid gap-2 text-xs font-bold uppercase tracking-[.09em] text-ink/55">Current password<input name="currentPassword" type="password" autoComplete="current-password" required className="min-h-12 rounded-xl border border-ink/20 bg-white px-4 text-sm normal-case tracking-normal text-ink outline-none focus:border-cinnamon"/></label>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-[.09em] text-ink/55">New password<input name="newPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} required className="min-h-12 rounded-xl border border-ink/20 bg-white px-4 text-sm normal-case tracking-normal text-ink outline-none focus:border-cinnamon"/><span className="font-normal normal-case tracking-normal text-ink/45">12+ characters, uppercase, lowercase and a number.</span></label>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-[.09em] text-ink/55">Confirm new password<input name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required className="min-h-12 rounded-xl border border-ink/20 bg-white px-4 text-sm normal-case tracking-normal text-ink outline-none focus:border-cinnamon"/></label>
      <div className="md:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className={`text-sm ${state === "error" ? "text-red-800" : "text-tea"}`}>{message}</p>
        <button disabled={state === "saving"} className="btn-primary min-w-48">{state === "saving" ? <LoaderCircle className="animate-spin" size={15}/> : <Check size={15}/>} {state === "saving" ? "Updating…" : "Change password"}</button>
      </div>
    </form>
  </details>;
}
