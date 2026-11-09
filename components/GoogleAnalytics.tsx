"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsConsentStorageKey } from "./CookieConsent";
import { trackInteraction } from "@/lib/analytics";

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => setEnabled(localStorage.getItem(analyticsConsentStorageKey) === "granted"));
    const update = (event: Event) => setEnabled((event as CustomEvent<string>).detail === "granted");
    window.addEventListener("krishantours-consent", update);
    return () => window.removeEventListener("krishantours-consent", update);
  }, []);

  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = pathname;
    if (!enabled || !measurementId || !pathname || pathname.startsWith("/admin") || !previous || previous === pathname) return;
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname, enabled, measurementId]);

  useEffect(() => {
    if (!enabled || !measurementId || pathname?.startsWith("/admin")) return;
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor) return;
      if (anchor.protocol === "tel:") trackInteraction("contact", "phone");
      else if (anchor.hostname === "wa.me" || anchor.hostname === "api.whatsapp.com") trackInteraction("contact", "whatsapp");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled, measurementId, pathname]);

  if (!measurementId || pathname?.startsWith("/admin") || !enabled) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
