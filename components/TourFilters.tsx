"use client";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { tourStyles } from "@/data/tours";
import type { ListedTour } from "@/lib/content-db";
import { TourCard } from "./TourCard";
import { useI18n } from "./I18nProvider";

export function TourFilters({ tours }: { tours: ListedTour[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const requested = searchParams.get("style") || "All";
  const active = tourStyles.includes(requested) ? requested : "All";
  const filtered = useMemo(() => active === "All" ? tours : tours.filter((tour) => tour.styles.includes(active)), [active, tours]);
  function select(style: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (style === "All") params.delete("style"); else params.set("style", style);
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  }
  return <div><div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-8 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">{tourStyles.map((style) => <button type="button" aria-pressed={active === style} onClick={() => select(style)} key={style} className={`min-h-11 shrink-0 border px-4 text-[.67rem] font-bold uppercase tracking-[.1em] transition-colors ${active === style ? "border-jungle bg-jungle text-white" : "border-black/15 hover:border-jungle"}`}>{t(style)}</button>)}</div><div>{filtered.map((tour, index) => <TourCard key={tour.slug} tour={tour} index={index}/>)}</div></div>;
}
