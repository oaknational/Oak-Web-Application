import { match, compile, MatchFunction } from "path-to-regexp";

import { PreselectedDownloadType } from "../../components/DownloadComponents/downloads.types";
import { PageNameValueType } from "../../browser-lib/avo/Avo";
import config from "../../config/browser";
import { SearchQuery } from "../../context/Search/useSearch";
import isBrowser from "../../utils/isBrowser";
import errorReporter from "../error-reporter";
import OakError from "../../errors/OakError";

import createQueryStringFromObject, {
  UrlQueryObject,
} from "./createQueryStringFromObject";

const reportError = errorReporter("urls.ts");

/**
 * type pattern below is to allow any string value whilst offering autocomplete
 * on a union type specified. E.g. type A = "foo" | "bar" | OrString would
 * allow strings, but would autocomplete with "foo", "bar"
 */
// eslint-disable-next-line @typescript-eslint/ban-types
type OrString = string & {};

export type OakPageType = keyof OakPages;
export type OakHref = ReturnType<OakPages[OakPageType]["resolveHref"]>;

export type MaybeOakHref = OakHref | OrString;
export type MaybeOakPageType = OakPageType | OrString;

export type AnalyticsPageName = PageNameValueType | ExternalPageName;

// /teachers/ or /pupils/
export const VIEW_TYPES = ["teachers", "teachers-2023"] as const;
export type ViewType = typeof VIEW_TYPES[number];

