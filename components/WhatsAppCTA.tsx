"use client";
import Link from "@/components/LocalizedLink";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { whatsappUrl } from "@/lib/site";
import { useI18n } from "./I18nProvider";
import { stripLocale } from "@/lib/i18n/config";

export function WhatsAppCTA() {
  const pathname = usePathname();
  const { t } = useI18n();
  const barePath = stripLocale(pathname);
  if (barePath === "/plan-your-trip" || barePath.startsWith("/admin") || barePath === "/pay-for-booking" || barePath.startsWith("/payments/")) return null;
  return (
    <>
      <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label={t("Ask KrishanTours on WhatsApp")} style={{ color: "#fff" }} className="fixed bottom-6 right-6 z-40 hidden h-13 w-13 items-center justify-center rounded-full bg-jungle shadow-xl transition-transform hover:-translate-y-1 md:flex"><MessageCircle size={21} color="#fff"/></a>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-black/10 bg-paper p-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] md:hidden">
        <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 text-[.68rem] font-bold uppercase tracking-[.1em]"><MessageCircle size={17}/> {t("Ask on WhatsApp")}</a>
        <Link href="/plan-your-trip" style={{ color: "white" }} className="flex min-h-12 items-center justify-center bg-cinnamon text-[.68rem] font-bold uppercase tracking-[.1em]">{t("Plan my trip")}</Link>
      </div>
    </>
  );
}
