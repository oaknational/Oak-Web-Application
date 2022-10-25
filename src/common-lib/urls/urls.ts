import config from "../../config";
import isBrowser from "../../utils/isBrowser";

const OAK_PAGES = {
  "about-board": "/about-us/board",
  "about-who-we-are": "/about-us/who-we-are",
  "blog-index": "/blog",
  "webinar-index": "/beta/webinars",
  "careers-home": "https://app.beapplied.com/org/1574/oak-national-academy",
  contact: "/contact-us",
  "develop-your-curriculum": "/develop-your-curriculum",
  "help-home": "https://support.thenational.academy",
  home: "/",
  "lesson-planning": "/lesson-planning",
  "privacy-policy": "/legal/privacy-policy",
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
  const url = new URL(href);

  if (url.hostname === getCurrentHostname()) {
    return false;
  }

  return true;
};

export type ResolveOakHrefProps =
  | {
      page: Exclude<OakPageName, "blog-index">;
    }
  | {
      page: "blog";
      slug: string;
    }
  | {
      page: "blog-index";
      category?: string | null;
      search?: {
        page?: string;
      };
    };

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
      return `${OAK_PAGES["blog-index"]}/${props.slug}`;

    case "blog-index": {
      let path: "/blog" | `/blog/categories/${string}` =
        OAK_PAGES["blog-index"];
      if (props.category) {
        path = `${path}/categories/${props.category}`;
      }
      if (!props.search) {
        return path;
      }
      const query = new URLSearchParams(props.search);

      return `${path}?${query.toString()}`;
    }

    default:
      return OAK_PAGES[props.page];
  }
};
