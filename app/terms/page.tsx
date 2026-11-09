import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const generateMetadata = (): Promise<Metadata> => localizedMetadata({ title: "Terms & Conditions", description: "Booking, payment, cancellation and travel terms for private tours, drivers and airport transfers with Krishan Tours Sri Lanka.", path: "/terms" });

const sections = [
  [
    "Website information",
    "The routes and experiences on this website are examples for planning and are not confirmed offers. Current availability, price, inclusions and exclusions will be stated in your personalised written proposal.",
  ],
  [
    "Booking agreement",
    "A booking becomes confirmed only after you accept the final proposal and KrishanTours receives any deposit specified in it. The proposal, invoice and agreed messages form the booking agreement.",
  ],
  [
    "Payments and prices",
    "Payment amount, currency, due dates and accepted methods will appear in your proposal. Bank, card or currency-conversion charges are the traveller’s responsibility unless stated otherwise.",
  ],
  [
    "Changes and cancellations",
    "Cancellation and change terms, including any supplier charges and refund eligibility, will be provided before payment. We will explain material changes and offer reasonable alternatives where possible.",
  ],
  [
    "Traveller responsibilities",
    "Travellers are responsible for valid passports, visas, insurance, health advice and arriving at agreed meeting points on time. Please disclose mobility, medical, dietary or other needs that may affect safe delivery of the trip.",
  ],
  [
    "Suppliers and circumstances beyond control",
    "Hotels, guides, transport operators and activity providers may supply parts of a journey. Weather, road conditions, public decisions and other events outside reasonable control can require changes. We will assist and minimise disruption but cannot promise that every planned element will operate unchanged.",
  ],
  [
    "Safety and conduct",
    "Travellers must follow reasonable safety instructions, local law and rules protecting communities, sacred places and wildlife. We may refuse an activity that presents a serious safety, legal or welfare risk.",
  ],
  [
    "Problems during a trip",
    "Tell us promptly about a problem so we have a fair opportunity to help. Supporting documents may be required when a refund or supplier claim is requested.",
  ],
  [
    "Website use",
    "Website text, branding and original design may not be copied for commercial use without permission. You must not interfere with the website, attempt unauthorised access or submit unlawful or abusive content.",
  ],
  [
    "Applicable terms",
    "The specific written proposal takes priority if it conflicts with general website information. These terms should be read with the privacy policy. Mandatory rights under applicable law are not excluded.",
  ],
] as const;

export default async function TermsPage() {
  const { t } = await getI18n();
  return (
    <section className="min-h-[70vh] pb-24 pt-40">
      <div className="shell max-w-3xl">
        <p className="eyebrow text-cinnamon">KrishanTours</p>
        <h1 className="display mt-4 text-7xl">{t("Terms & conditions")}</h1>
        <p className="mt-4 text-sm text-black/45">
          {t("Last updated: 7 September 2026")}
        </p>
        <div className="mt-10 space-y-10 text-base leading-8 text-black/65">
          {sections.map(([title, text]) => (
            <section key={title}>
              <h2 className="display text-3xl text-jungle">{t(title)}</h2>
              <p className="mt-3">{t(text)}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
