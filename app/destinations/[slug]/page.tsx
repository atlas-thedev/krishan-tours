import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ArrowRight, CalendarDays, Clock, Lightbulb } from "lucide-react";
import { destinations, getDestination } from "@/data/destinations";
import { tours } from "@/data/tours";
import { PageHero } from "@/components/PageHero";
import { Gallery } from "@/components/Gallery";
import { TourCard } from "@/components/TourCard";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export function generateStaticParams() {
  return destinations.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  const {t}=await getI18n();
  return localizedMetadata({title:t("{place}, Sri Lanka: Things to Do & Tips",{place:t(d.name)}),description:`${t(d.description)} ${t("Best time: {time}. Stay {stay}.",{time:t(d.bestTime),stay:t(d.stay)})}`,path:`/destinations/${d.slug}`,image:d.image});
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t, locale } = await getI18n();
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();
  const index = destinations.findIndex((x) => x.slug === slug);
  const related = tours
    .filter((t) =>
      t.locations.some((l) =>
        l.toLowerCase().includes(d.name.toLowerCase().split(" ")[0]),
      ),
    )
    .slice(0, 2);
  const isSigiriya = d.slug === "sigiriya";
  const featureImage = isSigiriya
    ? "/images/sigiriya-gardens.webp"
    : index % 2
      ? "/images/tea-estate.webp"
      : "/images/rainforest.webp";
  const gallery = isSigiriya
    ? [
        "/images/pidurangala-sigiriya.webp",
        "/images/sigiriya-panorama.webp",
        "/images/dambulla-cave.webp",
        "/images/jetavanaramaya.webp",
      ]
    : [
        d.image,
        featureImage,
        index % 3 ? "/images/coast.webp" : "/images/nine-arches.webp",
        "/images/food.webp",
      ];
  const prefix = locale === "en" ? "" : `/${locale}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: t(d.name),
    description: t(d.description),
    touristType: t(d.category),
    url: `${siteConfig.url}${prefix}/destinations/${d.slug}`,
    image: `${siteConfig.url}${d.image.replace(/\.webp$/, ".jpg")}`,
    geo: { "@type": "GeoCoordinates", latitude: d.coordinates[0], longitude: d.coordinates[1] },
    containedInPlace: { "@type": "Country", name: "Sri Lanka" },
    includesAttraction: d.things.map((thing) => ({ "@type": "TouristAttraction", name: t(thing) })),
  };
  const breadcrumbs = breadcrumbSchema([[t("Destinations"), "/destinations"], [t(d.name), `/destinations/${d.slug}`]], locale, t("Home"));
  return (
    <>
      <PageHero
        eyebrow={`${t(d.region)} · ${t(d.category)}`}
        title={t(d.name)}
        intro={t(d.tagline)}
        image={d.image}
        tall
      />
      <section id="content" className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">
              {t("Why")} {t(d.name)}
            </p>
            <div className="mt-7 grid gap-5">
              {d.reasons.map((reason, i) => (
                <div
                  key={reason}
                  className="flex items-start gap-4 border-b border-black/15 pb-5"
                >
                  <span className="text-[.65rem] text-cinnamon">0{i + 1}</span>
                  <p className="display text-2xl leading-none">{t(reason)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="border border-black/15 p-4">
                <CalendarDays size={18} className="text-cinnamon" />
                <p className="eyebrow mt-4 text-black/40">{t("Best time")}</p>
                <p className="mt-1 text-sm">{t(d.bestTime)}</p>
              </div>
              <div className="border border-black/15 p-4">
                <Clock size={18} className="text-cinnamon" />
                <p className="eyebrow mt-4 text-black/40">
                  {t("Suggested stay")}
                </p>
                <p className="mt-1 text-sm">{t(d.stay)}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="display text-[clamp(2.8rem,5vw,5.5rem)] leading-[.95] text-balance">
              {t(d.description)}
            </p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-black/58">
              {t(
                "Come with a little structure and enough room for the weather, a conversation or a road worth following. KrishanTours plans the practical pieces privately, then keeps the days human.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="bg-jungle py-24 text-white md:py-36">
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div
              className={`relative aspect-[4/5] ${index % 2 ? "lg:order-2" : ""}`}
            >
              <Image
                src={featureImage}
                alt={`${t("Landscape near")} ${t(d.name)}`}
                fill
                sizes="(max-width:1024px) 180vw,90vw"
                className="object-cover"
              />
            </div>
            <div className={index % 2 ? "lg:order-1" : ""}>
              <p className="eyebrow text-gold">{t("Things to do")}</p>
              <h2 className="display mt-5 text-6xl leading-[.85]">
                {t("Four ways to feel")} <em>{t(d.name)}.</em>
              </h2>
              <ol className="mt-9 border-t border-white/20">
                {d.things.map((thing, i) => (
                  <li
                    key={thing}
                    className="flex gap-5 border-b border-white/20 py-5"
                  >
                    <span className="text-[.63rem] text-gold">0{i + 1}</span>
                    <span className="text-base text-white/80">{t(thing)}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex gap-4 border-l border-gold pl-5">
                <Lightbulb className="shrink-0 text-gold" size={19} />
                <p className="max-w-md text-sm leading-6 text-white/60">
                  {t("Local note:")} {t(d.tip)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 md:py-36">
        <div className="shell">
          <Gallery
            images={gallery.map((src, i) => ({
              src,
              alt: `${t(d.name)} ${t("travel scene")} ${i + 1}`,
            }))}
          />
          <div className="mt-14 flex flex-col justify-between gap-7 border-y border-black/15 py-8 sm:flex-row sm:items-center">
            <div>
              <p className="eyebrow text-cinnamon">
                {t("Close enough to combine")}
              </p>
              <p className="display mt-2 text-3xl">
                {d.nearby.map((value) => t(value)).join(" · ")}
              </p>
            </div>
            <Link href="/plan-your-trip" className="btn-primary">
              {t("Add")} {t(d.name)} {t("to my trip")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="bg-paper py-24 md:py-36">
          <div className="shell">
            <SectionHeading
              eyebrow={t("Journeys through here")}
              title={
                <>
                  {t("Follow")} {t(d.name)}
                  <br />
                  <em>{t("into a wider route.")}</em>
                </>
              }
            />
            <div className="mt-12">
              {related.map((tour, i) => (
                <TourCard key={tour.slug} tour={tour} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      <JsonLd data={[schema, breadcrumbs]} />
    </>
  );
}
