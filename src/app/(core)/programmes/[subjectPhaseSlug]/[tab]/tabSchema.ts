export const TAB_NAMES = ["Unit sequence", "Explainer", "Download"];
export type TabName = (typeof TAB_NAMES)[number];

export const TAB_SLUGS = ["units", "overview", "download"];
export type TabSlug = (typeof TAB_SLUGS)[number];

export const tabSlugToName: Record<TabSlug, TabName> = {
  units: "Unit sequence",
  overview: "Explainer",
  download: "Download",
};

const tabNameToSlug: Record<TabName, TabSlug> = {
  "Unit sequence": "units",
  Explainer: "overview",
  Download: "download",
};

export const getTabName = (tabSlug: TabSlug): TabName => {
  const tabName = tabSlugToName[tabSlug];
  return tabName as TabName;
};

export const getTabSlug = (tabName: TabName): TabSlug => {
  const tabSlug = tabNameToSlug[tabName];
  return tabSlug as TabSlug;
};
