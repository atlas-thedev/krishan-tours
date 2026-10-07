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
];

/** Trips that appear in public listings and can be pinned, re-ordered or priced from /admin/trips. */
export const landingPackages = [
  { slug: "sigiriya-kandy-ella-tour", name: "Sigiriya, Kandy & Ella (5 days)", priceKey: "ske.package" },
  { slug: "sri-lanka-7-day-tour", name: "Sri Lanka 7-day tour", priceKey: "tour7.package" },
  { slug: "sri-lanka-10-day-tour", name: "Sri Lanka 10-day tour", priceKey: "tour10.package" },
  { slug: "sri-lanka-14-day-tour", name: "Sri Lanka 14-day tour", priceKey: "tour14.package" },
] as const;
