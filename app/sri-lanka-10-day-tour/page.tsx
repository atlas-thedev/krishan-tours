import type { Metadata } from "next";
import Image from "next/image";
import {
  Check,
  Clock,
  Compass,
  Train,
  ShieldCheck,
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
    title: "Sri Lanka 10-Day Tour Itinerary with Driver",
    description:
      "A 10-day Sri Lanka itinerary with a private driver: Sigiriya, Kandy, tea country, the Ella train, a Yala safari and the Galle coast. Day-by-day plan.",
    path: "/sri-lanka-10-day-tour",
    image: "/images/tea-hills.webp",
  });

const tourFaqs = [
  {
    q: "Why is 10 days considered the ideal duration for Sri Lanka?",
    a: "A 10-day itinerary hits the sweet spot for first-time visitors. It provides sufficient time to experience all three of Sri Lanka's contrasting worlds—the ancient UNESCO Cultural Triangle, the mist-shrouded tea mountains, and the tropical wild south—without having to spend more than 2 to 3.5 hours on the road on any single day.",
  },
  {
    q: "Which safari park should we choose: Yala or Udawalawe?",
    a: "Yala National Park is world-famous for having one of the highest leopard densities on the planet, plus sloth bears, crocodiles, and elephants. Udawalawe National Park guarantees sightings of vast elephant herds with virtually no crowds. We can easily recommend the ideal park based on the month of your visit.",
  },
  {
    q: "Can we extend our stay on the beach at the end of the tour?",
    a: "Yes! Many guests add 2 to 4 extra nights in Mirissa, Weligama, Tangalle, or Bentota for surfing, yoga, or relaxation. Your private driver can either stay with you for local beach hopping or return after dropping you off at your resort.",
  },
  {
    q: "Are the train tickets guaranteed?",
    a: "Yes. Sri Lanka Railways opens ticket reservations 30 days before travel, and they sell out in seconds. As a registered Panadura-based operator, Krishan Tours Sri Lanka secures reserved observation or 2nd-class seats for you well in advance.",
  },
  {
    q: "How much does the 10-day private tour cost?",
    a: "Our private driver-guide service for 10 full days is {tour10.driver} USD total for the entire car (1–3 passengers). Our complete boutique package, including 9 nights of handpicked accommodations with daily breakfast, private vehicle, train tickets, and safari jeep, starts from {tour10.package.min} USD per person based on double occupancy.",
  },
];

