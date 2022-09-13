const OAK_PAGES = {
  "about-board": "/about-us/board",
  "about-who-we-are": "/about-us/who-we-are",
  blog: "/blog",
  "careers-home": "https://app.beapplied.com/org/1574/oak-national-academy",
  contact: "/contact-us",
  curriculum: "/develop-your-curriculum",
  "help-home": "https://support.thenational.academy",
  planning: "/lesson-planning",
  "pupils-home": "https://classroom.thenational.academy",
  "teachers-home": "https://teachers.thenational.academy",
  "teachers-oak-curriculum":
    "https://teachers.thenational.academy/oaks-curricula",
} as const;

export type OakPageName = keyof typeof OAK_PAGES;
export type OakHref = typeof OAK_PAGES[OakPageName];

// href type pattern below is to allow any string value whilst offering OakHref autocomplete
// eslint-disable-next-line @typescript-eslint/ban-types
export type MaybeOakHref = OakHref | (string & {});

export const isOakHref = (path: MaybeOakHref): path is OakHref => {
  return Object.values(OAK_PAGES).some((internalPath) => internalPath === path);
};
export const isExternalHref = (href: MaybeOakHref) => {
  return !href.startsWith("/");
};

export type ResolveOakHrefProps = {
  name: OakPageName;
};
/**
 * Pass readable props which are unlikely to need to change, and return an href.
 * @example
 * resolveOakHref({ name: "teachers-home "})
 * resolveOakHref({ name: "pupils-lesson", lessonSlug: "spreadsheet-warm-up-75j64r" })
 */
export const resolveOakHref = (props: ResolveOakHrefProps) => {
  return OAK_PAGES[props.name];
};
