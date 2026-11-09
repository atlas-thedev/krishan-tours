import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { experiences } from "@/data/experiences";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const generateMetadata = (): Promise<Metadata> =>
  localizedMetadata({
    title: "Things to Do in Sri Lanka: Experiences",
    description:
      "Things to do in Sri Lanka: wildlife safaris, beaches, the Ella train, ancient cities, food, adventure, wellness and local life, arranged privately.",
    path: "/experiences",
  });
export default async function ExperiencesPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHero
        eyebrow={t("Travel by feeling")}
        title={t("What do you want to remember?")}
        intro={t(
          "Not only where you went, but what you heard before sunrise, tasted at lunch and talked about on the road home.",
        )}
        image="/images/elephants.webp"
      />
      <section className="py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            eyebrow={t("Eight ways into the island")}
            title={
              <>
                {t("Begin with")}
                <br />
                <em>{t("what draws you.")}</em>
              </>
            }
            intro={t(
              "Build a journey around one obsession or let several worlds overlap.",
            )}
          />
          <div className="mt-16 grid gap-x-5 gap-y-16 md:grid-cols-2">
            {experiences.map((item, index) => (
              <Link
                href={`/experiences/${item.slug}`}
                key={item.slug}
                className={`group ${index % 3 === 1 ? "md:mt-24" : ""}`}
              >
                <div className="media-cover aspect-[16/11]">
                  <Image
                    src={item.image}
                    alt={t(item.name)}
                    fill
                    sizes="(max-width:768px) 100vw,50vw"
                    className="object-cover"
                  />
                  <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-jungle opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="eyebrow text-cinnamon">
                      0{index + 1} ·{" "}
                      {item.locations.slice(0, 2).map((value) => t(value)).join(" / ")}
                    </p>
                    <h2 className="display mt-2 text-5xl group-hover:italic">
                      {t(item.name)}
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-black/55">
                      {t(item.short)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
