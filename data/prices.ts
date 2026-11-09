/**
 * Every public price on the website. These are the defaults; admins can override
 * any of them from /admin/prices (stored in SQLite, see lib/content-db.ts).
 * All amounts are USD.
 */
export type PriceDefinition = {
  key: string;
  group: string;
  label: string;
  unit: string;
  min: number;
  max?: number;
  /** Show a trailing "+" after the highest amount, e.g. "$220 – $350+". */
  plus?: boolean;
};

const transfer = (id: string, label: string, sedan: number, van: number): PriceDefinition[] => [
  { key: `transfer.${id}.sedan`, group: "Airport transfers", label: `${label} · Sedan (1–3)`, unit: "one way", min: sedan },
  { key: `transfer.${id}.van`, group: "Airport transfers", label: `${label} · Van (4–8)`, unit: "one way", min: van },
];

export const priceDefinitions: PriceDefinition[] = [
  { key: "driver.sedan", group: "Private driver", label: "AC sedan with driver (1–3 guests)", unit: "per day", min: 55, max: 65 },
  { key: "driver.van", group: "Private driver", label: "Toyota KDH van with driver (4–8 guests)", unit: "per day", min: 75, max: 90 },
  { key: "driver.tip", group: "Private driver", label: "Suggested daily tip (guidance)", unit: "per day", min: 10, max: 15 },

  { key: "privateTours.boutique", group: "Private tours", label: "Boutique private tour", unit: "per person / day", min: 120, max: 170 },
  { key: "privateTours.luxury", group: "Private tours", label: "Luxury heritage tour", unit: "per person / day", min: 220, max: 350, plus: true },

  { key: "ske.driver", group: "Sigiriya, Kandy & Ella (5 days)", label: "Driver & vehicle only", unit: "total car", min: 290, max: 340 },
  { key: "ske.package", group: "Sigiriya, Kandy & Ella (5 days)", label: "Complete package", unit: "per person", min: 480, max: 640 },
  { key: "tour7.driver", group: "7-day tour", label: "Driver & vehicle only", unit: "total car", min: 420, max: 490 },
  { key: "tour7.package", group: "7-day tour", label: "Complete boutique tour", unit: "per person", min: 690, max: 890 },
  { key: "tour10.driver", group: "10-day tour", label: "Driver & vehicle only", unit: "total car", min: 600, max: 700 },
  { key: "tour10.package", group: "10-day tour", label: "Complete package", unit: "per person", min: 980, max: 1350 },
  { key: "tour14.driver", group: "14-day tour", label: "Driver & vehicle only", unit: "total car", min: 840, max: 980 },
  { key: "tour14.package", group: "14-day tour", label: "Complete package", unit: "per person", min: 1390, max: 1850 },

  ...transfer("negombo", "Negombo", 22, 30),
  ...transfer("colombo", "Colombo City Centre", 38, 48),
  ...transfer("panadura", "Panadura / Wadduwa", 48, 58),
  ...transfer("bentota", "Bentota / Beruwala", 58, 70),
  ...transfer("hikkaduwa", "Hikkaduwa", 68, 80),
  ...transfer("galle", "Galle Fort / Unawatuna", 75, 90),
  ...transfer("mirissa", "Mirissa / Weligama", 88, 105),
  ...transfer("tangalle", "Tangalle / Hiriketiya", 105, 125),
  ...transfer("kandy", "Kandy", 78, 95),
  ...transfer("sigiriya", "Sigiriya / Dambulla", 95, 115),
  ...transfer("ella", "Ella / Nuwara Eliya", 135, 160),
  ...transfer("arugam", "Arugam Bay", 175, 210),

  // Budget brackets offered in the "Plan your trip" form (per person, whole trip).
  { key: "planner.budget1", group: "Trip planner budget options", label: "Budget bracket 1 (\"Under $X\")", unit: "per person", min: 1500 },
  { key: "planner.budget2", group: "Trip planner budget options", label: "Budget bracket 2", unit: "per person", min: 2500 },
  { key: "planner.budget3", group: "Trip planner budget options", label: "Budget bracket 3 (\"$X+\")", unit: "per person", min: 4000 },
];

