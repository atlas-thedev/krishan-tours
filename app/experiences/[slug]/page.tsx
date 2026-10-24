import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { experiences, getExperience } from "@/data/experiences";
import { tours } from "@/data/tours";
import { PageHero } from "@/components/PageHero";
import { TourCard } from "@/components/TourCard";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export function generateStaticParams() {
  return experiences.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getExperience(slug);
  if (!e) return {};
  const {t}=await getI18n();
  return localizedMetadata({title:t("Sri Lanka {experience} Experiences",{experience:t(e.name)}),description:t(e.intro),path:`/experiences/${e.slug}`,image:e.image});
}
export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t, locale } = await getI18n();
  const { slug } = await params;
  const e = getExperience(slug);
  if (!e) notFound();
  const breadcrumbs = breadcrumbSchema([[t("Experiences"), "/experiences"], [t(e.name), `/experiences/${e.slug}`]], locale, t("Home"));
  const index = experiences.findIndex((x) => x.slug === slug);
  const related = tours
    .filter((tour) =>
      tour.styles.some(
        (s) =>
          e.name.toLowerCase().includes(s.toLowerCase()) ||
          s.toLowerCase().includes(e.name.split(" ")[0].toLowerCase()),
      ),
    )
    .slice(0, 2);
  const fallbacks = related.length
    ? related
    : tours.slice(index % 4, (index % 4) + 2);
  return (
    <>
      <PageHero
        eyebrow={t("Experience Sri Lanka")}
        title={t(e.name)}
        intro={t(e.short)}
        image={e.image}
        tall
      />
      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("Go deeper")}</p>
            <h2 className="display mt-5 text-[clamp(3.2rem,6vw,6rem)] leading-[.9]">
              {t(e.short)}
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-black/60">
              {t(e.intro)}
            </p>
          </div>
          <aside className="border-y border-black/15 py-7">
            <Compass className="text-cinnamon" />
            <p className="eyebrow mt-6 text-black/40">{t("Krishan’s note")}</p>
            <p className="display mt-3 text-3xl leading-tight">{t(e.fact)}</p>
          </aside>
        </div>
      </section>
      <section className="bg-jungle py-24 text-white md:py-36">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div
            className={`relative aspect-[4/5] ${index % 2 ? "lg:order-2" : ""}`}
          >
            <Image
              src={index % 2 ? "/images/food.webp" : "/images/tea-estate.webp"}
              alt={`${t(e.name)} — Sri Lanka`}
              fill
              sizes="(max-width:1024px) 180vw,90vw"
              className="object-cover"
            />
          </div>
          <div className={index % 2 ? "lg:order-1" : ""}>
            <p className="eyebrow text-gold">{t("Where it comes alive")}</p>
            <h2 className="display mt-5 text-6xl leading-[.85]">
              {t("Different places,")}
              <br />
              <em>{t("different texture.")}</em>
            </h2>
            <div className="mt-9 border-t border-white/20">
              {e.locations.map((loc, i) => (
                <div
                  key={loc}
                  className="flex items-center gap-4 border-b border-white/20 py-5"
                >
                  <MapPin size={15} className="text-gold" />
                  <span className="display text-3xl">{t(loc)}</span>
                  <span className="ml-auto text-[.62rem] text-white/40">
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/plan-your-trip" className="btn-light mt-9">
              {t("Build this into my trip")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Routes to consider")}
            title={
              <>
                {t("Journeys with")}
                <br />
                <em>
                  {t(e.name)} {t("inside.")}
                </em>
              </>
            }
          />
          <div className="mt-12">
            {fallbacks.map((tour, i) => (
              <TourCard key={tour.slug} tour={tour} index={i} />
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbs} />
    </>
  );
}
