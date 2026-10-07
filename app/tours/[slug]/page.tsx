import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/LocalizedLink";
import {
  ArrowRight,
  BedDouble,
  Car,
  Check,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { tours, getTour } from "@/data/tours";
import { PageHero } from "@/components/PageHero";
import { TourTimeline } from "@/components/TourTimeline";
import { Gallery } from "@/components/Gallery";
import { FAQ } from "@/components/FAQ";
import { commonFaqs } from "@/data/faqs";
import { SectionHeading } from "@/components/SectionHeading";
import { TourCard } from "@/components/TourCard";
import { siteConfig } from "@/lib/site";
import { JsonLd, breadcrumbSchema, organizationId } from "@/components/JsonLd";
import { getTripSettings } from "@/lib/content-db";
import { money } from "@/lib/money";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export function generateStaticParams() {
  return tours.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return {};
  const {t}=await getI18n();
  return localizedMetadata({title:t("{name}: {days}-Day Sri Lanka Tour",{name:t(tour.name),days:tour.duration}),description:`${t(tour.summary)} ${t(tour.intro)}`,path:`/tours/${tour.slug}`,image:tour.image});
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t, locale } = await getI18n();
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  const fromPrice = getTripSettings()[tour.slug]?.fromPrice;
  const similar = tours
    .filter(
      (t) =>
        t.slug !== tour.slug && t.styles.some((s) => tour.styles.includes(s)),
    )
    .slice(0, 2);
  const prefix = locale === "en" ? "" : `/${locale}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: t(tour.name),
    description: t(tour.intro),
    touristType: tour.styles.map((value) => t(value)),
    itinerary: tour.itinerary.map((d) => ({
      "@type": "TouristAttraction",
      name: `${t(d.place)}: ${t(d.title)}`,
    })),
    url: `${siteConfig.url}${prefix}/tours/${tour.slug}`,
    image: `${siteConfig.url}${tour.image.replace(/\.webp$/, ".jpg")}`,
    provider: { "@id": organizationId },
    ...(fromPrice ? { offers: { "@type": "Offer", price: fromPrice, priceCurrency: "USD", availability: "https://schema.org/InStock" } } : {}),
    inLanguage: locale,
  };
  const breadcrumbs = breadcrumbSchema([[t("Tours"), "/tours"], [t(tour.name), `/tours/${tour.slug}`]], locale, t("Home"));
  return (
    <>
      <PageHero
        eyebrow={`${tour.duration} ${t("days")} · ${tour.styles.map((value) => t(value)).join(" · ")}`}
        title={t(tour.name)}
        intro={t(tour.intro)}
        image={tour.image}
        tall
      />
      <div className="sticky top-[76px] z-30 border-y border-black/10 bg-paper/95 backdrop-blur-md lg:top-[88px]">
        <div className="shell flex min-h-16 items-center justify-between gap-4">
          <div className="hidden items-center gap-6 text-xs text-black/60 sm:flex">
            <span className="flex gap-2">
              <Clock size={15} />
              {tour.duration} {t("days")}
            </span>
            <span className="flex gap-2">
              <MapPin size={15} />
              {tour.route.length} {t("stops")}
            </span>
            {fromPrice ? <span className="font-bold text-jungle">{t("From {price} / person", { price: money(fromPrice) })}</span> : null}
          </div>
          <p className="truncate text-xs sm:hidden">
            {tour.duration} {t("days")} · {fromPrice ? t("From {price} / person", { price: money(fromPrice) }) : t("Private journey")}
          </p>
          <Link
            href={`/plan-your-trip?tour=${tour.slug}`}
            className="btn-primary min-h-11 shrink-0"
          >
            {t("Request this tour")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("The journey")}</p>
            <h2 className="display mt-5 text-[clamp(3.5rem,7vw,7rem)] leading-[.84]">
              {t("A route with")}
              <br />
              <em>{t("its own rhythm.")}</em>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-black/60">
              {t(tour.intro)}
            </p>
          </div>
          <div>
            <p className="eyebrow text-black/40">{t("Highlights")}</p>
            <div className="mt-5 border-t border-black/15">
              {tour.highlights.map((h, i) => (
                <div
                  key={h}
                  className="flex gap-4 border-b border-black/15 py-4"
                >
                  <span className="text-[.62rem] text-cinnamon">0{i + 1}</span>
                  <span className="text-sm">{t(h)}</span>
                </div>
              ))}
            </div>
            <p className="eyebrow mt-9 text-black/40">{t("Route")}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {tour.route.map((r, i) => (
                <span key={r} className="flex items-center gap-2 text-xs">
                  <span className="border border-black/15 px-3 py-2">
                    {t(r)}
                  </span>
                  {i < tour.route.length - 1 && (
                    <ArrowRight size={12} className="text-cinnamon" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-paper py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Day by day")}
            title={
              <>
                {t("The story of")}
                <br />
                <em>{t("your journey.")}</em>
              </>
            }
            intro={t(
              "The details stay flexible. This is how the days unfold when the weather, roads and your energy all cooperate.",
            )}
          />
          <div className="mt-20">
            <TourTimeline days={tour.itinerary} />
          </div>
        </div>
      </section>
      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-3">
          <Info
            icon={<BedDouble />}
            label={t("Accommodation style")}
            text={t(tour.accommodation)}
          />
          <Info
            icon={<Car />}
            label={t("Getting around")}
            text={t(tour.transport)}
          />
          <div className="border-t border-black/15 pt-6">
            <p className="eyebrow text-cinnamon">{t("Personal by default")}</p>
            <p className="display mt-4 text-3xl">
              {t("Your driver. Your timing. Your route.")}
            </p>
            <p className="mt-4 text-sm leading-6 text-black/60">
              {t(
                "No tour bus, no forced shopping stops and no group timetable.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="bg-jungle py-24 text-white md:py-32">
        <div className="shell grid gap-12 md:grid-cols-2 md:gap-20">
          <List title={t("Included")} icon="yes" items={tour.included.map((value) => t(value))} />
          <List
            title={t("Not included")}
            icon="no"
            items={tour.notIncluded.map((value) => t(value))}
          />
        </div>
      </section>
      <section className="py-24 md:py-36">
        <div className="shell">
          <Gallery
            title={t("A glimpse of the route")}
            images={[
              tour.image,
              ...tour.itinerary.slice(1, 4).map((d) => d.image),
            ].map((src, i) => ({
              src,
              alt: `${t(tour.name)} ${t("journey scene")} ${i + 1}`,
            }))}
          />
        </div>
      </section>
      <section className="bg-paper py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("Good to know")}</p>
            <h2 className="display mt-4 text-5xl">
              {t("Questions before the road.")}
            </h2>
          </div>
          <FAQ items={commonFaqs} />
        </div>
      </section>
      <section className="py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Keep exploring")}
            title={
              <>
                {t("Similar journeys,")}
                <br />
                <em>{t("different rhythm.")}</em>
              </>
            }
          />
          <div className="mt-12">
            {similar.map((item, i) => (
              <TourCard key={item.slug} tour={item} index={i} />
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={[schema, breadcrumbs]} />
    </>
  );
}

function Info({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="border-t border-black/15 pt-6">
      <span className="text-cinnamon">{icon}</span>
      <p className="eyebrow mt-6 text-black/40">{label}</p>
      <p className="mt-4 text-sm leading-7 text-black/60">{text}</p>
    </div>
  );
}
function List({
  title,
  icon,
  items,
}: {
  title: string;
  icon: "yes" | "no";
  items: string[];
}) {
  return (
    <div>
      <h3 className="display text-5xl">{title}</h3>
      <ul className="mt-7 border-t border-white/20">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 border-b border-white/20 py-4 text-sm text-white/75"
          >
            {icon === "yes" ? (
              <Check size={16} className="text-gold" />
            ) : (
              <X size={16} className="text-white/40" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
