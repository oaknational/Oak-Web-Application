export const TAB_NAMES = ["Unit sequence", "Explainer", "Download"] as const;
export type TabName = (typeof TAB_NAMES)[number];

export const TAB_SLUGS = ["units", "overview", "download"] as const;
export type TabSlug = (typeof TAB_SLUGS)[number];

export const tabSlugToName: Record<TabSlug, TabName> = {
  units: "Unit sequence",
  overview: "Explainer",
  download: "Download",
};

export const tabNameToSlug: Record<TabName, TabSlug> = {
  "Unit sequence": "units",
  Explainer: "overview",
  Download: "download",
};

export const isTabSlug = (u: unknown): u is TabSlug => {
  return typeof u === "string" && TAB_SLUGS.includes(u as TabSlug);
};
