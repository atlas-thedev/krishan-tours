import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/i18n/metadata";
import type { Locale } from "@/lib/i18n/config";

/** Renders schema.org JSON-LD safely (escapes "<" so content can never close the script tag). */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const organizationId = `${siteConfig.url}/#organization`;
export const websiteId = `${siteConfig.url}/#website`;

/** BreadcrumbList schema. Pass crumbs after Home, e.g. [["Tours","/tours"],["Wild Sri Lanka","/tours/wild-sri-lanka"]]. */
export function breadcrumbSchema(crumbs: [name: string, path: string][], locale: Locale, home = "Home") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [[home, "/"], ...crumbs].map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path, locale),
    })),
  };
}
