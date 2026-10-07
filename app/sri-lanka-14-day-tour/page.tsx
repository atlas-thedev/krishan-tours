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
import { JsonLd, organizationId } from "@/components/JsonLd";

export const generateMetadata = (): Promise<Metadata> =>
  localizedMetadata({
    title: "Sri Lanka 14-Day Tour: 2-Week Itinerary",
    description:
      "A 14-day Sri Lanka tour with a private driver: ancient cities, Sigiriya, Kandy, tea country, the Ella train, Yala safari and beach days on the south coast.",
    path: "/sri-lanka-14-day-tour",
    image: "/images/nine-arches.webp",
  });

const tourFaqs = [
  {
    q: "Why is 14 days the ideal duration for a complete Sri Lanka holiday?",
    a: "A 14-day journey allows you to experience Sri Lanka without packing exhaustion. Unlike rapid 5-day sprints, a two-week itinerary includes 2-night stays at key hubs (Cultural Triangle, Kandy, Ella, and the coast). You get to climb rocks early, take leisurely train journeys, embark on multiple wildlife safaris, and spend several relaxed days enjoying the beach.",
  },
  {
    q: "Is this 14-day tour suitable for families traveling with children?",
    a: "Yes, exceptionally so. Because drive times are broken up into manageable 2 to 3-hour stretches and there are rest afternoons built into the schedule, children don't get restless. We provide certified child safety seats, recommend family-friendly pool villas, and ensure flexible meal options throughout.",
  },
  {
    q: "How does the itinerary change depending on the monsoon season?",
    a: "Sri Lanka is unique in having two opposing monsoon systems. From December to April, the south and west coasts (Galle, Mirissa, Bentota) are sunny and calm. From May to September, we easily shift the coastal days of this 14-day itinerary to the pristine east coast (Passikudah, Trincomalee, Nilaveli) where waters are crystal-clear.",
  },
  {
    q: "What is the procedure for scenic train tickets?",
    a: "The Kandy-to-Ella scenic train is the most demanded train journey in Asia. As a licensed Panadura-based operator, Krishan Tours Sri Lanka secures reserved observation or 2nd-class seats for you well in advance. Your driver transports your heavy suitcases in the car so you can board unencumbered.",
  },
  {
    q: "How much does the 14-day private tour cost?",
    a: "Our private driver-guide service for 14 full days is $840–$980 USD total for the entire car (1–3 passengers). Our complete boutique package, with 13 nights in handpicked 3-star to 4-star boutique hotels with daily breakfast, private vehicle, train tickets, and two private 4x4 wildlife safaris, starts from $1,390 USD per person based on double occupancy.",
  },
];

