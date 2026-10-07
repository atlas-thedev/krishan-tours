import type { Metadata } from "next";
import { defaultLocale, locales, localizeHref, type Locale } from "./config";
import { getI18n } from "./server";
import { siteConfig } from "@/lib/site";

export const ogLocaleMap: Record<Locale, string> = {
  en: "en_GB",
  ar: "ar_AE",
  cs: "cs_CZ",
  fr: "fr_FR",
  pl: "pl_PL",
  de: "de_DE",
};

/** Absolute URL for a locale-aware path. */
export function absoluteUrl(path: string, locale: Locale = defaultLocale) {
  const localized = localizeHref(path, locale);
  // Next.js renders the root canonical without a trailing slash; keep sitemap and hreflang identical.
  if (localized === "/") return siteConfig.url;
  return `${siteConfig.url}${localized.startsWith("/") ? "" : "/"}${localized}`;
}

/** hreflang map including x-default (English), shared by page metadata and the sitemap. */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(locales.map((item) => [item, absoluteUrl(path, item)])),
    "x-default": absoluteUrl(path, defaultLocale),
  };
}

/** Trim a description to Google's ~160 character snippet limit on a word boundary. */
export function clip(text: string | undefined, max = 158) {
  if (!text) return text;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–—-]$/, "")}…`;
}

export async function localizedMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
  type = "website",
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  /** Skip the "| Krishan Tours" template (used for the home page). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
}): Promise<Metadata> {
  const { locale, t } = await getI18n();
  const canonicalUrl = absoluteUrl(path, locale);
  const translatedTitle = t(title);
  const translatedDesc = clip(description ? t(description) : undefined);

  // Open Graph / Twitter images must be JPEG/PNG for WhatsApp and iMessage previews.
  let resolvedImageUrl = `${siteConfig.url}/images/og-image.jpg`;
  if (image) {
    const safeImage = image.endsWith(".webp") ? image.replace(/\.webp$/, ".jpg") : image;
    resolvedImageUrl = safeImage.startsWith("http")
      ? safeImage
      : `${siteConfig.url}${safeImage.startsWith("/") ? "" : "/"}${safeImage}`;
  }

  const ogImageObj = {
    url: resolvedImageUrl,
    secureUrl: resolvedImageUrl,
    width: 1200,
    height: 630,
    alt: translatedTitle,
    type: resolvedImageUrl.endsWith(".png") ? "image/png" : "image/jpeg",
  };

  return {
    title: absoluteTitle ? { absolute: translatedTitle } : translatedTitle,
    description: translatedDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates(path),
    },
    openGraph: {
      title: translatedTitle,
      description: translatedDesc,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: ogLocaleMap[locale] || "en_GB",
      alternateLocale: locales.filter((item) => item !== locale).map((item) => ogLocaleMap[item]),
      type,
      images: [ogImageObj],
    },
    twitter: {
      card: "summary_large_image",
      title: translatedTitle,
      description: translatedDesc,
      images: [resolvedImageUrl],
    },
  };
}
