export const locales = ["en", "ar", "cs", "fr", "pl", "de", "es", "it", "nl", "ru", "zh", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  cs: "Čeština",
  fr: "Français",
  pl: "Polski",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  nl: "Nederlands",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : defaultLocale;
}

export function stripLocale(pathname: string) {
  const locale = localeFromPathname(pathname);
  if (locale === defaultLocale) return pathname;
  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
  return stripped || "/";
}

export function localizeHref(href: string, locale: Locale) {
  if (locale === defaultLocale || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/api") || href.startsWith("/admin")) return href;
  const [pathAndQuery, hash = ""] = href.split("#", 2);
  const cleanPath = stripLocale(pathAndQuery);
  return `/${locale}${cleanPath === "/" ? "" : cleanPath}${hash ? `#${hash}` : ""}`;
}

export function direction(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}