export type PriceUsage = { page: string; path: string; spots: string };

const driverPage = "/sri-lanka-private-driver";
const pkgPage = { page: "Tour packages list", path: "/sri-lanka-tour-packages", spots: "“From $X / person” on the package card + Google price data" };
const tourPage = (path: string, name: string, kind: "driver" | "package"): PriceUsage[] => kind === "driver"
  ? [{ page: name, path, spots: "“Driver & vehicle only” price card + FAQ answer" }]
  : [{ page: name, path, spots: "“Complete package” price card, FAQ answer + Google price data (from price)" }, pkgPage];

/** Where every price appears on the public site (all 12 languages). Shown in /admin/prices. */
export const priceUsage: Record<string, PriceUsage[]> = {
  "driver.sedan": [
    { page: "Private driver", path: driverPage, spots: "Google title (“from $X/day”), sedan price card, FAQ answer + Google price data (lowest price)" },
    { page: "Private tours", path: "/sri-lanka-private-tours", spots: "“Driver only” option (from price)" },
  ],
  "driver.van": [
    { page: "Private driver", path: driverPage, spots: "Van price card, FAQ answer + Google price data (highest price)" },
    { page: "Private tours", path: "/sri-lanka-private-tours", spots: "“Driver only” option (up-to price)" },
  ],
  "driver.tip": [{ page: "Private driver", path: driverPage, spots: "FAQ answer about tipping" }],
  "privateTours.boutique": [{ page: "Private tours", path: "/sri-lanka-private-tours", spots: "Boutique tour price card" }],
  "privateTours.luxury": [{ page: "Private tours", path: "/sri-lanka-private-tours", spots: "Luxury heritage tour price card" }],
  "ske.driver": tourPage("/sigiriya-kandy-ella-tour", "Sigiriya, Kandy & Ella tour", "driver"),
  "ske.package": tourPage("/sigiriya-kandy-ella-tour", "Sigiriya, Kandy & Ella tour", "package"),
  "tour7.driver": tourPage("/sri-lanka-7-day-tour", "7-day tour", "driver"),
  "tour7.package": tourPage("/sri-lanka-7-day-tour", "7-day tour", "package"),
  "tour10.driver": tourPage("/sri-lanka-10-day-tour", "10-day tour", "driver"),
  "tour10.package": tourPage("/sri-lanka-10-day-tour", "10-day tour", "package"),
  "tour14.driver": tourPage("/sri-lanka-14-day-tour", "14-day tour", "driver"),
  "tour14.package": tourPage("/sri-lanka-14-day-tour", "14-day tour", "package"),
  "planner.budget1": [{ page: "Plan your trip form", path: "/plan-your-trip", spots: "Budget step: “Under $X” and “$X – next” choices" }],
  "planner.budget2": [{ page: "Plan your trip form", path: "/plan-your-trip", spots: "Budget step: middle brackets" }],
  "planner.budget3": [{ page: "Plan your trip form", path: "/plan-your-trip", spots: "Budget step: “$X+” choice" }],
};
for (const definition of priceDefinitions) {
  if (definition.key.startsWith("transfer.")) {
    priceUsage[definition.key] = [{ page: "Airport transfers", path: "/airport-transfer-sri-lanka", spots: `Rates table → ${definition.label.split(" · ")[0]} row, ${definition.key.endsWith(".van") ? "van" : "sedan"} column` }];
  }
}

/** Trips that appear in public listings and can be pinned, re-ordered or priced from /admin/trips. */
export const landingPackages = [
  { slug: "sigiriya-kandy-ella-tour", name: "Sigiriya, Kandy & Ella (5 days)", priceKey: "ske.package" },
  { slug: "sri-lanka-7-day-tour", name: "Sri Lanka 7-day tour", priceKey: "tour7.package" },
  { slug: "sri-lanka-10-day-tour", name: "Sri Lanka 10-day tour", priceKey: "tour10.package" },
  { slug: "sri-lanka-14-day-tour", name: "Sri Lanka 14-day tour", priceKey: "tour14.package" },
] as const;
