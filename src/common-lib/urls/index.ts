// Alphabetical order please
// export type OakInternalPath =
//   | "/about-us/board"
//   | "/about-us/who-we-are"
//   | "/blog"
//   | "/contact-us"
//   | "/develop-your-curriculum"
//   | "/lesson-planning";
// export type OakInternalPage =
//   | "aboutWhoWeAre"
//   | "aboutBoard"
//   | "blog"
//   | "contact"
//   | "curriculum"
//   | "planning";

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

// export const getPupilsUrl = () => {
//   return "https://classroom.thenational.academy/";
// };
// export const getTeachersUrl = () => {
//   return "https://teachers.thenational.academy";
// };
// /**
//  * Url for support/help centre
//  */
// export const getHelpUrl = () => {
//   return "https://support.thenational.academy/";
// };
// export const getCareersUrl = () => {
//   return "https://app.beapplied.com/org/1574/oak-national-academy";
// };
// export const getOakCurriculumUrl = () => {
//   return `${getTeachersUrl()}/oaks-curricula`;
// };

export type OakPageName = OakInternalPage | OakExternalPage;
const isInternal = (pageName: OakPageName): pageName is OakInternalPage => {
  return Object.keys(INTERNAL_PATHS).includes(pageName);
};

export const getOakLinkProps = (props: {
  pageName: OakInternalPage | OakExternalPage;
}) => {
  const { pageName } = props;

  if (isInternal(pageName)) {
    return {
      href: INTERNAL_PATHS[pageName],
    };
  }

  return {
    href: EXTERNAL_URLS[pageName],
    _target: "_blank",
  };
};