const itineraryDays = [
  {
    day: 1,
    title: "Arrival to Negombo Lagoon",
    location: "Negombo",
    driveTime: "Approx. 25 mins from Colombo Airport (CMB)",
    text: "Meet your private chauffeur-guide upon landing at Colombo Airport. A short transfer brings you to a relaxing lagoon-side hotel in Negombo to decompress from your international flight and adjust to the tropical rhythm of the island.",
    highlights: ["Airport meet & greet", "Short arrival drive", "Lagoon sunset dinner"],
    image: "/images/coast.webp",
  },
  {
    day: 2,
    title: "Anuradhapura Ancient Capital to Sigiriya",
    location: "Sigiriya",
    driveTime: "Approx. 3.5 hrs to Anuradhapura, 1.5 hrs to Sigiriya",
    text: "Travel north into the dry zone to explore Anuradhapura—Sri Lanka's first capital established in the 4th century BC. Cycle between colossal brick stupas, ancient bathing pools, and the sacred Sri Maha Bodhi tree. In the late afternoon, proceed to your forest lodge in Sigiriya.",
    highlights: ["Sacred Sri Maha Bodhi tree", "Ruwanwelisaya stupa", "Tranquil forest lodge check-in"],
    image: "/images/anuradhapura.webp",
  },
  {
    day: 3,
    title: "Sigiriya Lion Rock & Minneriya Elephant Gathering",
    location: "Sigiriya",
    driveTime: "Local exploration & 30 min safari transfer",
    text: "Climb the monumental 5th-century Sigiriya Rock Fortress at 7:00 AM before the heat. Explore the ancient water gardens and the mirror wall frescoes. After lunch, embark on an open-top 4x4 safari in Minneriya or Kaudulla National Park to witness hundreds of wild elephants grazing around the reservoir.",
    highlights: ["First-light Sigiriya climb", "Ancient fresco gallery", "Minneriya wild elephant safari"],
    image: "/images/pidurangala-sigiriya.webp",
  },
  {
    day: 4,
    title: "Dambulla Royal Caves into Kandy",
    location: "Kandy",
    driveTime: "Approx. 2.5 hrs to Kandy",
    text: "Visit the UNESCO-listed Dambulla Cave Temple, walking through five cavernous shrines carved with ancient Buddhist frescoes and gold-leaf statues. Drive through the aromatic spice gardens of Matale before arriving in the highland city of Kandy as temple bells echo across the lake.",
    highlights: ["Dambulla cave temple murals", "Matale spice garden", "Kandy lakeside evening walk"],
    image: "/images/dambulla-cave.webp",
  },
  {
    day: 5,
    title: "Kandy Royal Botanical Gardens & Sacred Tooth Relic",
    location: "Kandy",
    driveTime: "Local exploration",
    text: "Stroll through the 147-acre Peradeniya Royal Botanical Gardens, famous for soaring palm avenues and an impressive orchid house. In the evening, witness the revered daily puja drumming ceremony at the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa).",
    highlights: ["Peradeniya Royal Botanical Gardens", "Temple of the Tooth puja ceremony", "Traditional Kandyan arts"],
    image: "/images/rainforest.webp",
  },
  {
    day: 6,
    title: "Highland Tea Country & Nuwara Eliya",
    location: "Nuwara Eliya",
    driveTime: "Approx. 2.5 hrs scenic ascent",
    text: "Wind through spectacular emerald mountains, stopping at Ramboda Falls. Tour a working tea factory on an estate bungalow property, discovering the artisanal art of plucking and drying orthodox Ceylon tea. Settle into the cool mountain town of Nuwara Eliya.",
    highlights: ["Ramboda Falls", "Working tea factory walk & tasting", "Highland colonial architecture"],
    image: "/images/tea-estate.webp",
  },
  {
    day: 7,
    title: "The Scenic Highland Railway & Ella",
    location: "Ella",
    driveTime: "Scenic train: ~2.5 hrs (luggage carried by car)",
    text: "Board the world-famous mountain train from Nanu Oya to Ella. Gaze through open windows at misty ravines, waterfalls, and tea pluckers. Meet your driver at Ella station. Near sunset, hike through the bamboo forest to the Nine Arches Bridge.",
    highlights: ["Reserved scenic train seats", "Spectacular mountain passes", "Nine Arches Bridge at golden hour"],
    image: "/images/nine-arches.webp",
  },
  {
    day: 8,
    title: "Little Adam's Peak & Yala Leopard Safari",
    location: "Yala",
    driveTime: "Approx. 2 hrs descent to Yala",
    text: "Hike Little Adam's Peak at first light for breathtaking vistas across Ella Gap. Descend through the southern plains past Ravana Falls into Yala. Board your private 4x4 safari jeep for an afternoon game drive tracking wild leopards, sloth bears, and marsh crocodiles.",
    highlights: ["Little Adam's Peak sunrise", "Ravana Falls stop", "Private 4x4 jeep safari in Yala"],
    image: "/images/elephants.webp",
  },
  {
    day: 9,
    title: "Southern Coast, Stilt Fishermen & Galle Fort",
    location: "Galle",
    driveTime: "Approx. 2.5 hrs coastal drive",
    text: "Follow the coastal road west past coconut palms, stopping to see traditional stilt fishermen along the shallow reefs of Ahangama. Enter Galle Dutch Fort in the late afternoon. Walk the 17th-century ramparts as the Indian Ocean waves crash below at sunset.",
    highlights: ["Southern coast scenic drive", "Stilt fishermen photo stop", "Galle Fort sunset rampart walk"],
    image: "/images/coast.webp",
  },
  {
    day: 10,
    title: "Galle Fort, Panadura & Departure Transfer",
    location: "Colombo / Airport",
    driveTime: "Approx. 2 hrs via Southern Expressway to CMB",
    text: "Take a relaxed morning to browse artisan shops, gem studios, and cafes within the fort walls. Your driver transfers you comfortably along the Southern Expressway—passing Krishan Tours' hometown of Panadura—directly to Colombo Airport (CMB) for your flight home.",
    highlights: ["Historic fort boutique shopping", "Smooth highway transfer", "Airport departure assistance"],
    image: "/images/mirissa.webp",
  },
];

