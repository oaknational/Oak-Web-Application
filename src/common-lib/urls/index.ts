const INTERNAL_PATHS = {
  "about-who-we-are": "/about-us/who-we-are",
  "about-board": "/about-us/who-we-are",
  blog: "/blog",
  contact: "/contact-us",
  curriculum: "/develop-your-curriculum",
  planning: "/lesson-planning",
} as const;

export type OakInternalPage = keyof typeof INTERNAL_PATHS;
export type OakInternalPath = typeof INTERNAL_PATHS[OakInternalPage];

const EXTERNAL_URLS = {
  "pupils-home": "https://classroom.thenational.academy",
  "teachers-home": "https://teachers.thenational.academy",
  "teachers-oak-curriculum":
    "https://teachers.thenational.academy/oaks-curricula",
  "help-home": "https://support.thenational.academy",
  "careers-home": "https://app.beapplied.com/org/1574/oak-national-academy",
} as const;

type OakExternalPage = keyof typeof EXTERNAL_URLS;
export type OakExternalUrl = typeof EXTERNAL_URLS[OakExternalPage];

export type OakHref = OakInternalPath | OakExternalUrl;
export type MaybeOakHref =
  | OakInternalPath
  | OakExternalUrl
  | Omit<string, OakInternalPath | OakExternalUrl>;

export const isOakInternalPath = (
  path: MaybeOakHref
): path is OakInternalPath => {
  return Object.values(INTERNAL_PATHS).some(
    (internalPath) => internalPath === path
  );
};

export const isOakExternalUrl = (url: MaybeOakHref): url is OakExternalUrl => {
  return Object.values(EXTERNAL_URLS).some(
    (externalUrl) => externalUrl === url
  );
};

export const isOakHref = (url: MaybeOakHref): url is OakHref => {
  return isOakInternalPath(url) || isOakExternalUrl(url);
};

export type OakPageName = OakInternalPage | OakExternalPage;
