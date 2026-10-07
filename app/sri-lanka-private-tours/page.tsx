import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import {
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Check,
  MessageCircle,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { JsonLd, organizationId } from "@/components/JsonLd";

export const generateMetadata = (): Promise<Metadata> =>
  localizedMetadata({
    title: "Sri Lanka Private Tours with a Driver-Guide",
    description:
      "Tailor-made private tours of Sri Lanka with your own driver-guide: Sigiriya, Kandy, tea country, Ella train, Yala safari and the south coast, planned around you.",
    path: "/sri-lanka-private-tours",
    image: "/images/sigiriya-panorama.webp",
  });

const privateTourFaqs = [
  {
    q: "Why choose a private tour over a group coach tour in Sri Lanka?",
    a: "Group tours force you onto rigid schedules, crowded 40-passenger buses, rushed landmark stops, and pre-arranged tourist buffet restaurants. A private tour with Krishan Tours Sri Lanka allows you to start the day whenever you feel rested, stay longer at places you love, stop at authentic roadside coconut stalls, and detour to hidden waterfalls whenever inspiration strikes.",
  },
  {
    q: "How many days should we spend on a private tour of Sri Lanka?",
    a: "For a first visit, we strongly recommend 10 to 14 days to comfortably experience the Cultural Triangle, Kandy, Nuwara Eliya tea hills, the iconic mountain train, a wildlife safari, and a few relaxing days on the southern coast. If you have 7 to 8 days, we curate a focused Golden Route that avoids travel fatigue.",
  },
  {
    q: "Can we book our own hotels, or does Krishan Tours provide full packages?",
    a: "We offer complete flexibility. You can book our 'Private Driver Only' service and reserve your own accommodations, or you can choose our 'Complete Private Tour Package' where we book handpicked boutique stays, safari jeeps, and reserved train tickets at negotiated local rates.",
  },
  {
    q: "What makes Krishan Tours Sri Lanka different from foreign travel agencies?",
    a: "Foreign agencies act as middle-men: they take your inquiry, take a hefty 25–40% markup, and subcontract your trip to a local agency they have never visited. Krishan Tours Sri Lanka is an independent, Panadura-based operator. You speak directly with the people who live here, know the roads, and support your journey 24/7 on the ground.",
  },
  {
    q: "What is your deposit and cancellation policy?",
    a: "We believe in fair, straightforward policies. Once you approve your personalized itinerary proposal, a small deposit confirms your driver and boutique hotel reservations. If travel plans change due to flight disruptions or medical emergencies, we work flexibly with you to reschedule or refund according to transparent terms.",
  },
];

export default async function PrivateToursPage() {
  const { t, locale } = await getI18n();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: "Sri Lanka Private Tours & Custom Itineraries",
        description:
          "Tailor-made private tours throughout Sri Lanka planned and guided by local Panadura operator Krishan Tours Sri Lanka.",
        provider: { "@id": organizationId },
        touristType: ["Couples", "Families", "Honeymooners", "Private Groups", "Solo Travelers"],
        itinerary: [
          { "@type": "TouristAttraction", name: "Sigiriya Lion Rock Fortress" },
          { "@type": "TouristAttraction", name: "Dambulla Royal Cave Temple" },
          { "@type": "TouristAttraction", name: "Temple of the Sacred Tooth Relic Kandy" },
          { "@type": "TouristAttraction", name: "Nuwara Eliya Tea Country" },
          { "@type": "TouristAttraction", name: "Scenic Kandy to Ella Train Journey" },
          { "@type": "TouristAttraction", name: "Yala & Udawalawe Wildlife Safaris" },
          { "@type": "TouristAttraction", name: "Galle Dutch Fort & Southern Coast" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: privateTourFaqs.map((faq) => ({
          "@type": "Question",
          name: t(faq.q),
          acceptedAnswer: {
            "@type": "Answer",
            text: t(faq.a),
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteConfig.url}${prefix || "/"}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Sri Lanka Private Tours",
            item: `${siteConfig.url}${prefix}/sri-lanka-private-tours`,
          },
        ],
      },
    ],
  };

  const themes = [
    {
      title: "Cultural Triangle & Ancient Cities",
      desc: "Climb Sigiriya at dawn, cycle the monumental stupas of Anuradhapura, and step inside Dambulla’s sacred painted caves with insightful local context.",
      image: "/images/sigiriya-panorama.webp",
      badge: "History & Devotion",
    },
    {
      title: "Tea Country & Highland Railways",
      desc: "Wind into misted hills around Nuwara Eliya, stay on a working tea estate, and ride the scenic blue train across the Nine Arches Bridge in Ella.",
      image: "/images/ella-train.webp",
      badge: "Highland Landscapes",
    },
    {
      title: "Wildlife & Ethical Safaris",
      desc: "Spot swimming elephants at Gal Oya, observe wild herds in Udawalawe, and track leopards in Yala with experienced trackers who respect wildlife boundaries.",
      image: "/images/elephants.webp",
      badge: "Ethical Nature",
    },
    {
      title: "Southern Heritage & Golden Coast",
      desc: "Walk the 17th-century ramparts of Galle Fort at sunset, savor fresh seafood curry in Mirissa, and unwind in secluded ocean villas.",
      image: "/images/coast.webp",
      badge: "Coast & Relaxation",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("Custom Tailor-Made Journeys")}
        title={t("Sri Lanka Private Tours")}
        intro={t(
          "Every route is a starting point, never a fixed script. Travel Sri Lanka privately with a dedicated chauffeur-guide, handpicked character stays, and an unhurried pace shaped around you.",
        )}
        image="/images/sigiriya-panorama.webp"
        tall
      />

      {/* Why Private Tours */}
      <section className="py-24 md:py-32" id="content">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("The Personal Advantage")}</p>
            <h2 className="display mt-4 text-[clamp(2.8rem,5.5vw,5rem)] leading-[.9]">
              {t("Travel that adapts to")} <em>{t("your pace,")}</em> {t("not a bus schedule.")}
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-7 text-black/65">
              <p>
                {t(
                  "Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka. We believe travel should leave room to breathe. When you travel privately with us, your journey has thoughtful structure, but you never have to rush through a museum to catch a group bus or wake up at 5:00 AM unless you want to.",
                )}
              </p>
              <p>
                {t(
                  "If your children are tired, we slow the morning down. If you want to spend an extra hour chatting with a cinnamon grower or sipping Ceylon tea overlooking misted valleys, the vehicle waits for you. Your licensed driver-guide is there to handle the roads, navigate local customs, and ensure your adventure is entirely effortless.",
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-black/10 bg-paper p-6">
              <Compass className="h-8 w-8 text-gold" />
              <h3 className="display mt-4 text-2xl">{t("Bespoke Routing")}</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                {t("Crafted around your dates, monsoon weather patterns, and specific interests.")}
              </p>
            </div>
            <div className="border border-black/10 bg-paper p-6">
              <HeartHandshake className="h-8 w-8 text-gold" />
              <h3 className="display mt-4 text-2xl">{t("Direct Panadura Team")}</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                {t("You deal directly with Krishan and our local team—no overseas booking brokers.")}
              </p>
            </div>
            <div className="border border-black/10 bg-paper p-6">
              <Sparkles className="h-8 w-8 text-gold" />
              <h3 className="display mt-4 text-2xl">{t("Handpicked Stays")}</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                {t("Intimate colonial bungalows, forest lodges, and seaside boutique villas.")}
              </p>
            </div>
            <div className="border border-black/10 bg-paper p-6">
              <ShieldCheck className="h-8 w-8 text-gold" />
              <h3 className="display mt-4 text-2xl">{t("Zero Pressure")}</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                {t("Never forced into commission-driven tourist gift emporiums or crowded buffets.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Themes Showcase */}
      <section className="bg-paper py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Endless Island Diversity")}
            title={
              <>
                {t("Four worlds,")}
                <br />
                <em>{t("one private journey.")}</em>
              </>
            }
            intro={t(
              "Sri Lanka lets you cross three distinct climate zones in a single afternoon. Here are the core pillars we weave into your private itinerary.",
            )}
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {themes.map((theme) => (
              <div key={theme.title} className="group border border-black/15 bg-white overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-paper/95 backdrop-blur-sm px-3 py-1 text-[.64rem] font-bold uppercase tracking-[.08em] text-jungle">
                    {t(theme.badge)}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="display text-3xl group-hover:italic">{t(theme.title)}</h3>
                  <p className="mt-3 text-xs leading-6 text-black/60">{t(theme.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Guidance */}
      <section className="bg-jungle py-24 text-white md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Transparent Investment")}
            title={
              <>
                {t("How much does a private tour")}
                <br />
                <em>{t("cost in Sri Lanka?")}</em>
              </>
            }
            intro={t(
              "We provide clear, honest estimates so you can choose the tier of comfort that matches your budget.",
            )}
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="border border-white/15 bg-white/5 p-8 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-gold">{t("Option 01")}</span>
                <h3 className="display mt-2 text-3xl">{t("Driver & Vehicle Only")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-gold">$55 – $85</span>
                  <span className="text-xs text-white/60">/ {t("day (total car)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-white/70">
                  {t(
                    "You book your own hotels and entrance tickets. We supply the dedicated private vehicle, fuel, highway tolls, driver lodging, and daily guiding.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("Max independence")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("Pay as you go")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("No booking markups")}</li>
                </ul>
              </div>
              <Link href="/sri-lanka-private-driver" className="btn-light mt-8 text-center justify-center">
                {t("Hire Private Driver")}
              </Link>
            </div>

            <div className="border border-gold bg-white/10 p-8 flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-gold px-3 py-0.5 text-[.6rem] font-bold uppercase tracking-[.1em] text-jungle">
                {t("Most Recommended")}
              </span>
              <div>
                <span className="eyebrow text-gold">{t("Option 02")}</span>
                <h3 className="display mt-2 text-3xl">{t("Boutique Private Tour")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-gold">$120 – $170</span>
                  <span className="text-xs text-white/60">/ {t("person / day")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-white/70">
                  {t(
                    "Comprehensive private journey: 3-star to 4-star boutique hotels with daily breakfast, private chauffeur vehicle, scenic train tickets, and safari jeep entries.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("Handpicked boutique stays")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("Reserved train & safari tickets")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("Full itinerary management")}</li>
                </ul>
              </div>
              <Link href="/plan-your-trip" className="btn-light mt-8 text-center justify-center">
                {t("Plan Custom Tour")}
              </Link>
            </div>

            <div className="border border-white/15 bg-white/5 p-8 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-gold">{t("Option 03")}</span>
                <h3 className="display mt-2 text-3xl">{t("Luxury Heritage Tour")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-gold">$220 – $350+</span>
                  <span className="text-xs text-white/60">/ {t("person / day")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-white/70">
                  {t(
                    "Ultra-refined Sri Lanka: Ceylon tea bungalows, luxury safari camps (Chena Huts / Leopard Safaris), 5-star colonial suites, private naturalists, and premium transfers.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("Iconic luxury properties")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("Specialist historian & trackers")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> {t("VIP arrivals & premium car")}</li>
                </ul>
              </div>
              <Link href="/plan-your-trip" className="btn-light mt-8 text-center justify-center">
                {t("Request Luxury Quote")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tour Links */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Curated Itinerary Blueprints")}
            title={
              <>
                {t("Popular private itineraries to")}
                <br />
                <em>{t("make your own.")}</em>
              </>
            }
            intro={t(
              "Browse our most popular multi-day blueprints. Every single itinerary can be tailored to your flight times and preferences.",
            )}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/sigiriya-kandy-ella-tour"
              className="border border-black/10 p-6 bg-paper hover:border-cinnamon transition-all group"
            >
              <span className="eyebrow text-cinnamon text-[.6rem]">5 Days</span>
              <h3 className="display mt-2 text-2xl group-hover:italic">Sigiriya, Kandy & Ella</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                The classic cultural and mountain train express.
              </p>
              <span className="link-arrow mt-4 text-xs font-bold uppercase">{t("View Details")} →</span>
            </Link>
            <Link
              href="/sri-lanka-7-day-tour"
              className="border border-black/10 p-6 bg-paper hover:border-cinnamon transition-all group"
            >
              <span className="eyebrow text-cinnamon text-[.6rem]">7 Days</span>
              <h3 className="display mt-2 text-2xl group-hover:italic">7-Day Sri Lanka Tour</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                Essential Sri Lanka: ancient rock, tea trails, and coast.
              </p>
              <span className="link-arrow mt-4 text-xs font-bold uppercase">{t("View Details")} →</span>
            </Link>
            <Link
              href="/sri-lanka-10-day-tour"
              className="border border-black/10 p-6 bg-paper hover:border-cinnamon transition-all group"
            >
              <span className="eyebrow text-cinnamon text-[.6rem]">10 Days</span>
              <h3 className="display mt-2 text-2xl group-hover:italic">10-Day Sri Lanka Tour</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                Balanced discovery: Culture, tea country, Yala, and Galle.
              </p>
              <span className="link-arrow mt-4 text-xs font-bold uppercase">{t("View Details")} →</span>
            </Link>
            <Link
              href="/sri-lanka-14-day-tour"
              className="border border-black/10 p-6 bg-paper hover:border-cinnamon transition-all group"
            >
              <span className="eyebrow text-cinnamon text-[.6rem]">14 Days</span>
              <h3 className="display mt-2 text-2xl group-hover:italic">14-Day Sri Lanka Tour</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                The ultimate two-week grand island exploration.
              </p>
              <span className="link-arrow mt-4 text-xs font-bold uppercase">{t("View Details")} →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-paper py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("Planning Advice")}</p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("Frequently asked questions about private tours.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Ready to start shaping your itinerary? Contact Krishan Tours Sri Lanka directly on WhatsApp for immediate local advice.",
              )}
            </p>
            <a
              href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like to design a private tour.")}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 inline-flex"
            >
              <MessageCircle size={16} /> {t("Chat on WhatsApp")}
            </a>
          </div>
          <FAQ items={privateTourFaqs} />
        </div>
      </section>

      <JsonLd data={schema} />
    </>
  );
}
