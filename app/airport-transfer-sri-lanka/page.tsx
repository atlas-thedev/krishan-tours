import type { Metadata } from "next";
import Link from "@/components/LocalizedLink";
import {
  Plane,
  Clock,
  ShieldCheck,
  Sparkles,
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
    title: "Sri Lanka Airport Taxi & CMB Transfers 24/7",
    description:
      "24/7 private Colombo Airport (CMB) taxi and transfers to Colombo, Negombo, Bentota, Galle, Kandy and Sigiriya. Fixed prices, flight tracking and tolls included.",
    path: "/airport-transfer-sri-lanka",
    image: "/images/coast.webp",
  });

const transferFaqs = [
  {
    q: "Where will my driver meet me at Colombo Airport (CMB)?",
    a: "After you clear customs and collect your luggage, walk into the main arrivals lobby. Your driver from Krishan Tours Sri Lanka will be standing directly by the passenger exit barrier holding a clear, personalized nameboard with your name.",
  },
  {
    q: "What happens if my flight is delayed or arrives early in the morning?",
    a: "We track your flight number in real-time. Whether your flight is delayed by 30 minutes or 4 hours, your driver adjusts pickup timing accordingly. We provide 24/7 service and never charge extra waiting fees for delayed flights.",
  },
  {
    q: "Are expressway highway tolls included in the price?",
    a: "Yes! All prices quoted by Krishan Tours Sri Lanka are 100% all-inclusive. Highway expressway tolls (Katunayake Expressway, Southern Expressway, Central Expressway), airport parking fees, and fuel are already covered.",
  },
  {
    q: "Can we stop for an ATM, local SIM card, or bottled water on the way?",
    a: "Absolutely. Right after you meet your driver at the airport, we can assist you with buying a Dialog or Mobitel tourist eSIM/SIM card, exchanging currency, or withdrawing cash from airport ATMs. En route, your driver will gladly stop whenever you need water or a quick bite.",
  },
  {
    q: "How do I pay for the airport transfer?",
    a: "You can pay your driver directly in cash upon safe arrival at your hotel (USD, EUR, GBP, or Sri Lankan Rupees at the current daily bank rate), or pre-pay via secure online bank transfer.",
  },
];

const transferRates = [
  { dest: "Negombo (Beach / Town)", time: "20 – 30 mins", sedan: "$22", van: "$30" },
  { dest: "Colombo City Centre", time: "45 mins", sedan: "$38", van: "$48" },
  { dest: "Panadura / Wadduwa", time: "1 hr 15 mins", sedan: "$48", van: "$58" },
  { dest: "Bentota / Beruwala", time: "1 hr 30 mins", sedan: "$58", van: "$70" },
  { dest: "Hikkaduwa", time: "1 hr 45 mins", sedan: "$68", van: "$80" },
  { dest: "Galle Fort / Unawatuna", time: "2 hrs", sedan: "$75", van: "$90" },
  { dest: "Mirissa / Weligama", time: "2 hrs 15 mins", sedan: "$88", van: "$105" },
  { dest: "Tangalle / Hiriketiya", time: "2 hrs 45 mins", sedan: "$105", van: "$125" },
  { dest: "Kandy (Hill Capital)", time: "3 hrs", sedan: "$78", van: "$95" },
  { dest: "Sigiriya / Dambulla", time: "3 hrs 30 mins", sedan: "$95", van: "$115" },
  { dest: "Ella / Nuwara Eliya", time: "4 hrs 30 mins", sedan: "$135", van: "$160" },
  { dest: "Arugam Bay (East Coast)", time: "6 hrs", sedan: "$175", van: "$210" },
];

