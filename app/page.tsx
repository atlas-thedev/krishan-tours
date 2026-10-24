import Image from "next/image";
import Link from "@/components/LocalizedLink";
import type { Metadata } from "next";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  Route,
  Sprout,
} from "lucide-react";
import { VideoHero } from "@/components/VideoHero";
import { SectionHeading } from "@/components/SectionHeading";
import { ExperienceShowcase } from "@/components/ExperienceShowcase";
import { DestinationCard } from "@/components/DestinationCard";
import { SriLankaMap } from "@/components/SriLankaMap";
import { TourCard } from "@/components/TourCard";
import { Reveal } from "@/components/Reveal";
import { FAQ } from "@/components/FAQ";
import { commonFaqs } from "@/data/faqs";
import { destinations } from "@/data/destinations";
import { getListedTours } from "@/lib/content-db";
import { stories } from "@/data/stories";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const generateMetadata = (): Promise<Metadata> =>
  localizedMetadata({
    title: "Sri Lanka Private Driver & Tailor-Made Tours | Krishan Tours",
    description:
      "Private driver-guides, tailor-made Sri Lanka tours and 24/7 airport transfers from Panadura. Fixed daily rates, no shopping commissions. Plan on WhatsApp.",
    path: "/",
    image: "/images/og-image.jpg",
    absoluteTitle: true,
  });

const homeFaqs = [
  commonFaqs[2],
  {
    q: "What is the best Sri Lanka itinerary for a first visit?",
    a: "For a first journey, 10 to 14 days gives a good balance: the Cultural Triangle, Kandy, tea country, a wildlife park and the coast. The best route changes with your month, interests and preferred pace, so KrishanTours builds it around your dates rather than forcing one fixed circuit.",
  },
  {
    q: "Why book a private Sri Lanka tour with a local operator?",
    a: "A local operator can respond to weather, road conditions and the rhythm of your trip while you are in Sri Lanka. With a private vehicle and driver-guide, you can stop, change pace and spend longer in the places you enjoy.",
  },
  commonFaqs[1],
  commonFaqs[3],
];

