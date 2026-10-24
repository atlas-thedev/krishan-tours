import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import {
  ArrowRight,
  Check,
  MapPin,
  ShieldCheck,
  Train,
  BedDouble,
  Car,
  MessageCircle,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { getPrices, orderBySettings } from "@/lib/content-db";
import { localizeFaqs, money, priceValues } from "@/lib/money";
import { JsonLd } from "@/components/JsonLd";

export const generateMetadata = (): Promise<Metadata> =>
  localizedMetadata({
    title: "Sri Lanka Tour Packages: 5 to 14 Days",
    description:
      "Private Sri Lanka tour packages from 5 to 14 days with AC vehicle and driver-guide, handpicked hotels, safari jeeps and Ella train tickets. Fully customisable.",
    path: "/sri-lanka-tour-packages",
    image: "/images/ella-train.webp",
  });

const packageFaqs = [
  {
    q: "Are international flights included in your tour packages?",
    a: "No, international flights and entry visas (ETA) are not included. Guests book their own flights into Colombo Bandaranaike International Airport (CMB). Our private tour package takes over the moment you land, with 24/7 meet-and-greet, private transfers, hotels, transport, and excursions until your flight home.",
  },
  {
    q: "Can we customize hotels and stops in these packages?",
    a: "Yes! None of our packages are fixed or rigid. You can swap any hotel for a luxury tea bungalow, add an extra night at the beach, skip an ancient city, or request private cooking classes. We provide these blueprints as realistic starting points and refine every detail to your liking.",
  },
  {
    q: "What meals are typically included in your packages?",
    a: "All packages include daily freshly cooked breakfasts at your hotels. For lunches and dinners, your private driver-guide recommends authentic local spots, seafood beach shacks, or high-end hotel dining based on your preference and dietary requirements. This gives you freedom to eat what you enjoy without paying for set tourist buffets.",
  },
  {
    q: "How does payment and booking work?",
    a: "After you review and finalize your customized package proposal, a 20% to 30% deposit secures your hotels, vehicle, and driver. The remaining balance is payable upon arrival in Sri Lanka or by secure bank transfer prior to travel.",
  },
  {
    q: "Are safari jeeps and train tickets guaranteed?",
    a: "Yes. Sri Lanka’s hill country train tickets (especially the Kandy to Ella route) sell out weeks in advance. When you book a complete package with Krishan Tours Sri Lanka, our local team secures reserved observation seats and arranges private 4x4 safari jeeps with experienced local wildlife trackers.",
  },
];

const packagesList = [
  {
    slug: "/sigiriya-kandy-ella-tour",
    name: "5-Day Golden Route Express",
    days: 5,
    priceKey: "ske.package",
    summary: "Sigiriya Lion Rock, Dambulla Cave Temple, Kandy Temple of the Tooth, and the scenic mountain train to Ella.",
    image: "/images/pidurangala-sigiriya.webp",
    stops: ["Sigiriya", "Kandy", "Ella"],
    idealFor: "Time-conscious travelers & first visits",
  },
  {
    slug: "/sri-lanka-7-day-tour",
    name: "7-Day Sri Lanka Highlights",
    days: 7,
    priceKey: "tour7.package",
    summary: "Ancient rock fortresses, spice gardens, central tea plantations, highland train ride, and historic Galle Fort ramparts.",
    image: "/images/tea-hills.webp",
    stops: ["Cultural Triangle", "Kandy", "Ella", "Galle"],
    idealFor: "1-week holidays & couples",
  },
  {
    slug: "/sri-lanka-10-day-tour",
    name: "10-Day Culture, Tea & Safari",
    days: 10,
    priceKey: "tour10.package",
    summary: "The most popular balanced itinerary: ancient ruins, misted tea estates, scenic train, Yala leopard safari, and golden southern beaches.",
    image: "/images/elephants.webp",
    stops: ["Anuradhapura", "Sigiriya", "Kandy", "Nuwara Eliya", "Yala", "Galle"],
    idealFor: "Couples, photographers & nature lovers",
  },
  {
    slug: "/sri-lanka-14-day-tour",
    name: "14-Day Ultimate Island Odyssey",
    days: 14,
    priceKey: "tour14.package",
    summary: "The complete grand loop. Three UNESCO World Heritage sites, two distinct wildlife habitats, mountain trails, and a slow barefoot beach finish.",
    image: "/images/nine-arches.webp",
    stops: ["Anuradhapura", "Sigiriya", "Kandy", "Tea Country", "Ella", "Yala", "Mirissa", "Galle"],
    idealFor: "Two-week holidays & family trips",
  },
];

export default async function TourPackagesPage() {
  const { t, locale } = await getI18n();
  const prices = getPrices();
  const pv = priceValues(prices);
  const faqs = localizeFaqs(packageFaqs, t, pv);
  const packages = orderBySettings(packagesList.map((pkg) => ({ ...pkg, href: pkg.slug, slug: pkg.slug.slice(1) })));
  const prefix = locale === "en" ? "" : `/${locale}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Sri Lanka Tour Packages by Krishan Tours Sri Lanka",
        description:
          "Curated private tour packages in Sri Lanka offering chauffeur-driven transport, boutique accommodations, and immersive experiences.",
        itemListElement: packages.map((pkg, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: pkg.name,
          url: `${siteConfig.url}${prefix}${pkg.href}`,
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
            name: "Tour Packages",
            item: `${siteConfig.url}${prefix}/sri-lanka-tour-packages`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={t("Curated Holiday Packages")}
        title={t("Sri Lanka Tour Packages")}
        intro={t(
          "Complete, hassle-free private tour packages planned from Panadura by Krishan Tours Sri Lanka. Air-conditioned private vehicle, licensed driver-guide, handpicked boutique hotels, safari jeeps, and scenic train tickets.",
        )}
        image="/images/ella-train.webp"
        tall
      />

      {/* Package Standards */}
      <section className="border-y border-black/10 bg-paper py-8" id="content">
        <div className="shell grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-gold shrink-0" />
            <span className="text-xs font-semibold">{t("Private AC Vehicle & Chauffeur")}</span>
          </div>
          <div className="flex items-center gap-3">
            <BedDouble className="h-8 w-8 text-gold shrink-0" />
            <span className="text-xs font-semibold">{t("Boutique Hotels & Daily Breakfast")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Train className="h-8 w-8 text-gold shrink-0" />
            <span className="text-xs font-semibold">{t("Reserved Mountain Train Seats")}</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-gold shrink-0" />
            <span className="text-xs font-semibold">{t("100% Tailor-Made & Flexible")}</span>
          </div>
        </div>
      </section>

      {/* Curated Packages List */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Handcrafted Itineraries")}
            title={
              <>
                {t("Choose your starting point,")}
                <br />
                <em>{t("we personalize the rest.")}</em>
              </>
            }
            intro={t(
              "Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka. Every package below includes private transport, accommodations, and 24/7 on-island care.",
            )}
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {packages.map((pkg) => (
              <div
                key={pkg.slug}
                className="border border-black/15 bg-white overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-paper/95 backdrop-blur-sm px-3 py-1 text-[.64rem] font-bold uppercase tracking-[.08em] text-jungle">
                      {pkg.days} {t("Days")}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-jungle text-gold px-3.5 py-1.5 text-xs font-bold tracking-wider">
                      {t("From {price} / person", { price: money(prices[pkg.priceKey].min) })}
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="eyebrow text-cinnamon text-[.6rem]">{t(pkg.idealFor)}</p>
                    <h3 className="display mt-2 text-3xl group-hover:italic">{t(pkg.name)}</h3>
                    <p className="mt-3 text-xs leading-6 text-black/60">{t(pkg.summary)}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-black/10 pt-5 text-xs text-black/70">
                      <MapPin size={13} className="text-cinnamon" />
                      <span className="font-semibold">{t("Key Stops:")}</span>
                      {pkg.stops.join(" → ")}
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0 flex items-center justify-between gap-4 border-t border-black/10">
                  <Link href={pkg.href} className="link-arrow text-xs font-bold uppercase tracking-wider">
                    {t("View Full Itinerary")} <ArrowRight size={14} />
                  </Link>
                  <a
                    href={whatsappUrl(`Hello Krishan Tours Sri Lanka, I would like to inquire about the ${pkg.name}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
                  >
                    <MessageCircle size={14} /> {t("Quick WhatsApp Quote")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions Breakdown */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-24 items-center">
          <div>
            <p className="eyebrow text-cinnamon">{t("Complete Transparency")}</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,5vw,4.5rem)] leading-[.92]">
              {t("What is included in a")} <em>{t("Krishan Tours package?")}</em>
            </h2>
            <div className="mt-8 space-y-4 text-xs leading-6 text-black/70">
              <div className="flex items-start gap-3">
                <Check className="text-emerald-700 shrink-0 mt-0.5" size={16} />
                <p><strong>{t("Private Chauffeur & Vehicle:")}</strong> {t("Air-conditioned sedan or spacious KDH van, with fuel, expressway tolls, parking fees, and driver lodging fully covered.")}</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-emerald-700 shrink-0 mt-0.5" size={16} />
                <p><strong>{t("Boutique Accommodations:")}</strong> {t("Clean, characterful 3-star to 4-star hotels, tea bungalows, and coastal stays with daily breakfasts included.")}</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-emerald-700 shrink-0 mt-0.5" size={16} />
                <p><strong>{t("Scenic Train Tickets:")}</strong> {t("Advance reserved observation / second-class tickets for the world-renowned Kandy-to-Ella railway line.")}</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-emerald-700 shrink-0 mt-0.5" size={16} />
                <p><strong>{t("Private Safari Jeeps:")}</strong> {t("Dedicated 4x4 safari vehicles and experienced local trackers for Yala, Udawalawe, or Minneriya national parks.")}</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-emerald-700 shrink-0 mt-0.5" size={16} />
                <p><strong>{t("24/7 Local Support:")}</strong> {t("Direct WhatsApp hotline to Krishan and our Panadura team throughout your entire stay in Sri Lanka.")}</p>
              </div>
            </div>
          </div>

          <div className="bg-jungle text-white p-8 md:p-12">
            <span className="eyebrow text-gold">{t("Need Something Specific?")}</span>
            <h3 className="display mt-3 text-3xl">{t("Tailor Any Package In 24 Hours")}</h3>
            <p className="mt-4 text-xs leading-6 text-white/75">
              {t(
                "Traveling with young kids? Celebrating a honeymoon? Want to include surfing at Weligama or whale watching at Mirissa? We gladly tweak any itinerary to match your dream holiday.",
              )}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/plan-your-trip" className="btn-light text-center justify-center">
                {t("Customize a Package")}
              </Link>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like help customizing a tour package.")}
                target="_blank"
                rel="noreferrer"
                className="btn-outline border-white text-white text-center justify-center flex items-center gap-1.5"
              >
                <MessageCircle size={15} /> {t("WhatsApp Us")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">{t("Clear Details")}</p>
            <h2 className="display mt-4 text-5xl leading-[.9]">
              {t("Tour package questions & answers.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Get in touch directly with our Panadura team if you need guidance on travel insurance, payment methods, or seasonal weather.",
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
