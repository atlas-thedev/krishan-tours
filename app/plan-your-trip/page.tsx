import type { Metadata } from "next";
import Image from "next/image";
import { TripPlanner } from "@/components/TripPlanner";
import { getPrices } from "@/lib/content-db";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const generateMetadata=():Promise<Metadata>=>localizedMetadata({title:"Plan Your Tailor-Made Sri Lanka Trip",description:"Tell us when you are travelling, what you love and how you like to travel. We will shape a private Sri Lanka journey around you.",path:"/plan-your-trip"});
export default async function PlanPage(){const {t}=await getI18n();const prices=getPrices();return <section className="min-h-screen bg-jungle px-0 pb-24 pt-28 text-white md:pb-32 md:pt-40"><div className="shell"><div className="grid items-end gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20"><div className="pb-4"><p className="eyebrow text-gold">{t("Your journey, your way")}</p><h1 className="display mt-5 text-[clamp(4rem,8vw,8rem)] leading-[.8]">{t("Tell us")}<br/>{t("what")} <em>{t("fits.")}</em></h1><p className="mt-7 max-w-md text-base leading-7 text-white/60">{t("Eight quick steps. No booking commitment. A real person on the island will turn your choices into a considered first route.")}</p><div className="relative mt-10 hidden aspect-[16/10] lg:block"><Image src="/images/ella-train.webp" alt={t("Sri Lankan train journey")} fill sizes="35vw" className="object-cover"/></div></div><div className="text-ink"><TripPlanner budgetTiers={[prices["planner.budget1"].min, prices["planner.budget2"].min, prices["planner.budget3"].min]}/></div></div></div></section>}