export default async function HomePage() {
  const { t } = await getI18n();
  const listedTours = getListedTours();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((item) => ({
      "@type": "Question",
      name: t(item.q),
      acceptedAnswer: { "@type": "Answer", text: t(item.a) },
    })),
  };
  return (
    <>
      <VideoHero />
      <section id="many-worlds" className="py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("One island. Many worlds.")}
            title={
              <>
                {t("Follow what")} <em>{t("moves you.")}</em>
              </>
            }
            intro={t(
              "Crossing Sri Lanka changes by the hour: dry forest to tea country, temple courtyards to an empty cove. Begin with a feeling; we’ll connect the road.",
            )}
          />
          <ExperienceShowcase />
        </div>
      </section>

      <section className="bg-paper py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Places with a pulse")}
            title={
              <>
                {t("Start with")} <em>{t("somewhere.")}</em>
              </>
            }
            intro={t(
              "Not a checklist of landmarks. A selection of places worth staying long enough to notice.",
            )}
            action={
              <Link href="/destinations" className="link-arrow">
                {t("All destinations")} <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="mt-14 grid gap-x-5 gap-y-16 md:grid-cols-3">
            <DestinationCard destination={destinations[0]} feature />
            <DestinationCard destination={destinations[1]} />
            <DestinationCard destination={destinations[5]} />
            <DestinationCard destination={destinations[3]} feature />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Find your way around")}
            title={
              <>
                {t("The island,")}
                <br />
                <em>{t("in context.")}</em>
              </>
            }
            intro={t(
              "Distances look short on a map. The roads are the story—tea stalls, viewpoints, temple towns and the freedom to stop.",
            )}
          />
          <div className="mt-14">
            <SriLankaMap />
          </div>
        </div>
      </section>

      <section className="bg-[#e8e1d4] py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Journeys to make your own")}
            title={
              <>
                {t("A good route has")}
                <br />
                <em>{t("room to breathe.")}</em>
              </>
            }
            intro={t(
              "These are considered starting points, never fixed packages.",
            )}
            action={
              <Link href="/tours" className="link-arrow">
                {t("Explore all tours")} <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="mt-12">
            {listedTours.slice(0, 3).map((tour, index) => (
              <TourCard key={tour.slug} tour={tour} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Tailor-made private travel")}
            title={
              <>
                {t("Private driver &")}
                <br />
                <em>{t("custom tour routes.")}</em>
              </>
            }
            intro={t(
              "Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka. Explore our most requested private services and itineraries.",
            )}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Sri Lanka Private Driver",
                desc: "Licensed English-speaking driver-guide, modern AC vehicle, fuel, highway tolls, and complete flexibility across your route.",
                href: "/sri-lanka-private-driver",
                tag: "Daily Chauffeur",
              },
              {
                title: "Sri Lanka Private Tours",
                desc: "Custom tailor-made journeys planned around your rhythm, interests, and preferred boutique stays.",
                href: "/sri-lanka-private-tours",
                tag: "Tailor-Made",
              },
              {
                title: "Sri Lanka Tour Packages",
                desc: "Curated multi-day itineraries with private vehicle, handpicked hotels, safari jeeps, and scenic train rides.",
                href: "/sri-lanka-tour-packages",
                tag: "All-Inclusive",
              },
              {
                title: "Airport Transfer Sri Lanka",
                desc: "Reliable 24/7 CMB airport transfers to Colombo, Panadura, Bentota, Galle, Kandy, Sigiriya, and beyond.",
                href: "/airport-transfer-sri-lanka",
                tag: "Fixed Rates",
              },
              {
                title: "Sigiriya, Kandy & Ella",
                desc: "Sri Lanka's classic 5-day route: ancient rock fortress, sacred Temple of the Tooth, and legendary blue hill train.",
                href: "/sigiriya-kandy-ella-tour",
                tag: "5 Days",
              },
              {
                title: "Sri Lanka 7-Day Tour",
                desc: "The essential 1-week route connecting ancient kingdoms, highland tea estates, and Galle Fort's golden coast.",
                href: "/sri-lanka-7-day-tour",
                tag: "7 Days",
              },
              {
                title: "Sri Lanka 10-Day Tour",
                desc: "The perfect balanced itinerary: UNESCO culture, tea trails, scenic train, Yala safari, and coastal beaches.",
                href: "/sri-lanka-10-day-tour",
                tag: "10 Days",
              },
              {
                title: "Sri Lanka 14-Day Tour",
                desc: "The definitive two-week grand tour. In-depth heritage, wildlife encounters, mountain mist, and ocean sunsets.",
                href: "/sri-lanka-14-day-tour",
                tag: "14 Days",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col justify-between border border-black/10 bg-paper p-6 transition-all hover:border-cinnamon hover:shadow-sm"
              >
                <div>
                  <span className="eyebrow text-[.6rem] text-cinnamon">{t(card.tag)}</span>
                  <h3 className="display mt-2 text-2xl group-hover:italic">
                    {t(card.title)}
                  </h3>
                  <p className="mt-3 text-xs leading-5 text-black/60">
                    {t(card.desc)}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.08em] text-jungle group-hover:text-cinnamon">
                  {t("Explore")} <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-jungle py-24 text-white md:py-36">
        <div className="shell grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
          <Reveal>
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/krishan-roadside.webp"
                alt={t(
                  "Krishan, founder and licensed private driver-guide at Krishan Tours Sri Lanka",
                )}
                fill
                sizes="(max-width: 1023px) calc(100vw - 48px), 50vw"
                className="object-cover"
              />
              <div className="absolute -bottom-7 -right-4 bg-gold p-6 text-jungle md:-right-10 md:p-8">
                <span className="display block text-5xl">Krishan</span>
                <span className="eyebrow">
                  {t("Founder")} · {t("Licensed Driver-Guide")}
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <p className="eyebrow text-gold">
              {t("Travel with someone who knows it")}
            </p>
            <h2 className="display mt-5 text-[clamp(3.7rem,7vw,7rem)] leading-[.82]">
              {t("The person behind")}
              <br />
              {t("your journey")}
              <br />
              <em>{t("is here.")}</em>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-7 text-white/65">
              {t(
                "Krishan Tours Sri Lanka is built around a simple advantage: your trip is planned and supported by someone on the island. We know which road is washed out, which small hotel is still worth it and when a better idea deserves a change of plan.",
              )}
            </p>
            <div className="mt-9 grid grid-cols-2 gap-y-6 border-t border-white/20 pt-7 text-sm text-white/75">
              <span className="flex gap-2">
                <Compass size={17} className="text-gold" />
                {t("Local knowledge")}
              </span>
              <span className="flex gap-2">
                <Route size={17} className="text-gold" />
                {t("Flexible routes")}
              </span>
              <span className="flex gap-2">
                <HeartHandshake size={17} className="text-gold" />
                {t("Private support")}
              </span>
              <span className="flex gap-2">
                <Sprout size={17} className="text-gold" />
                {t("Considered travel")}
              </span>
            </div>
            <Link href="/about" className="btn-light mt-10">
              {t("Meet Krishan Tours Sri Lanka")} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Island stories")}
            title={
              <>
                {t("Read the island")}
                <br />
                <em>{t("between stops.")}</em>
              </>
            }
            action={
              <Link href="/stories" className="link-arrow">
                {t("All stories")} <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {stories.slice(0, 3).map((story, index) => (
              <Link
                href={`/stories/${story.slug}`}
                key={story.slug}
                className={`group ${index === 1 ? "md:mt-20" : ""}`}
              >
                <div className="media-cover aspect-[4/5]">
                  <Image
                    src={story.image}
                    alt={t(story.title)}
                    fill
                    sizes="(max-width: 768px) 180vw, 62vw"
                    className="object-cover"
                  />
                </div>
                <p className="eyebrow mt-5 text-cinnamon">
                  {t(story.category)} · {t(story.readTime)}
                </p>
                <h3 className="display mt-2 text-4xl leading-none group-hover:italic">
                  {t(story.title)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-black/55">
                  {t(story.excerpt)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="shell grid gap-10 border-y border-black/15 py-16 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow text-cinnamon">{t("A lighter footprint")}</p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("Travel that respects the place.")}
            </h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <p className="text-sm leading-6 text-black/60">
              {t(
                "We favour family-run stays, local guides and small businesses—not as a claim of perfection, but because more of your journey should benefit the people who make it memorable.",
              )}
            </p>
            <p className="text-sm leading-6 text-black/60">
              {t(
                "We keep distance from wildlife, reduce unnecessary single-use plastic and help guests understand the etiquette of sacred and community spaces.",
              )}
            </p>
            <Link
              href="/about#responsible"
              className="link-arrow sm:col-span-2"
            >
              {t("Our approach")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-paper py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">
              {t("Sri Lanka travel planning")}
            </p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("Useful answers before you choose a route.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Clear local guidance on the best time to visit Sri Lanka, private driver-guides and building an itinerary that fits your days.",
              )}
            </p>
          </div>
          <FAQ items={homeFaqs} />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
