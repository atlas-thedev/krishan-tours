"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return <button aria-label="Sign out" style={{ color: "#fff" }} className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full border border-white/25 !text-[.65rem] !font-bold uppercase !tracking-[.08em] transition-colors hover:border-white hover:bg-white/10 sm:w-auto sm:px-4" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin/login"); router.refresh(); }}><LogOut size={16}/><span className="hidden sm:inline">Sign out</span></button>;
}
