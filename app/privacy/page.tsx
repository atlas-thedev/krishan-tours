import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const generateMetadata = (): Promise<Metadata> => localizedMetadata({ title: "Privacy Policy", description: "How Krishan Tours Sri Lanka collects, uses and protects the personal information you share when planning a trip.", path: "/privacy" });

export default async function PrivacyPage() {
  const { t } = await getI18n();
  return (
    <Legal
      title={t("Privacy policy")}
      updated={t("Last updated: 24 October 2026")}
    >
      <Section title={t("Who controls your data")}>
        <p>
          {t(
            "Krishan Tours Sri Lanka, based in Panadura, Sri Lanka, controls the personal information described in this notice. Questions and privacy requests can be sent to",
          )}{" "}
          <a className="underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          .
        </p>
      </Section>
      <Section title={t("Information we collect")}>
        <p>
          {t(
            "When you contact us or use the trip planner, we collect the details you provide, which may include your name, email address, telephone or WhatsApp number, country, travel dates, group, interests, accommodation preferences, budget and message. We also record an IP address for abuse prevention and service security.",
          )}
        </p>
        <p>
          {t(
            "If you accept optional analytics, Google Analytics receives usage information such as pages viewed, device and browser information, and approximate location. Analytics is disabled until you accept it.",
          )}
        </p>
      </Section>
      <Section title={t("How and why we use it")}>
        <p>
          {t(
            "We use inquiry information to answer your request, prepare a proposed itinerary, provide requested travel services, protect the forms from abuse and maintain business records. We do not sell personal information or use inquiry details for unrelated marketing without permission.",
          )}
        </p>
      </Section>
      <Section title={t("Storage, sharing and retention")}>
        <p>
          {t(
            "Inquiries are stored in a protected database on our server and may be sent through our configured email provider so our team can respond. Service providers process information only to provide hosting, email, security or analytics services. Inquiry IP addresses are removed after 90 days. Inquiry records are deleted after two years unless they are needed for an active booking, a legal obligation or a dispute.",
          )}
        </p>
      </Section>
      <Section title={t("Online booking payments")}>
        <p>{t("When you choose to pay for a booking, your name, email, phone and billing address are sent to PayHere to process that payment. We keep the booking reference, amount, currency, payment status and transaction identifiers so we can reconcile the payment and handle disputes. Card numbers and security codes are entered on PayHere, not on our website, and are not stored in our payment records. Payment records are kept as needed for booking, accounting, legal and dispute-handling obligations.")}</p>
      </Section>
      <Section title={t("Your choices and rights")}>
        <p>
          {t(
            "You can decline analytics without affecting the website. Depending on applicable law, you may ask to access, correct or erase your information, object to or restrict processing, or withdraw consent where consent is the basis for processing. Contact us using the address above. You may also contact the Data Protection Authority of Sri Lanka.",
          )}
        </p>
      </Section>
      <Section title={t("Security and international services")}>
        <p>
          {t(
            "We use access controls, encrypted transport, restricted file permissions and backups to protect information. No online service can guarantee absolute security. Some service providers, including Google, may process information outside Sri Lanka under their own safeguards.",
          )}
        </p>
      </Section>
      <Section title={t("Updates")}>
        <p>
          {t(
            "We may update this notice when our services or legal obligations change. The date above shows the latest revision.",
          )}
        </p>
      </Section>
    </Legal>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="display text-3xl text-jungle">{title}</h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}
function Legal({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-[70vh] pb-24 pt-40">
      <div className="shell max-w-3xl">
        <p className="eyebrow text-cinnamon">KrishanTours</p>
        <h1 className="display mt-4 text-7xl">{title}</h1>
        <p className="mt-4 text-sm text-black/45">{updated}</p>
        <div className="mt-10 space-y-10 text-base leading-8 text-black/65">
          {children}
        </div>
      </div>
    </section>
  );
}