const itineraryDays = [
  {
    day: 1,
    title: "Arrival to Negombo Lagoon",
    location: "Negombo",
    driveTime: "Approx. 25 mins from Colombo Airport (CMB)",
    text: "Meet your private chauffeur-guide upon landing at Colombo Airport. A short transfer brings you to a peaceful lagoon or beachfront hotel in Negombo. Spend the afternoon resting after your international flight, watching traditional catamaran fishing boats drift across the water.",
    highlights: ["Personalized airport welcome", "Short transfer", "Lagoon sunset dinner"],
    image: "/images/coast.webp",
  },
  {
    day: 2,
    title: "North to Anuradhapura Ancient Capital",
    location: "Anuradhapura",
    driveTime: "Approx. 3.5 hrs drive",
    text: "Travel north into the island's dry zone, stopping along the way for fresh seasonal tropical fruit and roadside tea. Arrive at Anuradhapura, the spiritual heart of ancient Sri Lanka. Visit Mihintale, the cradle of Buddhism in Sri Lanka, as the sunset bathes the rocky summit in warm light.",
    highlights: ["Scenic coconut belt drive", "Mihintale sunset view", "Dry-zone heritage arrival"],
    image: "/images/anuradhapura.webp",
  },
  {
    day: 3,
    title: "Sacred City by Bicycle & Historic Stupas",
    location: "Anuradhapura",
    driveTime: "Local exploration",
    text: "Explore the vast UNESCO World Heritage sacred city by bicycle or car alongside a local historian. Stand in awe beneath the colossal Ruwanwelisaya and Jetavanaramaya stupas, marvel at intricate carved moonstones, and pay homage at the ancient Jaya Sri Maha Bodhi—the oldest recorded human-planted tree in the world.",
    highlights: ["Ruwanwelisaya & Jetavanaramaya stupas", "Sacred Sri Maha Bodhi tree", "Ancient stone moonstones"],
    image: "/images/jetavanaramaya.webp",
  },
  {
    day: 4,
    title: "Tank Country into Sigiriya",
    location: "Sigiriya",
    driveTime: "Approx. 1.5 hrs drive",
    text: "Journey southeast across ancient irrigation lake (wewa) country to Sigiriya. Check into a serene forest lodge surrounded by birdsong. Enjoy a home-cooked village lunch cooked in clay pots over wood fires, followed by an afternoon relaxing by the pool or taking a boat ride on a lotus-covered lake.",
    highlights: ["Rural countryside scenery", "Traditional clay-pot village lunch", "Forest lodge afternoon"],
    image: "/images/rainforest.webp",
  },
  {
    day: 5,
    title: "Sigiriya Lion Rock & Minneriya Elephant Gathering",
    location: "Sigiriya",
    driveTime: "Local exploration & 30 min safari transfer",
    text: "Ascend the UNESCO-listed 5th-century Sigiriya Rock Fortress at 7:00 AM before the midday heat. Wander past ancient water gardens, frescoes, and the royal palace ruins perched atop the rock. In the afternoon, take a private 4x4 open-top safari into Minneriya or Kaudulla to witness wild elephant herds gathering at the lake edge.",
    highlights: ["Early Sigiriya fortress climb", "Ancient fresco gallery", "Minneriya wild elephant safari"],
    image: "/images/pidurangala-sigiriya.webp",
  },
  {
    day: 6,
    title: "Dambulla Painted Cave Temples to Kandy",
    location: "Kandy",
    driveTime: "Approx. 2.5 hrs to Kandy",
    text: "Explore the Dambulla Cave Temple complex, where five ancient caves house over 150 serene Buddha statues adorned with centuries-old murals. Drive through the aromatic spice hills of Matale, learning about cardamom, cinnamon, and vanilla, before arriving in the highland capital of Kandy.",
    highlights: ["Dambulla cave temple murals", "Matale spice garden", "Kandy lakeside arrival"],
    image: "/images/dambulla-cave.webp",
  },
  {
    day: 7,
    title: "Royal Botanical Gardens & Sacred Tooth Relic",
    location: "Kandy",
    driveTime: "Local exploration",
    text: "Stroll through the 147-acre Peradeniya Royal Botanical Gardens, famous for majestic royal palm avenues, spice trees, and an extraordinary orchid house. Later, circle peaceful Kandy Lake and visit the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) during the captivating evening ceremonial drumming puja.",
    highlights: ["Peradeniya Royal Botanical Gardens", "Kandy Lake walk", "Temple of the Tooth puja ceremony"],
    image: "/images/rainforest.webp",
  },
  {
    day: 8,
    title: "Ascent into Tea Country & Nuwara Eliya",
    location: "Nuwara Eliya",
    driveTime: "Approx. 2.5 hrs scenic drive",
    text: "Climb through dramatic mountain passes and cool mist into Nuwara Eliya, Sri Lanka's 'Little England'. Stop by cascading Ramboda Falls, tour a historic tea estate, and learn how delicate orthodox Ceylon tea is cultivated and graded. Enjoy an evening walk around colonial Lake Gregory.",
    highlights: ["Ramboda Falls viewpoint", "Guided tea factory tour & tasting", "Highland colonial architecture"],
    image: "/images/tea-estate.webp",
  },
  {
    day: 9,
    title: "The Legendary Blue Train into Ella",
    location: "Ella",
    driveTime: "Scenic train: ~2.5 hrs (luggage carried by car)",
    text: "Board the world's most cinematic mountain train from Nanu Oya to Ella. Watch the emerald green hills, cloud forests, and waterfalls drift past open windows. Meet your driver at Ella station and check into your valley-view stay. Enjoy an evening in Ella's vibrant village cafes.",
    highlights: ["Reserved scenic train tickets", "Spectacular mountain passes", "Ella village atmosphere"],
    image: "/images/ella-train.webp",
  },
  {
    day: 10,
    title: "Little Adam's Peak & Nine Arches Bridge",
    location: "Ella",
    driveTime: "Local exploration",
    text: "Take an unhurried morning ridge walk up Little Adam’s Peak for breathtaking 360-degree panoramas across the Ella Gap. Later, walk the jungle path to the iconic Nine Arches Bridge as a vintage train rumbles across the viaduct. In the afternoon, swim beneath the spray of Ravana Falls.",
    highlights: ["Little Adam's Peak ridge hike", "Nine Arches Bridge at golden hour", "Ravana Falls swim"],
    image: "/images/nine-arches.webp",
  },
  {
    day: 11,
    title: "Ella to Yala National Park & Dusk Safari",
    location: "Yala",
    driveTime: "Approx. 2.5 hrs descent",
    text: "Descend from the central hills into the arid coastal buffer forests of the deep south. Settle into a tranquil nature lodge near Yala National Park. In the late afternoon, set out in a private 4x4 safari jeep tracking wild leopards, sloth bears, spotted deer, and marsh crocodiles.",
    highlights: ["Scenic highland descent", "Nature lodge check-in", "Afternoon leopard safari in Yala"],
    image: "/images/elephants.webp",
  },
  {
    day: 12,
    title: "Dawn Safari Tracks & Coast Transfer to Tangalle",
    location: "Tangalle",
    driveTime: "Approx. 1.5 hrs coastal drive",
    text: "Enter Yala at first light for a patient morning tracking drive when big cats and birdlife are most active. After a hearty brunch, leave the forest for the wild southern coastline of Tangalle. Check into a beachfront villa where wide golden sands and turquoise waters await.",
    highlights: ["Dawn wildlife tracking", "Scenic coastal drive", "Tangalle barefoot beach arrival"],
    image: "/images/mirissa.webp",
  },
  {
    day: 13,
    title: "Southern Coast, Stilt Fishermen & Galle Fort",
    location: "Galle",
    driveTime: "Approx. 1.5 hrs to Galle",
    text: "Follow the coastal road west past Weligama and Ahangama to photograph traditional stilt fishermen. Arrive at 17th-century UNESCO World Heritage Galle Fort. Stroll cobblestone lanes lined with artisan boutiques, Dutch colonial buildings, and enjoy a sunset rampart walk over the ocean.",
    highlights: ["Stilt fishermen photo stop", "Galle Fort cobblestone walk", "Sunset rampart views"],
    image: "/images/galle.webp",
  },
  {
    day: 14,
    title: "Galle Fort, Panadura & Departure Transfer",
    location: "Colombo / Airport",
    driveTime: "Approx. 2 hrs via Southern Expressway to CMB",
    text: "Enjoy a relaxed breakfast within the historic fort walls. Your chauffeur transfers you comfortably along the Southern Expressway—passing Krishan Tours' home base of Panadura—directly to Colombo Airport (CMB) in time for your flight home.",
    highlights: ["Fort boutique shopping", "Comfortable expressway transfer", "Airport departure assistance"],
    image: "/images/coast.webp",
  },
];

