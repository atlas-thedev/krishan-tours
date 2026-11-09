"use client";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ArrowRight, MapPin } from "lucide-react";
import type { Tour } from "@/data/tours";

const usd = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;
import { useI18n } from "./I18nProvider";

export function TourCard({ tour, index = 0 }: { tour: Tour & { fromPrice?: number; pinned?: boolean }; index?: number }) {
  const { t } = useI18n();
  return (
    <article className="group grid gap-0 border-t border-black/15 py-7 md:grid-cols-[5rem_1fr_1.15fr] md:gap-7">
      <span className="eyebrow hidden pt-2 text-cinnamon md:block">
        0{index + 1}
      </span>
      <div className="flex flex-col justify-between py-1">
        <div>
          <p className="eyebrow text-black/65">
            {tour.duration} {t("days")} · {tour.styles.map((value) => t(value)).join(" / ")}
          </p>
          <h3 className="display mt-3 text-4xl leading-[.95] md:text-5xl">
            <Link href={`/tours/${tour.slug}`}>{t(tour.name)}</Link>
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-black/60">
            {t(tour.summary)}
          </p>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link href={`/tours/${tour.slug}`} className="link-arrow">
            {t("View journey")} <ArrowRight size={15} />
          </Link>
          <span className="text-[.68rem] uppercase tracking-[.08em] text-black/65">
            {tour.fromPrice ? t("From {price} / person", { price: usd(tour.fromPrice) }) : t("Request quote")}
          </span>
        </div>
      </div>
      <Link
        href={`/tours/${tour.slug}`}
        className="media-cover mt-6 aspect-[16/10] md:mt-0"
      >
        <Image
          src={tour.image}
          alt={t(tour.name)}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-2 bg-paper px-3 py-2 text-[.64rem] font-semibold uppercase tracking-[.08em] text-jungle">
          <MapPin size={13} />
          <span className="truncate">{tour.locations.map((value) => t(value)).join(" → ")}</span>
        </div>
      </Link>
    </article>
  );
}
