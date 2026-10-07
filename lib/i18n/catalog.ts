import type { Locale } from "./config";

export type Catalog = Record<string, string>;

// Generated translations are kept in source control so rendering never depends
// on a third-party translation service at runtime.
import ar from "./generated/ar.json";
import cs from "./generated/cs.json";
import fr from "./generated/fr.json";
import pl from "./generated/pl.json";
import de from "./generated/de.json";
import { seoOverrides } from "./seo-overrides";

const merge = (locale: Exclude<Locale, "en">, generated: Catalog): Catalog => ({ ...generated, ...seoOverrides[locale] });
const catalogs: Record<Exclude<Locale, "en">, Catalog> = { ar: merge("ar", ar), cs: merge("cs", cs), fr: merge("fr", fr), pl: merge("pl", pl), de: merge("de", de) };

export function getCatalog(locale: Locale): Catalog {
  return locale === "en" ? {} : catalogs[locale];
}

export function createTranslator(locale: Locale) {
  const catalog = getCatalog(locale);
  return (source: string, values?: Record<string, string | number>) => {
    let translated = catalog?.[source] || source;
    if (values) {
      for (const [key, value] of Object.entries(values)) translated = translated.replaceAll(`{${key}}`, String(value));
    }
    return translated;
  };
}
