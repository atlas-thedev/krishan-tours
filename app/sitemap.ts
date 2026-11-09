import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { tours } from "@/data/tours";
import { experiences } from "@/data/experiences";
import { stories } from "@/data/stories";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl, languageAlternates } from "@/lib/i18n/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const targetRoutes = [
    "/sri-lanka-private-driver",
    "/sri-lanka-private-tours",
    "/sri-lanka-tour-packages",
    "/airport-transfer-sri-lanka",
    "/sigiriya-kandy-ella-tour",
    "/sri-lanka-7-day-tour",
    "/sri-lanka-10-day-tour",
    "/sri-lanka-14-day-tour",
  ];
  const staticRoutes = [
    "",
    "/destinations",
    "/tours",
    "/experiences",
    "/plan-your-trip",
    "/about",
    "/stories",
    "/contact",
    "/privacy",
    "/terms",
  ];
  const routes = [
    ...staticRoutes.map((route) => ({
      route: route || "/",
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/privacy" || route === "/terms" ? 0.2 : 0.8,
    })),
    ...targetRoutes.map((route) => ({
      route,
      changeFrequency: "weekly" as const,
      priority: 0.95,
    })),
    ...destinations.map((d) => ({
      route: `/destinations/${d.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...tours.map((t) => ({
      route: `/tours/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...experiences.map((e) => ({
      route: `/experiences/${e.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...stories.map((s) => ({
      route: `/stories/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
  const lastModified = process.env.SITEMAP_LASTMOD ? new Date(process.env.SITEMAP_LASTMOD) : new Date(BUILD_TIME);
  return routes.flatMap((item) =>
    locales.map((locale) => ({
      url: absoluteUrl(item.route, locale),
      lastModified,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
      alternates: { languages: languageAlternates(item.route) },
    })),
  );
}

// Evaluated once when the sitemap module is built, so lastmod reflects the deploy, not every request.
const BUILD_TIME = Date.now();