export default async function SriLanka14DayTourPage() {
  const { t, locale } = await getI18n();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: "14-Day Ultimate Island Journey Private Tour",
        description:
          "The definitive 2-week grand private tour of Sri Lanka covering ancient capitals, Sigiriya, Kandy, Nuwara Eliya, Ella train, Yala safari, and Galle coast.",
        provider: { "@id": organizationId },
        itinerary: itineraryDays.map((d) => ({
          "@type": "TouristAttraction",
          name: `Day ${d.day}: ${d.title} (${d.location})`,
        })),
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "1390",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: tourFaqs.map((faq) => ({
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
            name: "Sri Lanka 14-Day Tour",
            item: `${siteConfig.url}${prefix}/sri-lanka-14-day-tour`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={t("14 Days · The Complete Grand Circuit")}
        title={t("Sri Lanka 14-Day Tour")}
        intro={t(
          "The definitive two-week island journey. Ancient UNESCO kingdoms, the rock citadel of Sigiriya, cool Ceylon tea hills, the legendary mountain train, two distinct wildlife safaris, and barefoot southern coasts—all guided privately by Panadura-based Krishan Tours Sri Lanka.",
        )}
        image="/images/nine-arches.webp"
        tall
      />

      {/* Highlights Bar */}
      <section className="border-y border-black/10 bg-paper py-8" id="content">
        <div className="shell grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Duration: 14 Days")}</p>
              <p className="text-xs text-black/60">{t("13 Nights Boutique Stays")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Compass className="h-8 w-8 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-jungle">{t("Unhurried Pacing")}</p>
              <p className="text-xs text-black/60">{t("2-night stays at key hubs")}</p>
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
              <p className="font-bold text-sm text-jungle">{t("Two Wildlife Safaris")}</p>
              <p className="text-xs text-black/60">{t("Elephants & leopards")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Day-by-Day */}
      <section className="py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={t("The Grand 14-Day Itinerary")}
            title={
              <>
                {t("Two weeks across")}
                <br />
                <em>{t("the teardrop island.")}</em>
              </>
            }
            intro={t(
              "Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka. Here is our recommended day-by-day plan for the ultimate two-week adventure.",
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
                {t("14-Day tour package options,")}
                <br />
                <em>{t("tailored around your comfort.")}</em>
              </>
            }
            intro={t(
              "Choose between booking only your private car and driver, or our complete boutique package including character hotels, safari jeeps, and train seats.",
            )}
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="border border-black/15 bg-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-cinnamon">{t("Option A")}</span>
                <h3 className="display mt-2 text-3xl">{t("Driver & Vehicle Only (14 Days)")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-jungle">$840 – $980</span>
                  <span className="text-xs text-black/55">/ {t("total vehicle (1-3 passengers)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/60">
                  {t(
                    "You book your own stays across Sri Lanka. We provide your dedicated private chauffeur-guide, AC vehicle, fuel, highway tolls, parking fees, and driver lodging for all 14 days.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-black/70 border-t border-black/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("14 full days private vehicle & driver-guide")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Unlimited mileage across agreed route")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All expressway tolls and driver expenses included")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Luggage transfer while you ride the mountain train")}</li>
                </ul>
              </div>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like to book the 14-Day Driver-Only option.")}
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
                <h3 className="display mt-2 text-3xl">{t("Complete Boutique Tour (14 Days)")}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="display text-4xl text-jungle">$1,390 – $1,850</span>
                  <span className="text-xs text-black/55">/ {t("person (based on 2 travelers)")}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-black/60">
                  {t(
                    "13 nights in handpicked 3-star to 4-star boutique hotels with daily breakfast, private vehicle, fuel, highway tolls, reserved train tickets, and two private 4x4 safari jeeps with expert trackers.",
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-black/70 border-t border-black/10 pt-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("13 nights boutique hotels + daily breakfast")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Guaranteed reserved seats on the mountain train")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("Two private 4x4 safari jeeps (Minneriya & Yala)")}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-700" /> {t("All airport pickups, drop-offs & expressway tolls")}</li>
                </ul>
              </div>
              <a
                href={whatsappUrl("Hello Krishan Tours Sri Lanka, I would like a quote for the complete 14-Day Boutique Tour package.")}
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
              {t("14-Day grand tour FAQs.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/60">
              {t(
                "Want to swap stops, add surf lessons in Weligama, or upgrade to luxury colonial tea bungalows? Speak directly with Krishan on WhatsApp.",
              )}
            </p>
          </div>
          <FAQ items={tourFaqs} />
        </div>
      </section>

      <JsonLd data={schema} />
    </>
  );
}
