import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { DestinationCard } from "@/components/DestinationCard";
import { SriLankaMap } from "@/components/SriLankaMap";
import { SectionHeading } from "@/components/SectionHeading";
import { destinations } from "@/data/destinations";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const generateMetadata=():Promise<Metadata>=>localizedMetadata({title:"Best Places to Visit in Sri Lanka",description:"Local guide to the best places to visit in Sri Lanka: Sigiriya, Kandy, Ella, Nuwara Eliya, Galle, Mirissa, Yala and more, with when to go and how long to stay.",path:"/destinations"});

export default async function DestinationsPage() {
  const {t}=await getI18n();
  return <><PageHero eyebrow={t("Destination atlas")} title={t("A small island of many worlds.")} intro={t("Choose coast, highland, ancient city or wild country. The good part is how quickly one becomes another.")} image="/images/tea-hills.webp"/>
    <section className="py-24 md:py-36"><div className="shell"><SectionHeading eyebrow={t("Ten places to begin")} title={<>{t("Stay long enough")}<br/><em>{t("to notice.")}</em></>} intro={t("Each place below earns its time in a route. We’ll help match it to your season, interests and pace.")}/><div className="mt-16 grid gap-x-5 gap-y-16 md:grid-cols-3">{destinations.map((item,index)=><DestinationCard key={item.slug} destination={item} feature={index===0||index===6}/>)}</div></div></section>
    <section className="bg-paper py-24 md:py-36"><div className="shell"><SectionHeading eyebrow={t("Put it together")} title={<>{t("See where the")}<br/><em>{t("road leads.")}</em></>}/><div className="mt-14"><SriLankaMap/></div></div></section></>;
}
