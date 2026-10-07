import type { Metadata } from "next";
import Image from "next/image";
import {
  Check,
  Clock,
  MapPin,
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
    title: "Sigiriya, Kandy & Ella Tour: 5-Day Itinerary",
    description:
      "5-day private Sigiriya, Kandy and Ella tour: Lion Rock, Dambulla cave temple, Temple of the Tooth and the famous hill-country train, with your own driver-guide.",
    path: "/sigiriya-kandy-ella-tour",
    image: "/images/nine-arches.webp",
  });

const tourFaqs = [
  {
    q: "How does the train journey work if we hire a private driver?",
    a: "This is our guests' favorite perk! On Day 4, your driver drops you off at the railway station and hands you your pre-reserved seats. While you enjoy the scenic mountain journey with just your camera and daypack, your driver transports your main luggage safely in the air-conditioned car, meeting you with a smile right on the platform when your train pulls into Ella.",
  },
  {
    q: "Is the Sigiriya Rock Fortress climb physically difficult?",
    a: "The climb consists of approximately 1,200 stone and spiral metal stairs. There are several wide rest terraces (such as the mirror wall and the lion's paws) along the ascent. We time your climb at 7:00 AM before the sun gets hot and before tour bus crowds arrive. If someone in your party prefers not to climb to the very summit, the ancient water gardens at the base are flat and serene.",
  },
  {
    q: "Can we add an elephant safari to this 5-day tour?",
    a: "Yes! The Minneriya / Kaudulla elephant corridor is just 30 minutes from Sigiriya. On Day 1 or Day 2 afternoon, we can easily arrange a private 4x4 open-top safari jeep to witness the famous elephant gathering.",
  },
  {
    q: "Can this tour end at a southern beach resort (Galle, Mirissa, Bentota)?",
    a: "Absolutely. On Day 5, instead of returning to Colombo, your private driver can drop you off at any beach resort along the southern coast (Galle, Mirissa, Tangalle, Bentota) or even nearby Yala National Park.",
  },
  {
    q: "What is included in the package price?",
    a: "Our complete 5-day package includes your private air-conditioned vehicle, dedicated driver-guide, all fuel and expressway tolls, 4 nights of boutique accommodations with daily breakfast, reserved Kandy-to-Ella train tickets, and on-trip support.",
  },
];

const itineraryDays = [
  {
    day: 1,
    title: "Into the Cultural Triangle & Pidurangala Sunset",
    location: "Sigiriya",
    driveTime: "Approx. 3.5 hrs from Airport / Negombo",
    text: "Meet your private driver at Colombo Airport or your coastal hotel. Drive inland through coconut plantations, stopping for fresh roadside king coconuts. Check into your tranquil Sigiriya forest lodge. In late afternoon, hike up Pidurangala Rock to watch the sunset paint the iconic monolith of Sigiriya in golden amber.",
    highlights: ["Scenic country drive", "Fresh thambili (king coconut) stop", "Sunset view of Lion Rock from Pidurangala"],
    image: "/images/pidurangala-sigiriya.webp",
  },
  {
    day: 2,
    title: "Sigiriya Lion Rock Fortress & Dambulla Cave Temple",
    location: "Kandy",
    driveTime: "Approx. 2.5 hrs to Kandy",
    text: "Climb the 5th-century Sigiriya Rock Fortress at first light. Wander past water gardens, ancient frescoes, and the royal palace ruins perched atop the rock. In the afternoon, explore Dambulla Royal Cave Temple—a UNESCO World Heritage sacred complex adorned with centuries-old Buddhist murals. Continue into the cool hills of Kandy.",
    highlights: ["First-light Sigiriya climb", "Dambulla painted cave complex", "Matale spice garden walk"],
    image: "/images/sigiriya-panorama.webp",
  },
  {
    day: 3,
    title: "Sacred Kandy & Royal Botanical Gardens",
    location: "Kandy",
    driveTime: "Local exploration",
    text: "Explore Sri Lanka's last royal kingdom. Stroll through the lush 147-acre Peradeniya Royal Botanical Gardens, famous for royal palms and giant Javan fig trees. Later, circle peaceful Kandy Lake and visit the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) during the captivating evening drumming puja ceremony.",
    highlights: ["Peradeniya Royal Botanical Gardens", "Kandy Lake walk", "Temple of the Tooth puja ceremony"],
    image: "/images/rainforest.webp",
  },
  {
    day: 4,
    title: "The Legendary Blue Train & Nine Arches Bridge",
    location: "Ella",
    driveTime: "Scenic train: ~6 hrs (luggage carried by car)",
    text: "Board the world's most scenic mountain train from Kandy into the highlands. Peer through open windows at endless emerald tea estates, misted valleys, and cascading waterfalls. Meet your driver at Ella station and check into your valley-view stay. Near sunset, take the forest trail to the Nine Arches Bridge as a train rumbles across the viaduct.",
    highlights: ["Reserved scenic train tickets", "Spectacular mountain passes", "Sunset at Nine Arches Bridge"],
    image: "/images/nine-arches.webp",
  },
  {
    day: 5,
    title: "Little Adam's Peak, Ravana Falls & Departure",
    location: "South Coast or Colombo",
    driveTime: "Approx. 3.5 hrs to Coast / 4.5 hrs to Airport",
    text: "Start the morning with an easy ridge hike up Little Adam's Peak for 360-degree panoramas across the Ella Gap. Stop at the thundering Ravana Waterfall before descending from the hills. Your driver transfers you safely to your next beach stay in Galle / Mirissa or back to Colombo Airport for your departure flight.",
    highlights: ["Little Adam's Peak ridge hike", "Ravana Falls photo stop", "Drop-off at beach hotel or airport"],
    image: "/images/ella-train.webp",
  },
];

