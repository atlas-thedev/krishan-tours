"use client";

import { useEffect, useState } from "react";
import Link from "@/components/LocalizedLink";
import { useI18n } from "./I18nProvider";

export const analyticsConsentStorageKey = "krishantours-analytics-consent";

export function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  useEffect(() => { queueMicrotask(() => setVisible(!window.location.pathname.startsWith("/admin") && localStorage.getItem(analyticsConsentStorageKey) === null)); }, []);
  function choose(value: "granted" | "denied") {
    localStorage.setItem(analyticsConsentStorageKey, value);
    window.dispatchEvent(new CustomEvent("krishantours-consent", { detail: value }));
    setVisible(false);
  }
  if (!visible) return null;
  return <aside role="dialog" aria-label={t("Analytics choices")} className="fixed inset-x-3 bottom-20 z-[70] mx-auto max-w-2xl border border-black/15 bg-paper p-5 text-ink shadow-2xl md:bottom-5">
    <p className="text-sm leading-6">{t("We use optional analytics to understand which pages help travellers. Analytics stays off unless you accept.")} <Link href="/privacy" className="underline">{t("Privacy details")}</Link></p>
    <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => choose("denied")} className="min-h-11 border border-black/20 px-4 text-xs font-bold uppercase tracking-[.08em]">{t("Decline")}</button><button type="button" onClick={() => choose("granted")} className="btn-primary min-h-11">{t("Accept analytics")}</button></div>
  </aside>;
}
