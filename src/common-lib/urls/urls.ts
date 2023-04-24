import { ExpandingContainerTitle } from "../../components/ExpandingContainer/ExpandingContainer";
import config from "../../config/browser";
import { SearchQuery } from "../../context/Search/useSearch";
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
  "terms-and-conditions": "/legal/terms-and-conditions",
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
export type TierSelectionLinkProps = {
  page: "tier-selection";
  keyStage: string;
  subject: string;
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

export type ProgrammeLinkProps = {
  page: "programme";
  programme: string;
  search?: {
    ["learning-theme"]?: string | null;
  };
};
export type KeyStageSubjectProgrammesLinkProps = {
  page: "key-stage-subject-programmes";
  keyStage: string;
  subject: string;
};
export type LessonIndexLinkProps = {
  page: "lesson-index";
  keyStage: string;
  subject: string;
  slug: string;
};
export type LessonOverviewLinkProps = {
  page: "lesson-overview";
  keyStage: string;
  subject: string;
  unit: string;
  slug: string;
};
export type ProgrammeLessonOverviewLinkProps = {
  page: "programme-lesson-overview";
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
};
export type ProgrammeLessonIndexProps = {
  page: "programme-lesson-index";
  programmeSlug: string;
  unitSlug: string;
};

type LessonDownloadsLinkProps = {
  page: "lesson-downloads";
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  query?: {
    preselected: ExpandingContainerTitle | "all";
  };
};

export type ResolveOakHrefProps =
  | {
      page: Exclude<OakPageName, "blog-index" | "webinars-index">;
    }
  | {
      page:
        | "blog"
        | "webinars"
        | "landing-page"
        | "policy"
        | "subject-index"
        | "key-stage";
      slug: string;
    }
  | { page: "beta-search"; query?: Partial<SearchQuery> }
  | PostIndexLinkProps
  | TierSelectionLinkProps
  | UnitIndexLinkProps
  | LessonIndexLinkProps
  | LessonOverviewLinkProps
  | LessonDownloadsLinkProps
  | ProgrammeLinkProps
  | KeyStageSubjectProgrammesLinkProps
  | ProgrammeLessonOverviewLinkProps
  | ProgrammeLessonIndexProps;

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
      return `/beta/teachers/key-stages/${props.slug}`;
    }
    case "subject-index": {
      return `/beta/teachers/key-stages/${props.slug}/subjects`;
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
    case "tier-selection": {
      /**
       * @todo poor naming. Can do better
       * Technically this would be a "mandatory filter page"
       * Or a "programme factor selection page"
       * Though longer term it might be better to name these urls:
       * "/key-stages/{}/subjects/{}" etc.
       */
      const path = `/beta/teachers/key-stages/${props.keyStage}/subjects/${props.subject}/units`;
      /**
       * ! - re-routed so that tiers is directed to units url
       */
      return path;
    }
    case "unit-index": {
      const path = `/beta/teachers/key-stages/${props.keyStage}/subjects/${props.subject}/units`;
      if (!props.search) {
        return path;
      }

      const queryString = createQueryStringFromObject(props.search);

      if (!queryString) {
        return path;
      }

      return `${path}?${queryString}`;
    }
    case "key-stage-subject-programmes": {
      return `/beta/teachers/key-stages/${props.keyStage}/subjects/${props.subject}/programmes`;
    }
    case "programme": {
      const path = `/beta/teachers/programmes/${props.programme}/units`;
      if (!props.search) {
        return path;
      }

      const queryString = createQueryStringFromObject(props.search);

      if (!queryString) {
        return path;
      }

      return `${path}?${queryString}`;
    }
    case "programme-lesson-index": {
      return `/beta/teachers/programmes/${props.programmeSlug}/units/${props.unitSlug}/lessons`;
    }
    case "lesson-index": {
      return `/beta/teachers/key-stages/${props.keyStage}/subjects/${props.subject}/units/${props.slug}`;
    }
    case "lesson-overview": {
      return `/beta/teachers/key-stages/${props.keyStage}/subjects/${props.subject}/units/${props.unit}/lessons/${props.slug}`;
    }
    case "programme-lesson-overview": {
      return `/beta/teachers/programmes/${props.programmeSlug}/units/${props.unitSlug}/lessons/${props.lessonSlug}`;
    }
    case "lesson-downloads": {
      let path = `/beta/teachers/programmes/${props.programmeSlug}/units/${props.unitSlug}/lessons/${props.lessonSlug}/downloads`;
      if (props.query) {
        const queryString = createQueryStringFromObject(props.query);
        path += `?${queryString.toLowerCase()}`;
      }
      return path;
    }
    case "beta-search": {
      const path = "/beta/teachers/search";
      if (!props.query) {
        return path;
      }
      const queryString = createQueryStringFromObject(props.query);

      return `${path}?${queryString}`;
    }
    default:
      return OAK_PAGES[props.page];
  }
};
