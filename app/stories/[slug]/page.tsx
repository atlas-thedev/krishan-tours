import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { stories, getStory } from "@/data/stories";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl, localizedMetadata } from "@/lib/i18n/metadata";
import { JsonLd, breadcrumbSchema, organizationId } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return stories.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getStory(slug);
  if (!s) return {};
  const {t}=await getI18n();
  return localizedMetadata({title:s.title,description:`${t(s.excerpt)} ${t(s.paragraphs[0])}`,path:`/stories/${s.slug}`,image:s.image,type:"article"});
}
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t, locale } = await getI18n();
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const index = stories.findIndex((s) => s.slug === slug);
  const next = stories[(index + 1) % stories.length];
  const url = absoluteUrl(`/stories/${story.slug}`, locale);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: t(story.title),
    description: t(story.excerpt),
    image: `${siteConfig.url}${story.image.replace(/\.webp$/, ".jpg")}`,
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    articleSection: t(story.category),
    author: { "@type": "Person", name: "Krishan", worksFor: { "@id": organizationId } },
    publisher: { "@id": organizationId },
  };
  const breadcrumbs = breadcrumbSchema([[t("Stories"), "/stories"], [t(story.title), `/stories/${story.slug}`]], locale, t("Home"));
  return (
    <article>
      <header className="bg-jungle pb-16 pt-36 text-white md:pb-24 md:pt-48">
        <div className="shell">
          <Link href="/stories" className="link-arrow text-white/60">
            <ArrowLeft size={14} /> {t("All stories")}
          </Link>
          <p className="eyebrow mt-14 text-gold">
            {t(story.category)} · {t(story.readTime)} {t("read")}
          </p>
          <h1 className="display mt-5 max-w-6xl text-[clamp(4rem,10vw,9rem)] leading-[.8]">
            {t(story.title)}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
            {t(story.excerpt)}
          </p>
        </div>
      </header>
      <div className="relative min-h-[55svh]">
        <Image
          src={story.image}
          alt={t(story.title)}
          fill
          priority
          sizes="(max-width: 767px) 1000px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="shell grid gap-12 py-24 md:py-36 lg:grid-cols-[.55fr_1fr_.45fr]">
        <aside>
          <p className="eyebrow text-cinnamon">{t("From the road")}</p>
          <p className="mt-4 text-xs leading-5 text-black/45">
            {t("Observations from Krishan Tours Sri Lanka.")}
            <br />
            Sri Lanka.
          </p>
        </aside>
        <div>
          {story.paragraphs.map((p, i) => (
            <p
              key={p}
              className={`${i === 0 ? "display text-4xl leading-[1.05]" : "mt-8 text-base leading-8 text-black/65"}`}
            >
              {t(p)}
            </p>
          ))}
          {story.sections?.map((section) => (
            <section key={section.heading} className="mt-14">
              <h2 className="display text-4xl leading-[1.05] md:text-5xl">{t(section.heading)}</h2>
              {section.paragraphs.map((p) => (
                <p key={p} className="mt-6 text-base leading-8 text-black/65">
                  {t(p)}
                </p>
              ))}
            </section>
          ))}
          {story.related?.length ? (
            <nav aria-label={t("Plan this into your trip")} className="mt-16 border-t border-black/15 pt-8">
              <p className="eyebrow text-cinnamon">{t("Plan this into your trip")}</p>
              <ul className="mt-5 grid gap-3">
                {story.related.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-arrow">
                      {t(link.label)} <ArrowRight size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
      <Link
        href={`/stories/${next.slug}`}
        className="group block bg-[#e8e1d4] py-20"
      >
        <div className="shell flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-cinnamon">{t("Next story")}</p>
            <h2 className="display mt-4 max-w-3xl text-5xl leading-[.9] group-hover:italic md:text-7xl">
              {t(next.title)}
            </h2>
          </div>
          <ArrowRight size={28} />
        </div>
      </Link>
      <JsonLd data={[articleSchema, breadcrumbs]} />
    </article>
  );
}
