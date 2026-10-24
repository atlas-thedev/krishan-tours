"use client";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useI18n } from "./I18nProvider";

export function PageHero({ eyebrow, title, intro, image, tall = false, imageAlt }: { eyebrow: string; title: string; intro: string; image: string; tall?: boolean; imageAlt?: string }) {
  const {t}=useI18n();
  return <section className={`grain relative flex overflow-hidden bg-jungle text-white ${tall ? "min-h-[88svh] items-end" : "min-h-[72svh] items-end"}`}><Image src={image} alt={imageAlt ?? title} fill priority sizes="(max-width: 767px) 1200px, 100vw" className="object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35"/><div className="shell relative z-10 pb-16 pt-36 md:pb-24"><p className="eyebrow text-gold">{eyebrow}</p><h1 className="display mt-5 max-w-5xl text-[clamp(4rem,11vw,10rem)] leading-[.78] text-balance">{title}</h1><div className="mt-8 flex max-w-2xl items-start gap-4 border-l border-white/50 pl-5"><p className="text-base leading-7 text-white/80 md:text-lg">{intro}</p></div>{tall && <a href="#content" className="mt-10 inline-flex items-center gap-2 text-[.65rem] font-bold uppercase tracking-[.15em] text-white/65">{t("Explore")} <ChevronDown size={15}/></a>}</div></section>;
}