export default async function SigiriyaKandyEllaPage() {
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
        name: "5-Day Sigiriya, Kandy & Ella Private Tour",
        description:
          "Sri Lanka's classic 5-day Golden Route covering Sigiriya Lion Rock, Dambulla Cave Temple, Kandy Temple of the Tooth, and the scenic mountain train to Ella.",
        provider: { "@id": organizationId },
        offers: { "@type": "Offer", price: prices["ske.package"].min, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${siteConfig.url}${prefix}/sigiriya-kandy-ella-tour` },
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
            name: "Sigiriya, Kandy & Ella Tour",
            item: `${siteConfig.url}${prefix}/sigiriya-kandy-ella-tour`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={t("5 Days · Culture & Highland Railway")}
        title={t("Sigiriya, Kandy & Ella Tour")}
        intro={t(
          "The quintessential Sri Lanka journey. Ancient sky-citadels, sacred lakeside temples, misted Ceylon tea plantations, and the world's most picturesque train ride—all guided privately by Panadura-based Krishan Tours Sri Lanka.",
        )}
        image="/images/nine-arches.webp"
        tall
      />

      {/* Overview Quick Stats */}
      <section className="border-y border-black/10 bg-paper py-8" id="content">
        <div className="shell grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Duration: 5 Days")}</p>
              <p className="text-xs text-black/60">{t("4 Nights Boutique Stays")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Key Stops")}</p>
              <p className="text-xs text-black/60">{t("Sigiriya, Kandy & Ella")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Train className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Highland Railway")}</p>
              <p className="text-xs text-black/60">{t("Reserved scenic train seats")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Private Driver-Guide")}</p>
              <p className="text-xs text-black/60">{t("AC sedan or KDH van")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Itinerary */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Day by Day Breakdown")}
            title={
              <>
                {t("Five days of")}
                <br />
                <em>{t("unforgettable Sri Lanka.")}</em>
              </>
            }
            intro={t(
              "Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka. Here is how your 5-day journey unfolds with realistic driving times and balanced pacing.",
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
                    <p className="eyebrow text-[.6rem] text-gold">{t("Key Highlights:")}</p>
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

      {/* Pricing & Booking Options */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Transparent Rates")}
            title={
              <>
                {t("Choose your preferred")}
                <br />
                <em>{t("tour package option.")}</em>
              </>
            }
            intro={t(
              "Book just the private driver-guide service if you prefer selecting your own hotels, or book our complete package including boutique stays and train seats.",
            )}
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="border border-black/15 bg-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-cinnamon">{t("Option A")}</span>
                <h3 className="display mt-2 text-3xl">{t("Driver & Vehicle Only (5 Days)")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-jungle">{priceRange(prices["ske.driver"])}</span>
                  <span className="text-xs text-black/55">/ {t("total vehicle (1-3 passengers)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/60">
                  {t(
                    "You book your own hotels in Sigiriya, Kandy, and Ella. We provide your private AC car, licensed driver-guide, fuel, all road tolls, driver lodging, and safe luggage transfer while you ride the train.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-black/70 border-t border-black/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Private dedicated chauffeur-guide for 5 full days")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All fuel, parking, and highway tolls included")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Driver meals & lodging included")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Assistance purchasing scenic train tickets")}</li>
                </ul>
              </div>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like to book the 5-Day Driver-Only Sigiriya, Kandy & Ella tour.")}
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
                <h3 className="display mt-2 text-3xl">{t("Complete Boutique Tour (5 Days)")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-jungle">{priceRange(prices["ske.package"])}</span>
                  <span className="text-xs text-black/55">/ {t("person (based on 2 travelers)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/60">
                  {t(
                    "Everything handled seamlessly: 4 nights in handpicked 3-star to 4-star boutique stays with breakfast, reserved train tickets, private vehicle, fuel, tolls, and 24/7 support.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-black/70 border-t border-black/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("4 nights boutique accommodation + breakfast")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Guaranteed reserved seats on the Kandy–Ella train")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Private AC vehicle & driver throughout")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Airport pickup and drop-off included")}</li>
                </ul>
              </div>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like a quote for the complete 5-Day Sigiriya, Kandy & Ella boutique tour.")}
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
            <p className="eyebrow text-cinnamon">{t("Tour Essentials")}</p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("Sigiriya, Kandy & Ella tour FAQs.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Need to customize this tour to include Yala Safari, Anuradhapura, or a coastal stay in Mirissa? Message Krishan on WhatsApp.",
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