export default async function AirportTransferPage() {
  const { t, locale } = await getI18n();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Colombo Airport (CMB) Private Transfers",
        serviceType: "Airport Taxi & Chauffeur Transfer",
        provider: { "@id": organizationId },
        areaServed: {
          "@type": "Country",
          name: "Sri Lanka",
        },
        description:
          "Private airport transfer service connecting Bandaranaike International Airport (CMB) to Panadura, Colombo, Bentota, Galle, Kandy, and Sri Lanka destinations.",
      },
      {
        "@type": "FAQPage",
        mainEntity: transferFaqs.map((faq) => ({
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
            name: "Airport Transfer Sri Lanka",
            item: `${siteConfig.url}${prefix}/airport-transfer-sri-lanka`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={t("Bandaranaike International Airport (CMB)")}
        title={t("Airport Transfer Sri Lanka")}
        intro={t(
          "Step off your flight and straight into cool, air-conditioned comfort. Panadura-based Krishan Tours Sri Lanka provides reliable 24/7 private Colombo Airport transfers with real-time flight tracking, expressway tolls included, and fixed transparent rates.",
        )}
        image="/images/coast.webp"
        tall
      />

      {/* Trust Highlights */}
      <section className="border-y border-black/10 bg-paper py-8" id="content">
        <div className="shell grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Flight Tracking")}</p>
              <p className="text-xs text-black/60">{t("No charge for delays")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("24/7 Availability")}</p>
              <p className="text-xs text-black/60">{t("Day or late-night arrivals")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Fixed Rates")}</p>
              <p className="text-xs text-black/60">{t("Highway tolls included")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Meet & Greet")}</p>
              <p className="text-xs text-black/60">{t("Signboard in arrivals lobby")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rates Table */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Transparent Fixed Pricing")}
            title={
              <>
                {t("Colombo Airport (CMB)")}
                <br />
                <em>{t("transfer rates table.")}</em>
              </>
            }
            intro={t(
              "All prices are in USD, per vehicle (not per person), including all highway expressway tolls, parking fees, and air-conditioning. Sedans seat 1–3 passengers; KDH Vans seat 4–8 passengers.",
            )}
          />

          <div className="mt-14 overflow-x-auto border border-black/15 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/15 bg-paper text-xs uppercase tracking-wider text-black/70">
                <tr>
                  <th className="py-4 px-6">{t("Destination")}</th>
                  <th className="py-4 px-6">{t("Approx. Drive Time")}</th>
                  <th className="py-4 px-6">{t("AC Sedan (1-3 Pax)")}</th>
                  <th className="py-4 px-6">{t("AC KDH Van (4-8 Pax)")}</th>
                  <th className="py-4 px-6 text-right">{t("Quick Book")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {transferRates.map((rate) => (
                  <tr key={rate.dest} className="hover:bg-paper/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-jungle">{rate.dest}</td>
                    <td className="py-4 px-6 text-black/60 text-xs">{rate.time}</td>
                    <td className="py-4 px-6 font-bold text-emerald-800">{rate.sedan}</td>
                    <td className="py-4 px-6 font-bold text-jungle">{rate.van}</td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={whatsappUrl(
                          `Hello Krishan Tours Sri Lanka, I would like to book an airport transfer from CMB to ${rate.dest}.`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-cinnamon hover:underline"
                      >
                        <MessageCircle size={13} /> {t("Book")}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Meet & Greet Process */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24 items-center">
          <div>
            <p className="eyebrow text-cinnamon">{t("Seamless Arrival")}</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,5vw,4.5rem)] leading-[.92]">
              {t("How our airport")} <em>{t("pickup works.")}</em>
            </h2>
            <div className="mt-8 space-y-6 text-xs leading-6 text-black/70">
              <div className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-jungle text-xs font-bold text-gold">1</span>
                <div>
                  <h4 className="font-bold text-sm text-jungle">{t("Provide Your Flight Details")}</h4>
                  <p>{t("When reserving, simply send your airline and flight number. We monitor live radar schedules.")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-jungle text-xs font-bold text-gold">2</span>
                <div>
                  <h4 className="font-bold text-sm text-jungle">{t("Arrival Signboard Welcome")}</h4>
                  <p>{t("Walk out of baggage reclaim into the arrivals lobby. Your driver is waiting with your nameboard.")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-jungle text-xs font-bold text-gold">3</span>
                <div>
                  <h4 className="font-bold text-sm text-jungle">{t("Assistance & Highway Drive")}</h4>
                  <p>{t("We assist with your luggage, currency exchange, or SIM card, then proceed directly via the expressway.")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black/15 bg-white p-8 md:p-10">
            <span className="eyebrow text-gold">{t("Instant WhatsApp Booking")}</span>
            <h3 className="display mt-3 text-3xl">{t("Book Your CMB Transfer in 2 Minutes")}</h3>
            <p className="mt-4 text-xs leading-6 text-black/60">
              {t(
                "No complicated forms or payment card deposits required. Send your travel dates and flight number on WhatsApp, and our Panadura team will confirm immediately.",
              )}
            </p>
            <div className="mt-8 space-y-3">
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like to book a Colombo Airport transfer.")}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full text-center justify-center"
              >
                <MessageCircle size={16} /> {t("Message on WhatsApp")}
              </a>
              <Link href="/contact" className="btn-outline w-full text-center justify-center">
                {t("Email Booking Form")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("Arrival Guidance")}</p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("Airport transfer FAQs.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Need baby booster seats, extra luggage trailer, or multi-city drops? Talk directly to Krishan on WhatsApp.",
              )}
            </p>
          </div>
          <FAQ items={transferFaqs} />
        </div>
      </section>

      <JsonLd data={schema} />
    </>
  );
}
