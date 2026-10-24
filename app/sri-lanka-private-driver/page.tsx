import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import {
  Check,
  X,
  ShieldCheck,
  Fuel,
  Clock,
  Compass,
  MessageCircle,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { getPrices } from "@/lib/content-db";
import { localizeFaqs, money, priceRange, priceValues } from "@/lib/money";
import { JsonLd, organizationId } from "@/components/JsonLd";

export const generateMetadata = (): Promise<Metadata> =>
  localizedMetadata({
    title: "Private Driver in Sri Lanka from {price}/Day",
    description:
      "Hire a licensed, English-speaking private driver in Sri Lanka from {price}/day. AC car or van, fuel, tolls and driver lodging included. No shopping commissions.",
    values: { price: money(getPrices()["driver.sedan"].min) },
    path: "/sri-lanka-private-driver",
    image: "/images/tea-estate.webp",
  });

const driverFaqs = [
  {
    q: "How much does a private driver cost in Sri Lanka?",
    a: "Private car and driver rates in Sri Lanka typically range between {driver.sedan.min} and {driver.sedan.max} USD per day for a comfortable air-conditioned sedan (1–3 passengers), and {driver.van.min} to {driver.van.max} USD per day for a spacious Toyota KDH van (4–8 passengers). With Krishan Tours Sri Lanka, our daily rate covers your vehicle, fuel, highway tolls, parking fees, insurance, and the driver’s own meals and accommodation.",
  },
  {
    q: "Do I need to pay for the driver's meals and accommodation?",
    a: "No extra surprises. Most 3-star to 5-star hotels and safari lodges across Sri Lanka provide complimentary driver quarters. In boutique villas or remote guesthouses where driver quarters are not available, driver sustenance is already accounted for in our clear daily rate. You never have to worry about finding or funding lodging for your driver.",
  },
  {
    q: "Can we modify our itinerary while on the road?",
    a: "Yes, absolutely. Flexibility is the #1 advantage of booking a private driver with Krishan Tours Sri Lanka. If you want to wake up earlier for sunrise photos, linger longer at a tea plantation, stop for roadside king coconuts, or detour to a local waterfall, your driver accommodates your rhythm.",
  },
  {
    q: "What is the customary tip for a private driver in Sri Lanka?",
    a: "Tipping is customary in Sri Lanka as a recognition of good hospitality. If you are delighted with your driver-guide’s attentiveness, safety, and local guidance, an average gratuity of ({driver.tip} USD) per day from your group is standard and deeply appreciated.",
  },
  {
    q: "How does airport pickup work at Colombo Bandaranaike (CMB)?",
    a: "Your driver tracks your flight arrival in real time. Once you collect your baggage and walk out into the arrivals lobby, Krishan or your designated driver will be waiting with a personalized nameboard. Even if your flight is delayed, there are zero waiting surcharges.",
  },
  {
    q: "Why hire Krishan Tours Sri Lanka instead of hailing taxis or renting a car?",
    a: "Driving yourself in Sri Lanka is notoriously stressful due to left-hand traffic, mountain switchbacks, wandering wildlife, and unpredictable buses. Taxis booked piecemeal leave you stranded in hill stations or remote parks. A dedicated private driver from Panadura gives you air-conditioned peace of mind, vetted local knowledge, and effortless travel from coast to coast.",
  },
];

export default async function PrivateDriverPage() {
  const { t, locale } = await getI18n();
  const prices = getPrices();
  const pv = priceValues(prices);
  const faqs = localizeFaqs(driverFaqs, t, pv);
  const prefix = locale === "en" ? "" : `/${locale}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Sri Lanka Private Driver & Chauffeur Guide",
        serviceType: "Private Transportation & Guided Tours",
        provider: { "@id": organizationId },
        areaServed: {
          "@type": "Country",
          name: "Sri Lanka",
        },
        description:
          "Panadura-based private driver service offering air-conditioned sedans and vans with licensed English-speaking chauffeur-guides throughout Sri Lanka.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: String(prices["driver.sedan"].min),
          highPrice: String(prices["driver.van"].max ?? prices["driver.van"].min),
          priceValidUntil: "2027-12-31",
        },
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
            name: "Sri Lanka Private Driver",
            item: `${siteConfig.url}${prefix}/sri-lanka-private-driver`,
          },
        ],
      },
    ],
  };

  const whatsappInquiry = `${siteConfig.url} - Hello Krishan Tours Sri Lanka, I would like to inquire about hiring a private driver for my upcoming trip to Sri Lanka.`;

  return (
    <>
      <PageHero
        eyebrow={t("Panadura-Based Private Driver Service")}
        title={t("Sri Lanka Private Driver")}
        intro={t(
          "Travel across Sri Lanka in total comfort with a licensed, English-speaking private driver-guide. Modern air-conditioned fleet, transparent daily pricing, and the freedom to explore at your own pace.",
        )}
        image="/images/tea-estate.webp"
        tall
      />

      {/* Trust & Key Metrics Bar */}
      <section className="border-y border-black/10 bg-paper py-8">
        <div className="shell grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-9 w-9 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Licensed & Insured")}</p>
              <p className="text-xs text-black/60">{t("SLTDA Tourist Driver-Guides")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Fuel className="h-9 w-9 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("All-Inclusive Daily Rates")}</p>
              <p className="text-xs text-black/60">{t("Fuel, tolls & parking covered")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="h-9 w-9 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("100% Flexible Timing")}</p>
              <p className="text-xs text-black/60">{t("Stop whenever you wish")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Compass className="h-9 w-9 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Local Island Insights")}</p>
              <p className="text-xs text-black/60">{t("Avoid crowds & tourist traps")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Hire Section */}
      <section className="py-24 md:py-32" id="content">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("Stress-Free Travel")}</p>
            <h2 className="display mt-4 text-[clamp(2.8rem,5.5vw,5rem)] leading-[.9]">
              {t("Why hiring a private driver is the")} <em>{t("smartest choice")}</em> {t("in Sri Lanka.")}
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-7 text-black/65">
              <p>
                {t(
                  "Sri Lanka is one of the most biodiverse, culturally rich islands in the world—but traversing its narrow mountain passes, busy market towns, and winding coast roads can be exhausting for overseas visitors. Public buses can be crowded, trains do not reach every hidden temple or safari gate, and renting a self-drive car is notoriously demanding.",
                )}
              </p>
              <p>
                {t(
                  "With Krishan Tours Sri Lanka, you get far more than a chauffeur behind the wheel. You get a trusted local companion from Panadura who understands the nuances of island travel: which mountain road was cleared after rain, the freshest roadside fruit stalls, how to time Sigiriya Lion Rock before the tour bus crowds, and where to catch the afternoon light over tea estates.",
                )}
              </p>
              <p>
                {t(
                  "Your air-conditioned vehicle remains exclusively yours for the entire trip. Keep your bags secure, cool off between historical sites, and feel free to adjust your departure times every single morning.",
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-sm bg-paper p-8 md:p-12 border border-black/10">
            <p className="eyebrow text-gold">{t("The Krishan Tours Guarantee")}</p>
            <h3 className="display mt-3 text-3xl">{t("No Commissions. No Pressure.")}</h3>
            <p className="mt-4 text-xs leading-6 text-black/65">
              {t(
                "Many budget drivers in Sri Lanka survive on heavy kickbacks from overpriced spice gardens, gem shops, and souvenir emporiums. At Krishan Tours Sri Lanka, we operate strictly on transparent daily rates. We will never push you into unwanted shopping stops. Our loyalty is entirely with you.",
              )}
            </p>
            <div className="mt-8 border-t border-black/15 pt-6">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-gold">
                  <Image src="/images/krishan.webp" alt="Krishan, Founder" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm text-jungle">Krishan</p>
                  <p className="text-xs text-black/55">{t("Founder & Licensed Chauffeur-Guide, Panadura")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet & Transparent Pricing */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Modern, Air-Conditioned Fleet")}
            title={
              <>
                {t("Transparent vehicle &")}
                <br />
                <em>{t("daily driver rates.")}</em>
              </>
            }
            intro={t(
              "No hidden fees or surprise fuel charges. Choose the vehicle that fits your group size and luggage needs.",
            )}
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Sedan Card */}
            <div className="border border-black/15 bg-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-cinnamon">{t("Couples & Solo Travelers")}</span>
                  <span className="bg-jungle/10 px-3 py-1 text-xs font-bold text-jungle">{t("Most Popular")}</span>
                </div>
                <h3 className="display mt-4 text-4xl">{t("Air-Conditioned Sedan")}</h3>
                <p className="mt-1 text-xs text-black/55">{t("Toyota Premio / Axio / Prius or similar")}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="display text-5xl text-jungle">{priceRange(prices["driver.sedan"])}</span>
                  <span className="text-xs text-black/55">/ {t("day (USD)")}</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-black/60">
                  {t("Ideal for 1 to 3 passengers with 2-3 standard suitcases and daypacks. Excellent fuel economy, quiet ride, and dual air-conditioning.")}
                </p>
                <ul className="mt-8 space-y-3 border-t border-black/10 pt-6 text-xs text-black/70">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Private dedicated driver-guide")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All fuel and expressway highway tolls")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Driver meals & lodging included")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Comprehensive passenger insurance")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Free Wi-Fi & chilled bottled water")}</li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl(`Hello Krishan Tours Sri Lanka, I would like to book a private sedan driver.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-center justify-center flex-1"
                >
                  <MessageCircle size={15} /> {t("Book on WhatsApp")}
                </a>
                <Link href="/plan-your-trip" className="btn-outline text-center justify-center">
                  {t("Custom Proposal")}
                </Link>
              </div>
            </div>

            {/* Van Card */}
            <div className="border border-black/15 bg-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-cinnamon">{t("Families & Small Groups")}</span>
                  <span className="bg-gold/20 px-3 py-1 text-xs font-bold text-jungle">{t("High Comfort")}</span>
                </div>
                <h3 className="display mt-4 text-4xl">{t("Toyota KDH Van")}</h3>
                <p className="mt-1 text-xs text-black/55">{t("Toyota HiAce KDH Super GL / Grand Cabin")}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="display text-5xl text-jungle">{priceRange(prices["driver.van"])}</span>
                  <span className="text-xs text-black/55">/ {t("day (USD)")}</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-black/60">
                  {t("Ideal for 4 to 8 passengers with generous luggage capacity. Reclining captain seats, high roof, dual climate control, and elevated panoramic sightseeing windows.")}
                </p>
                <ul className="mt-8 space-y-3 border-t border-black/10 pt-6 text-xs text-black/70">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Senior English-speaking chauffeur-guide")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All fuel and expressway highway tolls")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Driver meals & lodging included")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("High-capacity luggage space")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Baby car seat available on request")}</li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl(`Hello Krishan Tours Sri Lanka, I would like to book a private KDH van driver.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-center justify-center flex-1"
                >
                  <MessageCircle size={15} /> {t("Book on WhatsApp")}
                </a>
                <Link href="/plan-your-trip" className="btn-outline text-center justify-center">
                  {t("Custom Proposal")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Included vs Excluded Table */}
      <section className="bg-jungle py-24 text-white md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Clear & Honest Pricing")}
            title={
              <>
                {t("What is included with")}
                <br />
                <em>{t("your private driver.")}</em>
              </>
            }
            intro={t(
              "We believe in 100% transparency. Here is exactly what our daily rate covers, and what you handle independently.",
            )}
          />

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div className="border border-white/15 bg-white/5 p-8">
              <h3 className="display text-3xl text-gold flex items-center gap-3">
                <Check className="text-gold" /> {t("Included In Your Daily Rate")}
              </h3>
              <ul className="mt-6 space-y-4 text-xs leading-6 text-white/80">
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-gold shrink-0 mt-1" />
                  <span>{t("Dedicated licensed English-speaking chauffeur-guide for the entire duration.")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-gold shrink-0 mt-1" />
                  <span>{t("All fuel (petrol/diesel) with unlimited mileage for your agreed itinerary.")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-gold shrink-0 mt-1" />
                  <span>{t("All Southern Expressway, Central Expressway, and airport toll charges.")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-gold shrink-0 mt-1" />
                  <span>{t("All vehicle parking tickets, municipality fees, and bridge tolls.")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-gold shrink-0 mt-1" />
                  <span>{t("Driver's accommodation and all meals covered across the island.")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-gold shrink-0 mt-1" />
                  <span>{t("Airport meet & greet with personalized arrival signboard.")}</span>
                </li>
              </ul>
            </div>

            <div className="border border-white/15 bg-white/5 p-8">
              <h3 className="display text-3xl text-white/80 flex items-center gap-3">
                <X className="text-white/60" /> {t("Not Included (Paid Directly By You)")}
              </h3>
              <ul className="mt-6 space-y-4 text-xs leading-6 text-white/70">
                <li className="flex items-start gap-2.5">
                  <X size={16} className="text-white/50 shrink-0 mt-1" />
                  <span>{t("Your personal accommodation and meals (we can recommend or book handpicked stays).")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X size={16} className="text-white/50 shrink-0 mt-1" />
                  <span>{t("Entrance tickets to UNESCO cultural monuments, temples, and botanical gardens.")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X size={16} className="text-white/50 shrink-0 mt-1" />
                  <span>{t("National park safari jeep hire (Yala, Udawalawe, Minneriya) and park entry fees.")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X size={16} className="text-white/50 shrink-0 mt-1" />
                  <span>{t("Scenic hill country train tickets (we help arrange reserved seats in advance).")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X size={16} className="text-white/50 shrink-0 mt-1" />
                  <span>{t("Discretionary driver gratuity/tip based on your satisfaction.")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Routes Cross-Links */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Explore Popular Routes")}
            title={
              <>
                {t("Pair your driver with")}
                <br />
                <em>{t("an island itinerary.")}</em>
              </>
            }
            intro={t(
              "Not sure where to begin? Here are our most popular routes, each crafted to showcase Sri Lanka at a comfortable pace.",
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
                The classic Golden Triangle and scenic highland train.
              </p>
              <span className="link-arrow mt-4 text-xs font-bold uppercase">{t("View Tour")} →</span>
            </Link>
            <Link
              href="/sri-lanka-7-day-tour"
              className="border border-black/10 p-6 bg-paper hover:border-cinnamon transition-all group"
            >
              <span className="eyebrow text-cinnamon text-[.6rem]">7 Days</span>
              <h3 className="display mt-2 text-2xl group-hover:italic">7-Day Sri Lanka Tour</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                Ancient capitals, emerald tea hills, and Galle ramparts.
              </p>
              <span className="link-arrow mt-4 text-xs font-bold uppercase">{t("View Tour")} →</span>
            </Link>
            <Link
              href="/sri-lanka-10-day-tour"
              className="border border-black/10 p-6 bg-paper hover:border-cinnamon transition-all group"
            >
              <span className="eyebrow text-cinnamon text-[.6rem]">10 Days</span>
              <h3 className="display mt-2 text-2xl group-hover:italic">10-Day Sri Lanka Tour</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                Culture, tea country, Yala leopard safari, and south coast.
              </p>
              <span className="link-arrow mt-4 text-xs font-bold uppercase">{t("View Tour")} →</span>
            </Link>
            <Link
              href="/sri-lanka-14-day-tour"
              className="border border-black/10 p-6 bg-paper hover:border-cinnamon transition-all group"
            >
              <span className="eyebrow text-cinnamon text-[.6rem]">14 Days</span>
              <h3 className="display mt-2 text-2xl group-hover:italic">14-Day Sri Lanka Tour</h3>
              <p className="mt-2 text-xs leading-5 text-black/60">
                The grand island journey: UNESCO sites, wildlife, and coast.
              </p>
              <span className="link-arrow mt-4 text-xs font-bold uppercase">{t("View Tour")} →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-paper py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("Common Questions")}</p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("Everything to know about hiring a driver in Sri Lanka.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Have specific questions about car seats, multi-week routes, or driver quarters? Feel free to contact Krishan Tours Sri Lanka directly on WhatsApp.",
              )}
            </p>
            <a
              href={whatsappUrl(whatsappInquiry)}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 inline-flex"
            >
              <MessageCircle size={16} /> {t("Chat on WhatsApp")}
            </a>
          </div>
          <FAQ items={faqs} />
        </div>
      </section>

      <JsonLd data={schema} />
    </>
  );
}
