"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18nProvider";
import { localeNames, locales, localizeHref, stripLocale, type Locale } from "@/lib/i18n/config";

function navigateToLocale(targetUrl: string, nextLocale: string) {
  document.cookie = `krishantours_locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
  window.location.assign(targetUrl);
}

export function LanguageSwitcher({
  light = false,
  direction = "down",
  onChange,
  className = "",
}: {
  light?: boolean;
  direction?: "down" | "up";
  onChange?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function select(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    const bare = stripLocale(pathname || "/");
    const targetUrl = `${localizeHref(bare, next)}${window.location.search}${window.location.hash}`;
    onChange?.();
    navigateToLocale(targetUrl, next);
  }

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("Choose language")}
        className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[.68rem] font-bold uppercase tracking-[.1em] transition-colors cursor-pointer ${
          light
            ? "border-white/30 text-white hover:border-white hover:bg-white/10"
            : "border-black/20 text-ink hover:border-black hover:bg-black/5"
        }`}
      >
        <span>{locale.toUpperCase()}</span>
        <ChevronDown
          size={12}
          className={`opacity-60 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("Choose language")}
          className={`absolute ${
            direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } end-0 z-50 max-h-[min(70vh,26rem)] min-w-[160px] overflow-y-auto overscroll-contain border border-black/15 bg-paper py-1 shadow-lg`}
        >
          {locales.map((item) => {
            const isSelected = item === locale;
            return (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => select(item)}
                className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-jungle text-white font-semibold"
                    : "text-ink hover:bg-black/5"
                }`}
              >
                <span>{localeNames[item]}</span>
                <span
                  className={`font-mono text-[.62rem] uppercase tracking-wider ${
                    isSelected ? "text-white/70" : "text-black/40"
                  }`}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
