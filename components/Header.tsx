"use client";

import { useEffect, useState } from "react";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { PaymentNav } from "./PaymentNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "./I18nProvider";
import { destinations } from "@/data/destinations";

const nav = [
  { label: "Destinations", href: "/destinations", menu: true },
  { label: "Tours", href: "/tours", menu: true },
  { label: "Experiences", href: "/experiences" },
  { label: "Plan Your Trip", href: "/plan-your-trip" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const regions = [
  "Hill Country",
  "Cultural Triangle",
  "South Coast",
  "East Coast",
  "Wildlife",
  "Cities",
];

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobile(false);
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const dark = scrolled || openMenu;
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${dark ? "bg-ivory/95 text-ink shadow-[0_1px_0_rgba(0,0,0,.1)] backdrop-blur-md" : "text-white"}`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="shell flex h-[76px] items-center justify-between lg:h-[88px]">
          <Logo light={!dark} />
          <nav
            aria-label={t("Primary navigation")}
            className="hidden items-center gap-4 xl:flex"
          >
            {nav.map((item) => (
              <div
                key={item.label}
                onMouseEnter={() =>
                  item.menu ? setOpenMenu(item.label) : setOpenMenu(null)
                }
                onFocus={() =>
                  item.menu ? setOpenMenu(item.label) : setOpenMenu(null)
                }
              >
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center gap-1 text-[.69rem] font-bold uppercase tracking-[.1em] transition-opacity hover:opacity-60"
                >
                  {t(item.label)}
                  {item.menu && <ChevronDown size={13} aria-hidden="true" />}
                </Link>
              </div>
            ))}
            <PaymentNav />
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher light={!dark} />
            <Link
              href="/plan-your-trip"
              data-solid={Boolean(dark)}
              className={`header-journey hidden min-h-10 sm:min-h-11 items-center border px-4 text-[.68rem] font-bold uppercase tracking-[.12em] transition-colors lg:flex ${
                dark
                  ? "border-jungle bg-jungle hover:border-cinnamon hover:bg-cinnamon"
                  : "border-white/60 hover:bg-white hover:text-jungle"
              }`}
            >
              {t("Plan My Journey")}
            </Link>
            <button
              type="button"
              onClick={() => setMobile(true)}
              className="flex h-11 w-11 items-center justify-center xl:hidden"
              aria-label={t("Open navigation")}
            >
              <Menu />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {openMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="border-t border-black/10 bg-ivory text-ink"
            >
              <div className="shell grid grid-cols-[1fr_2fr] gap-16 py-10">
                <div>
                  <p className="eyebrow text-cinnamon">
                    {t(
                      openMenu === "Destinations"
                        ? "Explore by region"
                        : "Travel your way",
                    )}
                  </p>
                  <p className="display mt-4 max-w-sm text-4xl leading-[.95]">
                    {t(
                      openMenu === "Destinations"
                        ? "Find your corner of the island."
                        : "A route to make your own.",
                    )}
                  </p>
                  <Link
                    href={
                      openMenu === "Destinations" ? "/destinations" : "/tours"
                    }
                    className="link-arrow mt-8"
                  >
                    {t("View all")} <ArrowUpRight size={15} />
                  </Link>
                </div>
                {openMenu === "Destinations" ? (
                  <div className="grid grid-cols-3 gap-x-10 gap-y-6">
                    {regions.map((region, index) => {
                      const match = destinations.find(
                        (d) =>
                          d.region === region ||
                          (region === "Wildlife" && d.slug === "yala") ||
                          (region === "Cities" && d.slug === "kandy"),
                      );
                      return (
                        <Link
                          key={region}
                          href={
                            match
                              ? `/destinations/${match.slug}`
                              : "/destinations"
                          }
                          className="group flex items-center gap-4 border-b border-black/10 pb-5"
                        >
                          <span className="text-[.62rem] text-cinnamon">
                            0{index + 1}
                          </span>
                          <span className="display text-2xl group-hover:italic">
                            {t(region)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-12 gap-y-0">
                    {[
                      { label: "Sri Lanka Private Driver", href: "/sri-lanka-private-driver" },
                      { label: "Sri Lanka Private Tours", href: "/sri-lanka-private-tours" },
                      { label: "Sri Lanka Tour Packages", href: "/sri-lanka-tour-packages" },
                      { label: "Airport Transfer Sri Lanka", href: "/airport-transfer-sri-lanka" },
                      { label: "Sigiriya, Kandy & Ella (5 Days)", href: "/sigiriya-kandy-ella-tour" },
                      { label: "7-Day Sri Lanka Tour", href: "/sri-lanka-7-day-tour" },
                      { label: "10-Day Sri Lanka Tour", href: "/sri-lanka-10-day-tour" },
                      { label: "14-Day Sri Lanka Tour", href: "/sri-lanka-14-day-tour" },
                    ].map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center justify-between border-b border-black/10 py-3.5"
                      >
                        <span className="display text-xl group-hover:italic">
                          {t(item.label)}
                        </span>
                        <span className="text-[.6rem] text-cinnamon">
                          0{index + 1}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("Mobile navigation")}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] overflow-y-auto bg-jungle text-white xl:hidden"
          >
            <div className="shell flex h-[76px] items-center justify-between">
              <Logo light />
              <div className="flex items-center gap-2">
                <LanguageSwitcher light onChange={() => setMobile(false)} />
                <button
                  type="button"
                  onClick={() => setMobile(false)}
                  className="flex h-12 w-12 items-center justify-center"
                  aria-label={t("Close navigation")}
                >
                  <X />
                </button>
              </div>
            </div>
            <div className="shell grid min-h-[calc(100dvh-76px)] content-between gap-10 pb-8 pt-6 md:grid-cols-[1.2fr_.8fr] md:items-end">
              <nav className="flex flex-col" aria-label={t("Mobile navigation")}>
                {nav.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobile(false)}
                    className="group flex items-center justify-between border-b border-white/15 py-3.5"
                  >
                    <span className="display text-[clamp(2.2rem,8vw,4.5rem)] leading-none">
                      {t(item.label)}
                    </span>
                    <span className="text-[.6rem] text-gold">0{index + 1}</span>
                  </Link>
                ))}
                <PaymentNav mobile onNavigate={() => setMobile(false)} />
              </nav>
              <div className="relative hidden aspect-[4/5] overflow-hidden md:block">
                <Image
                  src="/images/ella-train.webp"
                  alt={t("Train winding through Sri Lanka's hill country")}
                  fill
                  sizes="65vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-5">
                <p className="max-w-xs text-sm leading-6 text-white/65">
                  {t(
                    "Private journeys, planned on the island by people who know its roads.",
                  )}
                </p>
                <Link
                  href="/plan-your-trip"
                  onClick={() => setMobile(false)}
                  className="btn-light w-full sm:w-auto"
                >
                  {t("Plan My Journey")} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
