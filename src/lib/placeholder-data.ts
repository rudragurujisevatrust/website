import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Category, Event } from "@/lib/types";

/**
 * Stand-in content so every public page renders before Supabase is wired up.
 * Structure (ids, images, dates, colours) lives here; all prose comes from the
 * active dictionary, so the demo feed reads in the visitor's language too.
 *
 * The shapes match what the database will return, so components do not change
 * when the queries land.
 */

type CategoryKey = keyof Dictionary["categories"];
type DemoEventKey = keyof Dictionary["demoEvents"];

const categorySeed: {
  key: CategoryKey;
  id: string;
  slug: string;
  color: string;
}[] = [
  { key: "annadhanam", id: "cat-annadhanam", slug: "annadhanam", color: "#E2711D" },
  { key: "farming", id: "cat-farming", slug: "farmer-support", color: "#4C8B3F" },
  { key: "medical", id: "cat-medical", slug: "medical-aid", color: "#2F6FA5" },
  { key: "financial", id: "cat-financial", slug: "financial-help", color: "#9B3D8B" },
  { key: "education", id: "cat-education", slug: "vidya-daanam", color: "#6B4CA8" },
  { key: "utsava", id: "cat-utsava", slug: "utsava", color: "#B32B2B" },
];

const eventSeed: {
  key: DemoEventKey;
  images: string[];
  event_date: string;
  created_at: string;
  categoryKeys: CategoryKey[];
}[] = [
  {
    key: "evt-001",
    images: [
      "/placeholders/annadhanam-1.svg",
      "/placeholders/annadhanam-2.svg",
      "/placeholders/annadhanam-3.svg",
    ],
    event_date: "2026-08-05",
    created_at: "2026-08-05T13:10:00.000Z",
    categoryKeys: ["annadhanam"],
  },
  {
    key: "evt-002",
    images: ["/placeholders/farming-1.svg", "/placeholders/farming-2.svg"],
    event_date: "2026-08-03",
    created_at: "2026-08-03T11:00:00.000Z",
    categoryKeys: ["farming"],
  },
  {
    key: "evt-003",
    images: ["/placeholders/medical-1.svg"],
    event_date: "2026-08-01",
    created_at: "2026-08-01T09:45:00.000Z",
    categoryKeys: ["medical", "financial"],
  },
  {
    key: "evt-004",
    images: ["/placeholders/education-1.svg"],
    event_date: "2026-07-28",
    created_at: "2026-07-28T10:20:00.000Z",
    categoryKeys: ["education"],
  },
  {
    key: "evt-005",
    images: [
      "/placeholders/temple-1.svg",
      "/placeholders/annadhanam-2.svg",
      "/placeholders/annadhanam-3.svg",
      "/placeholders/annadhanam-1.svg",
    ],
    event_date: "2026-07-24",
    created_at: "2026-07-24T18:00:00.000Z",
    categoryKeys: ["utsava", "annadhanam"],
  },
  {
    key: "evt-006",
    images: ["/placeholders/financial-1.svg"],
    event_date: "2026-07-20",
    created_at: "2026-07-20T08:15:00.000Z",
    categoryKeys: ["financial"],
  },
  {
    key: "evt-007",
    images: ["/placeholders/medical-2.svg", "/placeholders/medical-1.svg"],
    event_date: "2026-07-14",
    created_at: "2026-07-14T16:30:00.000Z",
    categoryKeys: ["medical"],
  },
];

export function getPlaceholderCategories(dict: Dictionary): Category[] {
  return categorySeed.map((seed) => ({
    id: seed.id,
    name: dict.categories[seed.key],
    slug: seed.slug,
    color: seed.color,
    created_at: "2026-01-05T04:30:00.000Z",
  }));
}

export function getPlaceholderEvents(dict: Dictionary): Event[] {
  const categories = getPlaceholderCategories(dict);
  const byKey = new Map(
    categorySeed.map((seed, index) => [seed.key, categories[index]]),
  );

  return eventSeed.map((seed) => ({
    id: seed.key,
    title: dict.demoEvents[seed.key].title,
    description: dict.demoEvents[seed.key].description,
    images: seed.images,
    event_date: seed.event_date,
    published: true,
    created_at: seed.created_at,
    updated_at: seed.created_at,
    categories: seed.categoryKeys.map((key) => byKey.get(key)!),
  }));
}

/** Figures are numerals in every locale; only the labels are translated. */
export const statValues = {
  days: "1,180+",
  meals: "400+",
  farmers: "230",
  hospital: "96",
} as const;

export function getTrustStats(dict: Dictionary) {
  return [
    { label: dict.stats.days, value: statValues.days },
    { label: dict.stats.meals, value: statValues.meals },
    { label: dict.stats.farmers, value: statValues.farmers },
    { label: dict.stats.hospital, value: statValues.hospital },
  ];
}
