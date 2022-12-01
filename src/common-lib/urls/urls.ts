import config from "../../config/browser";
import isBrowser from "../../utils/isBrowser";
import errorReporter from "../error-reporter";

import createQueryStringFromObject from "./createQueryStringFromObject";

const reportError = errorReporter("urls.ts");

const OAK_PAGES = {
  "about-board": "/about-us/board",
  "about-who-we-are": "/about-us/who-we-are",
  "about-leadership": "/about-us/leadership",
  "about-partners": "/about-us/partners",
  "about-work-with-us": "/about-us/work-with-us",
  "blog-index": "/blog",
  "webinars-index": "/webinars",
  "careers-home": "https://app.beapplied.com/org/1574/oak-national-academy",
  contact: "/contact-us",
  "develop-your-curriculum": "/develop-your-curriculum",
  "help-home": "https://support.thenational.academy",
  home: "/",
  "lesson-planning": "/lesson-planning",
  "privacy-policy": "/legal/privacy-policy",
  "pupils-home": "https://classroom.thenational.academy",
  "support-your-team": "/support-your-team",
  "our-teachers": "https://classroom.thenational.academy/teachers",
  "teachers-home": "https://teachers.thenational.academy",
  "teachers-oak-curriculum":
    "https://teachers.thenational.academy/oaks-curricula",
  "beta-teachers-home": "/beta/teachers",
} as const;

export type OakPageName = keyof typeof OAK_PAGES;
export type OakHref = typeof OAK_PAGES[OakPageName];

// href type pattern below is to allow any string value whilst offering OakHref autocomplete
// eslint-disable-next-line @typescript-eslint/ban-types
export type MaybeOakHref = OakHref | (string & {});
// eslint-disable-next-line @typescript-eslint/ban-types
export type MaybeOakPageName = OakPageName | (string & {});

const getCurrentHostname = () => {
  if (isBrowser) {
    return window.location.hostname;
  }
  return config.get("clientAppBaseUrl");
};
export const isOakHref = (path: MaybeOakHref): path is OakHref => {
  return Object.values(OAK_PAGES).some((internalPath) => internalPath === path);
};
export const isOakPage = (page: MaybeOakPageName): page is OakPageName => {
  return Object.keys(OAK_PAGES).includes(page);
};
export const isExternalHref = (href: MaybeOakHref) => {
  if (href.startsWith("#")) {
    return false;
  }
  if (href.startsWith("/")) {
    return false;
  }

  try {
    const url = new URL(href);

    if (url.hostname === getCurrentHostname()) {
      return false;
    }
  } catch (error) {
    reportError(error, { href });
  }

  return true;
};

export type PostIndexLinkProps = {
  page: "blog-index" | "webinars-index";
  category?: string | null;
  search?: {
    page?: string;
  };
};
export type UnitIndexLinkProps = {
  page: "unit-index";
  keyStage: string;
  subject: string;
  search?: {
    ["learning-theme"]?: string | null;
    ["tier"]?: string | null;
  };
};
export type LessonIndexLinkProps = {
  page: "lesson-index";
  keyStage: string;
  subject: string;
  slug: string;
};

export type ResolveOakHrefProps =
  | {
      page: Exclude<OakPageName, "blog-index" | "webinars-index">;
    }
  | {
      page: "blog" | "webinars" | "landing-page" | "policy" | "key-stage";
      slug: string;
    }
  | PostIndexLinkProps
  | UnitIndexLinkProps
  | LessonIndexLinkProps;

/**
 * Pass readable props which are unlikely to need to change, and return an href.
 * @example
 * resolveOakHref({ page: "teachers-home "})
 * resolveOakHref({ page: "pupils-lesson", lessonSlug: "spreadsheet-warm-up-75j64r" })
 * resolveOakHref({ page: "blog", slug: "how-oak-helps-everyone" })
 */
export const resolveOakHref = (props: ResolveOakHrefProps) => {
  switch (props.page) {
    case "blog":
    case "webinars": {
      const path: OakPageName = `${props.page}-index`;
      return `${OAK_PAGES[path]}/${props.slug}`;
    }
    case "landing-page":
      return `/lp/${props.slug}`;
    case "policy":
      return `/legal/${props.slug}`;
    case "key-stage": {
      return `/beta/key-stages/${props.slug}`;
    }
    case "blog-index":
    case "webinars-index": {
      let path:
        | "/blog"
        | "/webinars"
        | `/blog/categories/${string}`
        | `/webinars/categories/${string}` = OAK_PAGES[props.page];
      if (props.category) {
        path = `${path}/categories/${props.category}`;
      }
      if (!props.search) {
        return path;
      }
      const queryString = createQueryStringFromObject(props.search);

      if (!queryString) {
        return path;
      }

      return `${path}?${queryString}`;
    }
    case "unit-index": {
      const path = `/beta/teachers/key-stage/${props.keyStage}/subject/${props.subject}/units`;
      if (!props.search) {
        return path;
      }
      const queryString = createQueryStringFromObject(props.search);

      if (!queryString) {
        return path;
      }

      return `${path}?${queryString}`;
    }
    case "lesson-index": {
      return `/beta/teachers/key-stage/${props.keyStage}/subject/${props.subject}/units/${props.slug}`;
    }

    default:
      return OAK_PAGES[props.page];
  }
};
