import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { I18nProvider } from "@/components/I18nProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { getI18n } from "@/lib/i18n/server";
import { direction, locales } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";
import { JsonLd, organizationId, websiteId } from "@/components/JsonLd";

const display = Cormorant_Garamond({ subsets:["latin","latin-ext","cyrillic"], variable:"--font-display", weight:["400"], style:["normal","italic"], display:"optional" });
const sans = Manrope({ subsets:["latin","latin-ext","cyrillic"], variable:"--font-sans", display:"swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default:"Sri Lanka Private Driver & Tailor-Made Tours | Krishan Tours", template:"%s | Krishan Tours" },
  description:"Private driver-guides, tailor-made Sri Lanka tours and 24/7 airport transfers from Panadura. Fixed daily rates, no shopping commissions.",
  applicationName:"Krishan Tours Sri Lanka",
  creator:"Krishan Tours Sri Lanka",
  publisher:"Krishan Tours Sri Lanka",
  category:"travel",
  formatDetection:{ telephone:true, email:true, address:true },
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  icons:{
    icon:[
      { url:"/favicon.ico", sizes:"any" },
      { url:"/icon.svg", type:"image/svg+xml" },
      { url:"/icon.png", type:"image/png", sizes:"512x512" },
      { url:"/icons/icon-48x48.png", type:"image/png", sizes:"48x48" },
      { url:"/icons/icon-96x96.png", type:"image/png", sizes:"96x96" },
      { url:"/icons/icon-192x192.png", type:"image/png", sizes:"192x192" },
    ],
    apple:[
      { url:"/apple-touch-icon.png", sizes:"180x180", type:"image/png" },
    ],
    shortcut:"/favicon.ico",
  },
  manifest: "/site.webmanifest",
};
export const viewport: Viewport = { themeColor:"#17382b", width:"device-width", initialScale:1 };

export default async function RootLayout({children}:{children:React.ReactNode}) {
  const { locale, t, catalog } = await getI18n();
  const sameAsLinks = Object.values(siteConfig.social).filter(Boolean);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": organizationId,
        "name": siteConfig.name,
        "legalName": siteConfig.legalName,
        "alternateName": ["Krishan Tours", "KrishanTours", "Krishan Tours Panadura"],
        "url": `${siteConfig.url}/`,
        "logo": { "@type": "ImageObject", "url": `${siteConfig.url}/icon.png`, "width": 512, "height": 512 },
        "image": [`${siteConfig.url}/images/og-image.jpg`, `${siteConfig.url}/images/krishan.jpg`],
        "description": t("Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka."),
        "telephone": siteConfig.phone,
        "email": siteConfig.email,
        "priceRange": "$$",
        "currenciesAccepted": "USD, EUR, LKR",
        "knowsLanguage": ["en"],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": `${siteConfig.address.street}, ${siteConfig.address.locality}`,
          "addressLocality": siteConfig.address.city,
          "addressRegion": siteConfig.address.region,
          "postalCode": siteConfig.address.postalCode,
          "addressCountry": "LK"
        },
        "geo": { "@type": "GeoCoordinates", "latitude": siteConfig.geo.latitude, "longitude": siteConfig.geo.longitude },
        "hasMap": siteConfig.social.google,
        "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "opens": "00:00", "closes": "23:59" }],
        "contactPoint": [{
          "@type": "ContactPoint",
          "telephone": siteConfig.phone,
          "email": siteConfig.email,
          "contactType": "reservations",
          "areaServed": "Worldwide",
          "availableLanguage": ["English"]
        }],
        "founder": { "@type": "Person", "name": "Krishan", "jobTitle": "Founder & Licensed Private Driver-Guide" },
        "areaServed": { "@type": "Country", "name": "Sri Lanka" },
        "sameAs": sameAsLinks
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        "url": `${siteConfig.url}/`,
        "name": siteConfig.name,
        "alternateName": "Krishan Tours",
        "publisher": { "@id": organizationId },
        "inLanguage": [...locales]
      }
    ]
  };
  return (
    <html lang={locale} dir={direction(locale)}>
      <head>
        <JsonLd data={schema} />
      </head>
      <body className={`${display.variable} ${sans.variable}`}>
        <I18nProvider locale={locale} catalog={catalog}>
          <a href="#main" className="fixed left-3 top-3 z-[100] -translate-y-24 bg-paper px-4 py-3 text-sm focus:translate-y-0">{t("Skip to content")}</a>
          <Header/>
          <main id="main">{children}</main>
          <Footer/>
          <WhatsAppCTA/>
          <CookieConsent/>
          <GoogleAnalytics measurementId={siteConfig.gaMeasurementId}/>
        </I18nProvider>
      </body>
    </html>
  );
}
