import type { Metadata } from "next";
import Image from "next/image";
import {
  Check,
  Clock,
  Compass,
  Train,
  Car,
  MessageCircle,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { getPrices } from "@/lib/content-db";
import { localizeFaqs, priceRange, priceValues } from "@/lib/money";
import { JsonLd, organizationId } from "@/components/JsonLd";

export const generateMetadata = (): Promise<Metadata> =>
  localizedMetadata({
    title: "Sri Lanka 7-Day Tour Itinerary with Driver",
    description:
      "A 7-day Sri Lanka itinerary with a private driver: Sigiriya, Kandy, Nuwara Eliya tea country, the Ella train and Galle Fort. Day-by-day route and drive times.",
    path: "/sri-lanka-7-day-tour",
    image: "/images/sigiriya-gardens.webp",
  });

const tourFaqs = [
  {
    q: "Is 7 days enough time to see Sri Lanka?",
    a: "Yes! While Sri Lanka has enough diversity for several weeks, 7 days is ideal for experiencing its core contrasts if you follow a smart route with a private driver. This itinerary covers the UNESCO Cultural Triangle, cool central tea mountains, scenic highland train, and the historic southern coast without spending entire days stuck in traffic.",
  },
  {
    q: "Can we add an elephant or leopard safari to this 7-day route?",
    a: "Yes! On Day 5 or Day 6, we can easily incorporate an afternoon safari in Udawalawe National Park (famous for hundreds of wild elephants) or Minneriya National Park on Day 2. We tailor the schedule so you don't lose time on the road.",
  },
  {
    q: "Can we spend more time relaxing on the beach?",
    a: "Of course. On Day 6 and Day 7, you can choose to stay in a barefoot coastal boutique in Mirissa, Weligama, or Bentota instead of Galle Fort, enjoying surfing, fresh seafood, and beach sunsets.",
  },
  {
    q: "What is the luggage procedure while we ride the train?",
    a: "Your private chauffeur takes care of all your main luggage. You board the train with just a light daypack and camera, and your driver meets you on the arrival platform with your vehicle and luggage.",
  },
  {
    q: "How much does the 7-day Sri Lanka private tour cost?",
    a: "Driver-only hire for 7 full days is {tour7.driver} USD total for the entire car (1–3 passengers). Our complete boutique package with 6 nights of handpicked hotels, breakfasts, and reserved train tickets starts from {tour7.package.min} USD per person based on double occupancy.",
  },
];

const itineraryDays = [
  {
    day: 1,
    title: "Arrival to Sigiriya & Sunset at Pidurangala",
    location: "Sigiriya",
    driveTime: "Approx. 3.5 hrs from Colombo Airport (CMB)",
    text: "Your private chauffeur-guide welcomes you at Colombo Airport. Travel through the lush rural heartland into the Cultural Triangle. Check into your tranquil lodge in Sigiriya. In the late afternoon, climb Pidurangala Rock to witness a golden sunset illuminating the monumental monolith of Sigiriya Lion Rock.",
    highlights: ["Airport meet & greet", "Scenic countryside drive", "Sunset hike up Pidurangala"],
    image: "/images/pidurangala-sigiriya.webp",
  },
  {
    day: 2,
    title: "Sigiriya Lion Rock & Dambulla Royal Caves",
    location: "Kandy",
    driveTime: "Approx. 2.5 hrs to Kandy",
    text: "Ascend the UNESCO-listed 5th-century Sigiriya Rock Fortress in the cool early morning. Marvel at the ancient water gardens, fresco paintings, and palace ruins. Later, explore the Dambulla Cave Temple complex, where five ancient caves house over 150 serene Buddha statues. Continue through spice-scented hills into Kandy.",
    highlights: ["Early Sigiriya fortress climb", "Dambulla painted cave complex", "Matale spice garden"],
    image: "/images/sigiriya-panorama.webp",
  },
  {
    day: 3,
    title: "Sacred Kandy & Royal Botanical Gardens",
    location: "Kandy",
    driveTime: "Local exploration",
    text: "Spend the morning strolling through the botanical splendor of Peradeniya Royal Gardens, home to majestic orchid collections and centuries-old palms. In the afternoon, circle peaceful Kandy Lake and visit the revered Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) during the evening ceremonial puja.",
    highlights: ["Peradeniya Royal Botanical Gardens", "Kandy Lake walk", "Temple of the Tooth puja ceremony"],
    image: "/images/rainforest.webp",
  },
  {
    day: 4,
    title: "Highland Tea Country & Nuwara Eliya",
    location: "Nuwara Eliya",
    driveTime: "Approx. 2.5 hrs scenic highland drive",
    text: "Ascend through dramatic mountain passes and misty valleys to Nuwara Eliya. Stop by the cascading Ramboda Falls, tour a historic working tea estate, and learn how delicate Ceylon tea leaves are harvested and processed. Enjoy an evening stroll around colonial Lake Gregory.",
    highlights: ["Ramboda Falls viewpoint", "Guided tea factory tour & tasting", "Colonial Nuwara Eliya"],
    image: "/images/tea-estate.webp",
  },
  {
    day: 5,
    title: "The Mountain Railway & Nine Arches Bridge",
    location: "Ella",
    driveTime: "Scenic train: ~2.5 hrs (luggage carried by car)",
    text: "Board the morning train for one of the most scenic stretches in the world. Pass emerald tea hills and cloud forests before pulling into the laid-back mountain town of Ella. Walk the jungle path to the historic Nine Arches Bridge just in time to see a train cross the viaduct at golden hour.",
    highlights: ["Reserved highland train seats", "Nine Arches Bridge sunset", "Ella mountain town atmosphere"],
    image: "/images/nine-arches.webp",
  },
  {
    day: 6,
    title: "Little Adam's Peak, Ravana Falls & Galle Fort",
    location: "Galle",
    driveTime: "Approx. 3.5 hrs to Galle via highway",
    text: "Hike up Little Adam’s Peak at dawn for 360-degree panoramas across the Ella Gap. After breakfast, descend past Ravana Falls to the southern coast. Arrive at 17th-century UNESCO World Heritage Galle Fort. Stroll cobblestone streets lined with artisan boutiques, Dutch colonial architecture, and sunset sea ramparts.",
    highlights: ["Little Adam's Peak ridge hike", "Ravana Falls photo stop", "Galle Fort sunset rampart walk"],
    image: "/images/coast.webp",
  },
  {
    day: 7,
    title: "Galle Fort Exploration & Airport Departure",
    location: "Colombo / Airport",
    driveTime: "Approx. 2 hrs via Southern Expressway to CMB",
    text: "Enjoy a relaxed breakfast within the historic fort walls. Pick up authentic Ceylon spices or hand-crafted gems before your driver transfers you comfortably via the modern Southern Expressway back to Colombo Airport (CMB) for your onward flight.",
    highlights: ["Morning fort stroll", "Smooth expressway drive", "Airport departure assistance"],
    image: "/images/mirissa.webp",
  },
];

export default async function SriLanka7DayTourPage() {
  const { t, locale } = await getI18n();
  const prices = getPrices();
  const pv = priceValues(prices);
  const faqs = localizeFaqs(tourFaqs, t, pv);
  const prefix = locale === "en" ? "" : `/${locale}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: "7-Day Sri Lanka Highlights Private Tour",
        description:
          "The perfect 1-week private tour of Sri Lanka covering Sigiriya, Kandy, Nuwara Eliya tea country, Ella scenic train, and Galle Dutch Fort.",
        provider: { "@id": organizationId },
        offers: { "@type": "Offer", price: prices["tour7.package"].min, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${siteConfig.url}${prefix}/sri-lanka-7-day-tour` },
        itinerary: itineraryDays.map((d) => ({
          "@type": "TouristAttraction",
          name: `Day ${d.day}: ${d.title} (${d.location})`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
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
            name: "Sri Lanka 7-Day Tour",
            item: `${siteConfig.url}${prefix}/sri-lanka-7-day-tour`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={t("7 Days · Culture, Highlands & Coast")}
        title={t("Sri Lanka 7-Day Tour")}
        intro={t(
          "The essential one-week journey across the teardrop island. Ancient rock citadels, misted tea trails, the world's most cinematic mountain railway, and 17th-century Galle Fort—paced perfectly with Panadura-based Krishan Tours Sri Lanka.",
        )}
        image="/images/sigiriya-gardens.webp"
        tall
      />

      {/* Highlights Bar */}
      <section className="border-y border-black/10 bg-paper py-8" id="content">
        <div className="shell grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Duration: 7 Days")}</p>
              <p className="text-xs text-black/60">{t("6 Nights Boutique Stays")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Compass className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Smart Circuit")}</p>
              <p className="text-xs text-black/60">{t("No backtracking")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Train className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Highland Train")}</p>
              <p className="text-xs text-black/60">{t("Reserved scenic seats")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Private Vehicle")}</p>
              <p className="text-xs text-black/60">{t("AC sedan or KDH van")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Day-by-Day */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("The 7-Day Itinerary")}
            title={
              <>
                {t("One week in Sri Lanka,")}
                <br />
                <em>{t("crafted with room to breathe.")}</em>
              </>
            }
            intro={t(
              "Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka. Here is our recommended day-by-day plan for a seamless 7-day trip.",
            )}
          />

          <div className="mt-16 space-y-12">
            {itineraryDays.map((item) => (
              <div
                key={item.day}
                className="grid gap-8 border-t border-black/15 pt-8 md:grid-cols-[6rem_1.2fr_1fr] items-start"
              >
                <div>
                  <span className="display text-4xl text-cinnamon">Day 0{item.day}</span>
                  <span className="block mt-1 text-xs font-bold uppercase tracking-wider text-black/50">
                    {item.location}
                  </span>
                </div>

                <div>
                  <h3 className="display text-3xl">{t(item.title)}</h3>
                  <p className="mt-1 text-xs font-semibold text-black/50">{item.driveTime}</p>
                  <p className="mt-4 text-xs leading-6 text-black/65">{t(item.text)}</p>

                  <div className="mt-6 border-t border-black/10 pt-4">
                    <p className="eyebrow text-[.6rem] text-gold">{t("Day Highlights:")}</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-black/75">
                      {item.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2">
                          <Check size={13} className="text-emerald-700 shrink-0" />
                          <span>{t(h)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="relative aspect-[16/11] overflow-hidden bg-paper">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Booking */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Transparent Rates")}
            title={
              <>
                {t("7-Day tour package options,")}
                <br />
                <em>{t("customized to your style.")}</em>
              </>
            }
            intro={t(
              "Choose between booking just your private car and driver, or our complete boutique package including character hotels and train tickets.",
            )}
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="border border-black/15 bg-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-cinnamon">{t("Option A")}</span>
                <h3 className="display mt-2 text-3xl">{t("Driver & Vehicle Only (7 Days)")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-jungle">{priceRange(prices["tour7.driver"])}</span>
                  <span className="text-xs text-black/55">/ {t("total vehicle (1-3 passengers)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/60">
                  {t(
                    "You book your own hotels along the route. We provide your dedicated private chauffeur-guide, AC vehicle, fuel, highway tolls, parking, and driver lodging for the entire 7 days.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-black/70 border-t border-black/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("7 full days private vehicle & driver-guide")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Unlimited mileage across agreed itinerary")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All expressway tolls and driver lodging included")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Luggage transfer while you ride the mountain train")}</li>
                </ul>
              </div>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like to book the 7-Day Driver-Only service.")}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-8 text-center justify-center"
              >
                <MessageCircle size={15} /> {t("Book Driver Option")}
              </a>
            </div>

            <div className="border border-black/15 bg-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-cinnamon">{t("Option B")}</span>
                <h3 className="display mt-2 text-3xl">{t("Complete Boutique Tour (7 Days)")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-jungle">{priceRange(prices["tour7.package"])}</span>
                  <span className="text-xs text-black/55">/ {t("person (based on 2 travelers)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/60">
                  {t(
                    "Everything coordinated: 6 nights in handpicked 3-star to 4-star boutique hotels with daily breakfast, reserved scenic train tickets, private vehicle, and 24/7 on-road concierge.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-black/70 border-t border-black/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("6 nights boutique stays + daily breakfast")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Guaranteed reserved seats on the scenic train")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All airport pickups, transfers & highway tolls")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Fully customizable to your flight schedule")}</li>
                </ul>
              </div>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like a quote for the complete 7-Day Boutique Tour package.")}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-8 text-center justify-center"
              >
                <MessageCircle size={15} /> {t("Book Complete Package")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("Planning Insights")}</p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("7-Day tour FAQs.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Need to add an elephant safari or adjust for flight arrivals? Speak directly with Krishan on WhatsApp.",
              )}
            </p>
          </div>
          <FAQ items={faqs} />
        </div>
      </section>

      <JsonLd data={schema} />
    </>
  );
}
