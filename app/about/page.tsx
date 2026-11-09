import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import {
  ArrowRight,
  HeartHandshake,
  Map,
  ShieldCheck,
  Users,
  Droplets,
  PawPrint,
  Store,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const generateMetadata = (): Promise<Metadata> =>
  localizedMetadata({ title: "About Krishan, Your Local Driver-Guide", description: "Meet Krishan, the Panadura-based licensed driver-guide behind Krishan Tours Sri Lanka: flexible private travel, honest advice and on-island support.", path: "/about" });
const values = [
  {
    icon: <Map />,
    title: "Local judgement",
    text: "Advice shaped by seasons, roads and years of seeing how a journey really feels.",
  },
  {
    icon: <HeartHandshake />,
    title: "Personal by default",
    text: "A real conversation before you book and one local team supporting you as you travel.",
  },
  {
    icon: <ShieldCheck />,
    title: "Clear and dependable",
    text: "Thoughtful drivers, transparent inclusions and no forced shopping stops.",
  },
  {
    icon: <Users />,
    title: "Flexible on the road",
    text: "Private travel leaves room to start later, linger longer or change the next stop.",
  },
];
export default async function AboutPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHero
        eyebrow={t("About KrishanTours")}
        title={t("Travel Sri Lanka with someone who knows it.")}
        intro={t(
          "A local tour company with a personal scale, strong relationships and the confidence to keep every journey flexible.",
        )}
        image="/images/tea-estate.webp"
      />
      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow text-cinnamon">
              {t("Why we do it this way")}
            </p>
            <h2 className="display mt-5 text-6xl leading-[.85]">
              {t("Small enough to")}
              <br />
              <em>{t("stay personal.")}</em>
            </h2>
          </div>
          <div>
            <p className="display text-[clamp(2.5rem,4.5vw,4.7rem)] leading-[.95]">
              {t(
                "The best journeys here are not the ones with the most stops. They are the ones where the island starts to feel less like a destination and more like a place you understand.",
              )}
            </p>
            <div className="mt-9 grid gap-6 text-sm leading-7 text-black/60 sm:grid-cols-2">
              <p>
                {t(
                  "KrishanTours plans private journeys from Sri Lanka. That sounds simple, but it changes the experience: advice is current, help is close and decisions are made by people who know the road.",
                )}
              </p>
              <p>
                {t(
                  "We combine reliable logistics with local warmth. Your route has structure, but it is never a conveyor belt. If a market is lively, the weather shifts or everyone needs a slower morning, there is room to respond.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-paper py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("What you can expect")}
            title={
              <>
                {t("Care in the")}
                <br />
                <em>{t("details that matter.")}</em>
              </>
            }
          />
          <div className="mt-14 grid border-t border-black/15 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`py-8 sm:px-7 ${i > 0 ? "border-t sm:border-l sm:border-t-0" : ""} border-black/15`}
              >
                <span className="text-cinnamon">{v.icon}</span>
                <h3 className="display mt-7 text-3xl">{t(v.title)}</h3>
                <p className="mt-4 text-sm leading-6 text-black/55">
                  {t(v.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-jungle py-24 text-white md:py-36">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="relative aspect-[4/5]">
            <Image
              src="/images/krishan.webp"
              alt={t("Krishan, founder of KrishanTours in Sri Lanka")}
              fill
              sizes="(max-width:1024px) 125vw,65vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow text-gold">{t("The human advantage")}</p>
            <h2 className="display mt-5 text-6xl leading-[.85]">
              {t("Not a call centre.")}
              <br />
              <em>{t("A conversation.")}</em>
            </h2>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/60">
              {t(
                "You do not need to arrive with a finished itinerary. Tell us the things you like, the pace you keep and the details that make travel comfortable. We will ask useful questions and be honest about what fits.",
              )}
            </p>
            <Link href="/contact" className="btn-light mt-9">
              {t("Talk to us")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section id="responsible" className="scroll-mt-28 py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Responsible travel")}
            title={
              <>
                {t("Practical care,")}
                <br />
                <em>{t("not grand claims.")}</em>
              </>
            }
            intro={t(
              "Tourism has an impact. Our role is to make more thoughtful choices and help guests do the same.",
            )}
          />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <Care
              icon={<Store />}
              title={t("Keep value local")}
              text={t(
                "Use family-run hotels, local specialists and independent places to eat where they genuinely suit the trip.",
              )}
            />
            <Care
              icon={<PawPrint />}
              title={t("Respect wild space")}
              text={t(
                "Choose considerate guides, never promise sightings and keep enough distance for animals to set the terms.",
              )}
            />
            <Care
              icon={<Droplets />}
              title={t("Use less, refill more")}
              text={t(
                "Provide drinking-water refill options and reduce avoidable single-use plastic on the road.",
              )}
            />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Care
              icon={<Users />}
              title={t("Listen to communities")}
              text={t(
                "Treat village visits as exchanges between people, not performances arranged for a camera.",
              )}
            />
            <Care
              icon={<ShieldCheck />}
              title={t("Respect sacred places")}
              text={t(
                "Explain dress, photography and behaviour before arrival so visits remain welcome and considerate.",
              )}
            />
            <Care
              icon={<HeartHandshake />}
              title={t("Pay for expertise")}
              text={t(
                "Work with skilled local guides and drivers whose knowledge changes the quality of the journey.",
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
}
function Care({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-black/15 p-6 md:p-8">
      <span className="text-cinnamon">{icon}</span>
      <h3 className="display mt-8 text-3xl">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-black/55">{text}</p>
    </div>
  );
}