const getCurrentHostname = () => {
  if (isBrowser) {
    return window.location.hostname;
  }
  return config.get("clientAppBaseUrl");
};
export const isOakPage = (page: MaybeOakPageType): page is OakPageType => {
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

export type BlogListingLinkProps = {
  page: "blog-index";
  categorySlug?: string | null;
  search?: {
    page?: string;
  };
};
export type WebinarListingLinkProps = {
  page: "webinar-index";
  categorySlug?: string | null;
  search?: {
    page?: string;
  };
};
export type ProgrammeListingLinkProps = {
  page: "programme-index";
  viewType: ViewType;
  keyStageSlug: string;
  subjectSlug: string;
};
export type UnitListingLinkProps = {
  page: "unit-index";
  viewType: ViewType;
  programmeSlug: string;
  search?: {
    ["learning-theme"]?: string | null;
  };
};
export type KeyStageSubjectProgrammesLinkProps = {
  page: "key-stage-subject-programmes";
  keyStageSlug: string;
  subjectSlug: string;
};
type LessonListingLinkProps = {
  page: "lesson-index";
  viewType: ViewType;
  programmeSlug: string;
  unitSlug: string;
};
type LessonOverviewLinkProps = {
  page: "lesson-overview";
  viewType: ViewType;
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
};
type LessonDownloadsLinkProps = {
  page: "lesson-downloads";
  viewType: ViewType;
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  query?: {
    preselected: PreselectedDownloadType | null;
  };
};
type SearchLinkProps = {
  page: "search";
  viewType: ViewType;
  query?: Partial<SearchQuery>;
};
type LandingPageLinkProps = { page: "landing-page"; lpSlug: string };
type SubjectListingLinkProps = {
  page: "subject-index";
  viewType: ViewType;
  keyStageSlug: string;
};
type WebinarSingleLinkProps = { page: "webinar-single"; webinarSlug: string };
type BlogSingleLinkProps = { page: "blog-single"; blogSlug: string };
type AboutUsBoardLinkProps = { page: "about-board" };
type AboutUsWhoWeAreLinkProps = { page: "about-who-we-are" };
type AboutUsLeadershipLinkProps = { page: "about-leadership" };
type AboutUsPartnersLinkProps = { page: "about-partners" };
type AboutUsWorkWithUsLinkProps = { page: "about-work-with-us" };

type CareersLinkProps = { page: "careers" };
type ContactUsLinkProps = { page: "contact" };
type DevelopYourCurriculumLinkProps = { page: "develop-your-curriculum" };
type HelpLinkProps = { page: "help" };
type HomeLinkProps = { page: "home"; viewType: ViewType | null };
type LessonPlanningLinkProps = { page: "lesson-planning" };
type LegalLinkProps = {
  page: "legal";
  /**
   * The slug for legal pages comes from Sanity so should technically be a
   * string, but the assumption is that the slugs will not be changing from
   * their current values:
   */
  legalSlug: "privacy-policy" | "terms-and-conditions" | OrString;
};
type SupportYourTeamLinkProps = { page: "support-your-team" };
type OurTeachersLinkProps = { page: "our-teachers" };
type OakCurriculumLinkProps = { page: "oak-curriculum" };
type ClassroomLinkProps = { page: "classroom" };
type TeacherHubLinkProps = { page: "teacher-hub" };
type OakLinkProps =
  | SubjectListingLinkProps
  | LandingPageLinkProps
  | LessonDownloadsLinkProps
  | LessonOverviewLinkProps
  | LessonListingLinkProps
  | UnitListingLinkProps
  | ProgrammeListingLinkProps
  | BlogListingLinkProps
  | BlogSingleLinkProps
  | WebinarListingLinkProps
  | WebinarSingleLinkProps
  | HelpLinkProps
  | LegalLinkProps
  | SearchLinkProps
  | AboutUsBoardLinkProps
  | AboutUsWhoWeAreLinkProps
  | AboutUsLeadershipLinkProps
  | AboutUsPartnersLinkProps
  | AboutUsWorkWithUsLinkProps
  | CareersLinkProps
  | ContactUsLinkProps
  | DevelopYourCurriculumLinkProps
  | HomeLinkProps
  | LessonPlanningLinkProps
  | SupportYourTeamLinkProps
  | OurTeachersLinkProps
  | OakCurriculumLinkProps
  | ClassroomLinkProps
  | TeacherHubLinkProps;

const EXTERNAL_PAGE_NAMES = [
  "[external] Careers",
  "[external] Help",
  "[external] Classroom",
  "[external] Our teachers",
  "[external] Teacher hub",
  "[external] Our curriculum",
] as const;
type ExternalPageName = typeof EXTERNAL_PAGE_NAMES[number];

type OakPages = {
  classroom: OakPageConfig<ClassroomLinkProps>;
  "teacher-hub": OakPageConfig<TeacherHubLinkProps>;
  help: OakPageConfig<HelpLinkProps>;
  careers: OakPageConfig<CareersLinkProps>;
  "about-board": OakPageConfig<AboutUsBoardLinkProps>;
  "about-who-we-are": OakPageConfig<AboutUsWhoWeAreLinkProps>;
  "about-leadership": OakPageConfig<AboutUsLeadershipLinkProps>;
  "about-partners": OakPageConfig<AboutUsPartnersLinkProps>;
  "about-work-with-us": OakPageConfig<AboutUsWorkWithUsLinkProps>;
  contact: OakPageConfig<ContactUsLinkProps>;
  "develop-your-curriculum": OakPageConfig<DevelopYourCurriculumLinkProps>;
  home: OakPageConfig<HomeLinkProps>;
  "lesson-planning": OakPageConfig<LessonPlanningLinkProps>;
  legal: OakPageConfig<LegalLinkProps>;
  "support-your-team": OakPageConfig<SupportYourTeamLinkProps>;
  "our-teachers": OakPageConfig<OurTeachersLinkProps>;
  "oak-curriculum": OakPageConfig<OakCurriculumLinkProps>;
  "blog-index": OakPageConfig<BlogListingLinkProps>;
  "webinar-index": OakPageConfig<WebinarListingLinkProps>;
  "programme-index": OakPageConfig<ProgrammeListingLinkProps>;
  "unit-index": OakPageConfig<UnitListingLinkProps>;
  "lesson-index": OakPageConfig<LessonListingLinkProps>;
  "lesson-overview": OakPageConfig<LessonOverviewLinkProps>;
  "lesson-downloads": OakPageConfig<LessonDownloadsLinkProps>;
  search: OakPageConfig<SearchLinkProps>;
  "landing-page": OakPageConfig<LandingPageLinkProps>;
  "subject-index": OakPageConfig<SubjectListingLinkProps>;
  "webinar-single": OakPageConfig<WebinarSingleLinkProps>;
  "blog-single": OakPageConfig<BlogSingleLinkProps>;
};

type OakPageConfig<
  ResolveHrefProps extends {
    page: string;
    query?: UrlQueryObject;
  }
> =
  | {
      analyticsPageName: PageNameValueType;
      pageType: ResolveHrefProps["page"];
      resolveHref: (props: ResolveHrefProps) => string;
      matchHref: MatchFunction<Omit<ResolveHrefProps, "page">>;
      configType: "internal" | "internal-custom-resolve";
    }
  | {
      analyticsPageName: ExternalPageName;
      pageType: ResolveHrefProps["page"];
      resolveHref: (props: ResolveHrefProps) => string;
      matchHref: MatchFunction<Omit<ResolveHrefProps, "page">>;
      configType: "external";
    };
export function createOakPageConfig<ResolveHrefProps extends OakLinkProps>(
  props:
    | {
        configType: "internal";
        pathPattern: string;
        analyticsPageName: PageNameValueType;
        pageType: ResolveHrefProps["page"];
      }
    | {
        configType: "internal-custom-resolve";
        resolveHref: (props: ResolveHrefProps) => string;
        matchHref: MatchFunction<Omit<ResolveHrefProps, "page">>;
        analyticsPageName: PageNameValueType;
        pageType: ResolveHrefProps["page"];
      }
    | {
        configType: "external";
        url: string;
        analyticsPageName: ExternalPageName;
        pageType: ResolveHrefProps["page"];
      }
): OakPageConfig<ResolveHrefProps> {
  switch (props.configType) {
    case "external":
      return {
        ...props,
        matchHref: () => false,
        resolveHref: () => props.url,
      };
    case "internal":
      return {
        ...props,
        matchHref: match<Omit<ResolveHrefProps, "page">>(props.pathPattern, {
          decode: decodeURIComponent,
        }),
        resolveHref: (resolveHrefProps: ResolveHrefProps) => {
          const path = compile<Omit<ResolveHrefProps, "page">>(
            props.pathPattern,
            { encode: encodeURIComponent }
          )(resolveHrefProps);
          /**
           * @todo consolidate these -> query
           */
          if ("search" in resolveHrefProps) {
            return `${path}?${createQueryStringFromObject(
              resolveHrefProps.search
            )}`;
          }
          if ("query" in resolveHrefProps) {
            return `${path}?${createQueryStringFromObject(
              resolveHrefProps.query
            )}`;
          }
          return path;
        },
      };
    case "internal-custom-resolve":
      return {
        ...props,
      };
  }
}

const postMatchHref =
  <PostListingLinkProps extends BlogListingLinkProps | WebinarListingLinkProps>(
    postType: PostListingLinkProps["page"]
  ) =>
  (href: string) => {
    const path = postType === "blog-index" ? "/blog" : "/webinars";
    if (match(`${path}`)(href)) {
      return match<PostListingLinkProps>(path)(href);
    }
    if (match(`${path}/categories/:category`)(href)) {
      return match<PostListingLinkProps>(`${path}/categories/:category`)(href);
    }
    return false;
  };
const postResolveHref =
  <PostListingLinkProps extends BlogListingLinkProps | WebinarListingLinkProps>(
    postType: PostListingLinkProps["page"]
  ) =>
  (props: PostListingLinkProps) => {
    let path = postType === "blog-index" ? "/blog" : "/webinars";
    if (props.categorySlug) {
      path = `${path}/categories/${props.categorySlug}`;
    }
    if (!props.search) {
      return path;
    }
    const queryString = createQueryStringFromObject(props.search);

    if (!queryString) {
      return path;
    }

    return `${path}?${queryString}`;
  };

export const OAK_PAGES: {
  [K in keyof OakPages]: OakPages[K] & { pageType: K };
} = {
  "about-board": createOakPageConfig({
    pathPattern: "/about-us/board",
    analyticsPageName: "About Us: Board",
    configType: "internal",
    pageType: "about-board",
  }),
  "about-who-we-are": createOakPageConfig({
    pathPattern: "/about-us/who-we-are",
    analyticsPageName: "About Us: Who We Are",
    configType: "internal",
    pageType: "about-who-we-are",
  }),
  "about-leadership": createOakPageConfig({
    pathPattern: "/about-us/leadership",
    analyticsPageName: "About Us: Leadership",
    configType: "internal",
    pageType: "about-leadership",
  }),
  "about-partners": createOakPageConfig({
    pathPattern: "/about-us/partners",
    analyticsPageName: "About Us: Partners",
    configType: "internal",
    pageType: "about-partners",
  }),
  "about-work-with-us": createOakPageConfig({
    pathPattern: "/about-us/work-with-us",
    analyticsPageName: "About Us: Work With Us",
    configType: "internal",
    pageType: "about-work-with-us",
  }),
  careers: createOakPageConfig({
    url: "https://app.beapplied.com/org/1574/oak-national-academy",
    analyticsPageName: "[external] Careers",
    configType: "external",
    pageType: "careers",
  }),
  contact: createOakPageConfig({
    pathPattern: "/contact-us",
    analyticsPageName: "Contact Us",
    configType: "internal",
    pageType: "contact",
  }),
  "develop-your-curriculum": createOakPageConfig({
    pathPattern: "/develop-your-curriculum",
    analyticsPageName: "Develop Your Curriculum",
    configType: "internal",
    pageType: "develop-your-curriculum",
  }),
  help: createOakPageConfig({
    url: "https://support.thenational.academy",
    analyticsPageName: "[external] Help",
    configType: "external",
    pageType: "help",
  }),
  home: createOakPageConfig({
    analyticsPageName: "Homepage",
    configType: "internal-custom-resolve",
    pageType: "home",
    matchHref: (href: string) => {
      switch (href) {
        case "/":
          return {
            path: "/",
            index: 0,
            params: { viewType: null },
          };
        case "/beta/teachers":
          return {
            path: "/beta/teachers",
            index: 0,
            params: { viewType: "teachers" },
          };
        default:
          return false;
      }
    },
    resolveHref: (props) =>
      props.viewType === null ? "/" : `/beta/${props.viewType}`,
  }),
  "lesson-planning": createOakPageConfig({
    pathPattern: "/lesson-planning",
    analyticsPageName: "Plan a Lesson",
    configType: "internal",
    pageType: "lesson-planning",
  }),
  legal: createOakPageConfig({
    pathPattern: "/legal/:legalSlug",
    analyticsPageName: "Legal",
    configType: "internal",
    pageType: "legal",
  }),
  classroom: createOakPageConfig({
    url: "https://classroom.thenational.academy",
    analyticsPageName: "[external] Classroom",
    configType: "external",
    pageType: "classroom",
  }),
  "support-your-team": createOakPageConfig({
    pathPattern: "/support-your-team",
    analyticsPageName: "Support Your Team",
    configType: "internal",
    pageType: "support-your-team",
  }),
  "our-teachers": createOakPageConfig({
    url: "https://classroom.thenational.academy/teachers",
    analyticsPageName: "[external] Our teachers",
    configType: "external",
    pageType: "our-teachers",
  }),
  "teacher-hub": createOakPageConfig({
    url: "https://teachers.thenational.academy",
    analyticsPageName: "[external] Teacher hub",
    configType: "external",
    pageType: "teacher-hub",
  }),
  "oak-curriculum": createOakPageConfig({
    url: "https://teachers.thenational.academy/oaks-curricula",
    analyticsPageName: "[external] Our curriculum",
    configType: "external",
    pageType: "oak-curriculum",
  }),
  "blog-index": createOakPageConfig({
    analyticsPageName: "Blog Listing",
    configType: "internal-custom-resolve",
    pageType: "blog-index",
    matchHref: postMatchHref("blog-index"),
    resolveHref: postResolveHref("blog-index"),
  }),
  "webinar-index": createOakPageConfig({
    analyticsPageName: "Webinar Listing",
    configType: "internal-custom-resolve",
    pageType: "webinar-index",
    matchHref: postMatchHref("webinar-index"),
    resolveHref: postResolveHref("webinar-index"),
  }),
  "unit-index": createOakPageConfig({
    pathPattern: "/beta/:viewType/programmes/:programmeSlug/units",
    analyticsPageName: "Unit Listing",
    configType: "internal",
    pageType: "unit-index",
  }),
  "lesson-index": createOakPageConfig({
    pathPattern:
      "/beta/:viewType/programmes/:programmeSlug/units/:unitSlug/lessons",
    analyticsPageName: "Lesson Listing",
    configType: "internal",
    pageType: "lesson-index",
  }),
  "lesson-overview": createOakPageConfig({
    pathPattern:
      "/beta/:viewType/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "lesson-overview",
  }),
  "lesson-downloads": createOakPageConfig({
    pathPattern:
      "/beta/:viewType/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/downloads",
    analyticsPageName: "Lesson Download",
    configType: "internal",
    pageType: "lesson-downloads",
  }),
  search: createOakPageConfig({
    pathPattern: "/beta/:viewType/search",
    analyticsPageName: "Search",
    configType: "internal",
    pageType: "search",
  }),
  "blog-single": createOakPageConfig({
    pathPattern: "/blog/:blogSlug",
    analyticsPageName: "Blog",
    configType: "internal",
    pageType: "blog-single",
  }),
  "webinar-single": createOakPageConfig({
    pathPattern: "/webinars/:webinarSlug",
    analyticsPageName: "Webinar",
    configType: "internal",
    pageType: "webinar-single",
  }),
  "landing-page": createOakPageConfig({
    pathPattern: "/lp/:lpSlug",
    analyticsPageName: "Landing Page",
    configType: "internal",
    pageType: "landing-page",
  }),
  "subject-index": createOakPageConfig({
    pathPattern: "/beta/:viewType/key-stages/:keyStageSlug/subjects",
    analyticsPageName: "Subject Listing",
    configType: "internal",
    pageType: "subject-index",
  }),
  "programme-index": createOakPageConfig({
    pathPattern:
      "/beta/:viewType/key-stages/:keyStageSlug/subjects/:subjectSlug/programmes",
    analyticsPageName: "Programme Listing",
    configType: "internal",
    pageType: "programme-index",
  }),
};

export type ResolveOakHrefProps = Exclude<
  Parameters<OakPages[keyof OakPages]["resolveHref"]>[number],
  void
>;

/**
 * This function will replace the :viewType param with "teachers-2023" if the
 * viewType from window.location.path is "teachers".
 */
function replaceViewType2023(path: string): string {
  console.log("replaceViewType2023", path);
  if (typeof window === "undefined") {
    return path;
  }
  const pathParts = path.split("/");
  const currentPathParts = window.location.pathname.split("/");
  const isIn2023Experience =
    currentPathParts[1] === "beta" && currentPathParts[2] === "teachers-2023";
  const [, beta, viewType] = pathParts;
  const linkIsBetaTeachers = beta === "beta" && viewType === "teachers";

  if (isIn2023Experience && linkIsBetaTeachers) {
    return ["/beta", "teachers-2023", ...pathParts.slice(3)].join("/");
  }

  return path;
}

/**
 * Pass readable props which are unlikely to need to change, and return an href.
 * @example
 * resolveOakHref({ page: "teacher-hub "})
 * resolveOakHref({ page: "pupils-lesson", lessonSlug: "spreadsheet-warm-up-75j64r" })
 * resolveOakHref({ page: "blog", blogSlug: "how-oak-helps-everyone" })
 */
export const resolveOakHref = (props: ResolveOakHrefProps): string => {
  console.log("resolveOakHref", props);
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const path = OAK_PAGES[props.page].resolveHref(props);

    const pathWithCorrectViewType = replaceViewType2023(path);
    console.log("pathWithCorrectViewType", pathWithCorrectViewType, path);
    return pathWithCorrectViewType;
  } catch (error) {
    const err = new OakError({
      code: "urls/failed-to-resolve",
      originalError: error,
      meta: props,
    });
    reportError(err);
    throw err;
  }
};
