import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { TripManager, type ManagedTrip } from "@/components/admin/TripManager";
import { isAdmin } from "@/lib/admin-auth";
import { getPrices, getTripSettings, orderBySettings } from "@/lib/content-db";
import { inquiryCounts } from "@/lib/inquiries-db";
import { tours } from "@/data/tours";
import { landingPackages } from "@/data/prices";

export const metadata: Metadata = { title: "Trips · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const durations: Record<string, number> = { "sigiriya-kandy-ella-tour": 5, "sri-lanka-7-day-tour": 7, "sri-lanka-10-day-tour": 10, "sri-lanka-14-day-tour": 14 };

export default async function AdminTripsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = getTripSettings();
  const prices = getPrices();
  const keepHidden = (slug: string) => ({ pinned: !!settings[slug]?.pinned, hidden: !!settings[slug]?.hidden });
  const visibleFirst = <T extends { slug: string }>(items: readonly T[]) => {
    const shown = orderBySettings(items, settings);
    return [...shown, ...items.filter((item) => !shown.includes(item))];
  };
  const trips: ManagedTrip[] = [
    ...visibleFirst(tours).map((tour) => ({ slug: tour.slug, name: tour.name, list: "Tours page & homepage (top 3 show on homepage)", duration: tour.duration, href: `/tours/${tour.slug}`, ...keepHidden(tour.slug), fromPrice: settings[tour.slug]?.fromPrice != null ? String(settings[tour.slug].fromPrice) : "" })),
    ...visibleFirst(landingPackages).map((pkg) => ({ slug: pkg.slug, name: pkg.name, list: "Tour packages page", duration: durations[pkg.slug], href: `/${pkg.slug}`, ...keepHidden(pkg.slug), fromPrice: String(prices[pkg.priceKey].min), priceKey: pkg.priceKey })),
  ];
  return <AdminShell active="trips" title="Trips" subtitle="Pin a trip to put it first in its list, re-order with the arrows, hide trips you don’t offer right now, and set the “From” price shown to travellers and Google." badge={inquiryCounts().new}>
    <TripManager initial={trips}/>
  </AdminShell>;
}