export default async function SriLanka10DayTourPage() {
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
        name: "10-Day Sri Lanka Culture, Tea Country & Safari Private Tour",
        description:
          "The ideal 10-day Sri Lanka private tour covering Anuradhapura, Sigiriya, Kandy, Nuwara Eliya, Ella train, Yala safari, and Galle Fort.",
        provider: { "@id": organizationId },
        offers: { "@type": "Offer", price: prices["tour10.package"].min, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${siteConfig.url}${prefix}/sri-lanka-10-day-tour` },
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
            name: "Sri Lanka 10-Day Tour",
            item: `${siteConfig.url}${prefix}/sri-lanka-10-day-tour`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={t("10 Days · The Classic Island Circuit")}
        title={t("Sri Lanka 10-Day Tour")}
        intro={t(
          "The definitive balanced journey. Ancient kingdoms, Sigiriya Lion Rock, sacred Kandy, misted tea estates, the legendary highland train, a Yala wildlife safari, and Galle's golden ramparts—all guided privately by Panadura-based Krishan Tours Sri Lanka.",
        )}
        image="/images/tea-hills.webp"
        tall
      />

      {/* Highlights Bar */}
      <section className="border-y border-black/10 bg-paper py-8" id="content">
        <div className="shell grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Duration: 10 Days")}</p>
              <p className="text-xs text-black/60">{t("9 Nights Boutique Stays")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Compass className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Balanced Pacing")}</p>
              <p className="text-xs text-black/60">{t("Short daily drive times")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Train className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Highland Train")}</p>
              <p className="text-xs text-black/60">{t("Reserved observation seats")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Ethical Wildlife Safari")}</p>
              <p className="text-xs text-black/60">{t("Private 4x4 jeep & tracker")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Day-by-Day */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Day by Day Exploration")}
            title={
              <>
                {t("Ten days across")}
                <br />
                <em>{t("ancient and wild Sri Lanka.")}</em>
              </>
            }
            intro={t(
              "Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka. Here is our signature 10-day itinerary crafted to show you the best of the island.",
            )}
          />

          <div className="mt-16 space-y-12">
            {itineraryDays.map((item) => (
              <div
                key={item.day}
                className="grid gap-8 border-t border-black/15 pt-8 md:grid-cols-[6rem_1.2fr_1fr] items-start"
              >
                <div>
                  <span className="display text-4xl text-cinnamon">
                    {item.day < 10 ? `Day 0${item.day}` : `Day ${item.day}`}
                  </span>
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
            eyebrow={t("Clear Transparent Pricing")}
            title={
              <>
                {t("10-Day tour package options,")}
                <br />
                <em>{t("tailored around your comfort.")}</em>
              </>
            }
            intro={t(
              "Book only your private driver-guide, or book our full boutique package with character hotels, safari jeeps, and train seats.",
            )}
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="border border-black/15 bg-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-cinnamon">{t("Option A")}</span>
                <h3 className="display mt-2 text-3xl">{t("Driver & Vehicle Only (10 Days)")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-jungle">{priceRange(prices["tour10.driver"])}</span>
                  <span className="text-xs text-black/55">/ {t("total vehicle (1-3 passengers)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/60">
                  {t(
                    "You book your own stays across the island. We provide your dedicated private chauffeur-guide, AC car, fuel, expressway tolls, parking fees, and driver lodging for all 10 days.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-black/70 border-t border-black/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("10 full days private vehicle & driver-guide")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Unlimited mileage across agreed route")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All expressway tolls and driver expenses included")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Luggage transfer while you ride the mountain train")}</li>
                </ul>
              </div>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like to book the 10-Day Driver-Only option.")}
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
                <h3 className="display mt-2 text-3xl">{t("Complete Boutique Tour (10 Days)")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-jungle">{priceRange(prices["tour10.package"])}</span>
                  <span className="text-xs text-black/55">/ {t("person (based on 2 travelers)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/60">
                  {t(
                    "9 nights in handpicked 3-star to 4-star boutique hotels with breakfast, private vehicle, fuel, highway tolls, reserved train tickets, and a private 4x4 safari jeep with tracker.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-black/70 border-t border-black/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("9 nights boutique hotels + daily breakfast")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Guaranteed reserved seats on the mountain train")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Private 4x4 safari jeep with expert naturalist")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All airport pickups, drop-offs & expressway tolls")}</li>
                </ul>
              </div>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like a quote for the complete 10-Day Boutique Tour package.")}
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
            <p className="eyebrow text-cinnamon">{t("Tour Details")}</p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("10-Day tour FAQs.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Need to customize stops or upgrade to luxury colonial tea bungalows? Speak directly with Krishan on WhatsApp.",
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
