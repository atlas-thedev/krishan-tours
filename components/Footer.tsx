"use client";
import Link from "@/components/LocalizedLink";
import { ArrowUpRight, Instagram, Facebook } from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { useI18n } from "./I18nProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer relative overflow-hidden bg-jungle text-white">
      <div className="pointer-events-none absolute -bottom-36 -right-24 h-[34rem] w-[22rem] rounded-[50%] border border-white/10 after:absolute after:inset-10 after:rounded-[50%] after:border after:border-white/10" />
      <div className="shell py-20 md:py-28">
        <p className="eyebrow text-gold">{t("There is more to see")}</p>
        <div className="mt-7 flex flex-col items-start justify-between gap-8 border-b border-white/20 pb-16 md:flex-row md:items-end">
          <h2 className="display max-w-4xl text-[clamp(4rem,10vw,9rem)] leading-[.78]">{t("Your journey")}<br/><em>{t("starts here.")}</em></h2>
          <Link href="/plan-your-trip" className="btn-light shrink-0">{t("Start planning")} <ArrowUpRight size={16}/></Link>
        </div>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo light/>
            <p className="mt-5 text-sm leading-6 text-white/60">
              {t("Krishan Tours Sri Lanka is a Panadura-based private tour and driver service offering custom trips throughout Sri Lanka.")}
            </p>
          </div>
          <div>
            <p className="eyebrow text-gold">{t("Private Services")}</p>
            <div className="mt-5 grid gap-2.5 text-sm text-white/75">
              <Link href="/sri-lanka-private-driver">{t("Private Driver Sri Lanka")}</Link>
              <Link href="/sri-lanka-private-tours">{t("Sri Lanka Private Tours")}</Link>
              <Link href="/sri-lanka-tour-packages">{t("Tour Packages")}</Link>
              <Link href="/airport-transfer-sri-lanka">{t("Airport Transfers")}</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-gold">{t("Popular Routes")}</p>
            <div className="mt-5 grid gap-2.5 text-sm text-white/75">
              <Link href="/sigiriya-kandy-ella-tour">{t("Sigiriya, Kandy & Ella")}</Link>
              <Link href="/sri-lanka-7-day-tour">{t("7-Day Sri Lanka Tour")}</Link>
              <Link href="/sri-lanka-10-day-tour">{t("10-Day Sri Lanka Tour")}</Link>
              <Link href="/sri-lanka-14-day-tour">{t("14-Day Sri Lanka Tour")}</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-gold">Krishan Tours Sri Lanka</p>
            <div className="mt-5 grid gap-2.5 text-sm text-white/75">
              <Link href="/about">{t("About us")}</Link>
              <Link href="/destinations">{t("Destinations")}</Link>
              <Link href="/tours">{t("All Tours")}</Link>
              <Link href="/plan-your-trip">{t("Plan your trip")}</Link>
              <Link href="/contact">{t("Contact")}</Link>
              <a href={siteConfig.social.tripadvisor} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                {t("Tripadvisor Reviews")} ↗
              </a>
              <a href={siteConfig.social.google} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                {t("Google Reviews")} ↗
              </a>
            </div>
          </div>
          <div>
            <p className="eyebrow text-gold">{t("Talk to us")}</p>
            <div className="mt-5 grid gap-2.5 text-sm text-white/75">
              <a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp · {siteConfig.phoneDisplay}</a>
              <a href={`tel:${siteConfig.phone}`}>{t("Call")} · {siteConfig.phoneDisplay}</a>
              <address className="mt-1 max-w-[16rem] not-italic leading-6 text-white/55">
                {siteConfig.address.street}<br/>
                {siteConfig.address.locality}, {siteConfig.address.city}<br/>
                {t(siteConfig.address.country)}
              </address>
              <div className="mt-3 flex gap-4">
                {siteConfig.social.instagram && <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={19}/></a>}
                {siteConfig.social.facebook && <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={19}/></a>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-[.67rem] uppercase tracking-[.12em] text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Krishan Tours Sri Lanka. Panadura, Sri Lanka.</span>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex gap-6">
              <Link href="/privacy">{t("Privacy")}</Link>
              <Link href="/terms">{t("Terms")}</Link>
            </div>
            <LanguageSwitcher light direction="up" />
          </div>
        </div>
      </div>
    </footer>
  );
}
