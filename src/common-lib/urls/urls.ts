import { PageNameValueType } from "../../browser-lib/avo/Avo";
import { ExpandingContainerTitle } from "../../components/ExpandingContainer/ExpandingContainer";
import config from "../../config/browser";
import { SearchQuery } from "../../context/Search/useSearch";
import isBrowser from "../../utils/isBrowser";
import errorReporter from "../error-reporter";

import createQueryStringFromObject from "./createQueryStringFromObject";

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

// /teachers/ or /pupils/
type ViewType = "teachers";

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
  category?: string | null;
  search?: {
    page?: string;
  };
};
export type WebinarListingLinkProps = {
  page: "webinar-index";
  category?: string | null;
  search?: {
    page?: string;
  };
};
export type TierSelectionLinkProps = {
  page: "tier-selection";
  viewType?: ViewType;
  keyStage: string;
  subject: string;
};
export type UnitIndexLinkProps = {
  page: "unit-index";
  viewType?: ViewType;
  keyStage: string;
  subject: string;
  search?: {
    ["learning-theme"]?: string | null;
    ["tier"]?: string | null;
  };
};
export type LessonIndexLinkProps = {
  page: "lesson-index";
  viewType?: ViewType;
  keyStage: string;
  subject: string;
  slug: string;
};
export type LessonOverviewLinkProps = {
  page: "lesson-overview";
  viewType?: ViewType;
  keyStage: string;
  subject: string;
  unit: string;
  slug: string;
};
type LessonDownloadsLinkProps = {
  page: "lesson-downloads";
  viewType?: ViewType;
  keyStageSlug: string;
  subjectSlug: string;
  unitSlug: string;
  slug: string;
  query?: {
    preselected: ExpandingContainerTitle | "all";
  };
};
type SearchLinkProps = {
  page: "search";
  viewType?: ViewType;
  query?: Partial<SearchQuery>;
};
type LandingPageLinkProps = { page: "landing-page"; slug: string };
type SubjectListingLinkProps = {
  page: "subject-index";
  viewType?: ViewType;
  slug: string;
};
type WebinarSingleLinkProps = { page: "webinar-single"; slug: string };
type BlogSingleLinkProps = { page: "blog-single"; slug: string };
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
  slug: "privacy-policy" | "terms-and-conditions" | OrString;
};
type SupportYourTeamLinkProps = { page: "support-your-team" };
type OurTeachersLinkProps = { page: "our-teachers" };
type OakCurriculumLinkProps = { page: "oak-curriculum" };
type ClassroomLinkProps = { page: "classroom" };
type TeacherHubLinkProps = { page: "teacher-hub" };

type ExternalPageName =
  | "[external] Careers"
  | "[external] Help"
  | "[external] Classroom"
  | "[external] Our teachers"
  | "[external] Teacher hub"
  | "[external] Our curriculum";
type OakPageConfig<ResolveHrefProps extends { page: string }> = {
  analyticsPageName: PageNameValueType | ExternalPageName;
  pageType: ResolveHrefProps["page"];
  resolveHref: (props: ResolveHrefProps) => string;
};
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
  "tier-selection": OakPageConfig<TierSelectionLinkProps>;
  "unit-index": OakPageConfig<UnitIndexLinkProps>;
  "lesson-index": OakPageConfig<LessonIndexLinkProps>;
  "lesson-overview": OakPageConfig<LessonOverviewLinkProps>;
  "lesson-downloads": OakPageConfig<LessonDownloadsLinkProps>;
  search: OakPageConfig<SearchLinkProps>;
  "landing-page": OakPageConfig<LandingPageLinkProps>;
  "subject-index": OakPageConfig<SubjectListingLinkProps>;
  "webinar-single": OakPageConfig<WebinarSingleLinkProps>;
  "blog-single": OakPageConfig<BlogSingleLinkProps>;
};

const OAK_PAGES: {
  [K in keyof OakPages]: OakPages[K] & { pageType: K };
} = {
  "about-board": {
    analyticsPageName: "About Us: Board",
    pageType: "about-board",
    resolveHref: () => "/about-us/board",
  },
  "about-who-we-are": {
    analyticsPageName: "About Us: Who We Are",
    pageType: "about-who-we-are",
    resolveHref: () => "/about-us/who-we-are",
  },
  "about-leadership": {
    analyticsPageName: "About Us: Leadership",
    pageType: "about-leadership",
    resolveHref: () => "/about-us/leadership",
  },
  "about-partners": {
    analyticsPageName: "About Us: Partners",
    pageType: "about-partners",
    resolveHref: () => "/about-us/partners",
  },
  "about-work-with-us": {
    analyticsPageName: "About Us: Work With Us",
    pageType: "about-work-with-us",
    resolveHref: () => "/about-us/work-with-us",
  },
  careers: {
    analyticsPageName: "[external] Careers",
    pageType: "careers",
    resolveHref: () =>
      "https://app.beapplied.com/org/1574/oak-national-academy",
  },
  contact: {
    analyticsPageName: "Contact Us",
    pageType: "contact",
    resolveHref: () => "/contact-us",
  },
  "develop-your-curriculum": {
    analyticsPageName: "Develop Your Curriculum",
    pageType: "develop-your-curriculum",
    resolveHref: () => "/develop-your-curriculum",
  },
  help: {
    analyticsPageName: "[external] Help",
    pageType: "help",
    resolveHref: () => "https://support.thenational.academy",
  },
  home: {
    analyticsPageName: "Homepage",
    pageType: "home",
    resolveHref: (props) =>
      props.viewType === null ? "/" : `/beta/${props.viewType || "teachers"}`,
  },
  "lesson-planning": {
    analyticsPageName: "Plan a Lesson",
    pageType: "lesson-planning",
    resolveHref: () => "/lesson-planning",
  },
  legal: {
    analyticsPageName: "Legal",
    pageType: "legal",
    resolveHref: (props) => `/legal/${props.slug}`,
  },
  classroom: {
    analyticsPageName: "[external] Classroom",
    pageType: "classroom",
    resolveHref: () => "https://classroom.thenational.academy",
  },
  "support-your-team": {
    analyticsPageName: "Support Your Team",
    pageType: "support-your-team",
    resolveHref: () => "/support-your-team",
  },
  "our-teachers": {
    analyticsPageName: "[external] Our teachers",
    pageType: "our-teachers",
    resolveHref: () => "https://classroom.thenational.academy/teachers",
  },
  "teacher-hub": {
    analyticsPageName: "[external] Teacher hub",
    pageType: "teacher-hub",
    resolveHref: () => "https://teachers.thenational.academy",
  },
  "oak-curriculum": {
    analyticsPageName: "[external] Our curriculum",
    pageType: "oak-curriculum",
    resolveHref: () => "https://teachers.thenational.academy/oaks-curricula",
  },
  "blog-index": {
    analyticsPageName: "Blog Listing",
    pageType: "blog-index",
    resolveHref: (props) => {
      let path = "/blog";
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
    },
  },
  "webinar-index": {
    analyticsPageName: "Webinar Listing",
    pageType: "webinar-index",
    resolveHref: (props) => {
      let path = "/webinars";
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
    },
  },
  "tier-selection": {
    analyticsPageName: "Programme Listing",
    pageType: "tier-selection",
    resolveHref: (props) =>
      `/beta/${props.viewType || "teachers"}/key-stages/${
        props.keyStage
      }/subjects/${props.subject}/units`,
  },
  "unit-index": {
    analyticsPageName: "Unit Listing",
    pageType: "unit-index",
    resolveHref: (props) => {
      const path = `/beta/${props.viewType || "teachers"}/key-stages/${
        props.keyStage
      }/subjects/${props.subject}/units`;
      if (!props.search) {
        return path;
      }

      const queryString = createQueryStringFromObject(props.search);

      if (!queryString) {
        return path;
      }

      return `${path}?${queryString}`;
    },
  },
  "lesson-index": {
    analyticsPageName: "Lesson Listing",
    pageType: "lesson-index",
    resolveHref: (props) =>
      `/beta/${props.viewType || "teachers"}/key-stages/${
        props.keyStage
      }/subjects/${props.subject}/units/${props.slug}`,
  },
  "lesson-overview": {
    analyticsPageName: "Lesson",
    pageType: "lesson-overview",
    resolveHref: (props) =>
      `/beta/${props.viewType || "teachers"}/key-stages/${
        props.keyStage
      }/subjects/${props.subject}/units/${props.unit}/lessons/${props.slug}`,
  },
  "lesson-downloads": {
    analyticsPageName: "Lesson Download",
    pageType: "lesson-downloads",
    resolveHref: (props) => {
      let path = `/beta/${props.viewType || "teachers"}/key-stages/${
        props.keyStageSlug
      }/subjects/${props.subjectSlug}/units/${props.unitSlug}/lessons/${
        props.slug
      }/downloads`;
      if (props.query) {
        const queryString = createQueryStringFromObject(props.query);
        path += `?${queryString.toLowerCase()}`;
      }
      return path;
    },
  },
  search: {
    analyticsPageName: "Search",
    pageType: "search",
    resolveHref: (props) => {
      const path = `/beta/${props.viewType || "teachers"}/search`;
      if (!props.query) {
        return path;
      }
      const queryString = createQueryStringFromObject(props.query);

      return `${path}?${queryString}`;
    },
  },
  "blog-single": {
    analyticsPageName: "Blog",
    pageType: "blog-single",
    resolveHref: (props) => `/blog/${props.slug}`,
  },
  "webinar-single": {
    analyticsPageName: "Webinar",
    pageType: "webinar-single",
    resolveHref: (props) => `/webinars/${props.slug}`,
  },
  "landing-page": {
    analyticsPageName: "Landing Page",
    pageType: "landing-page",
    resolveHref: (props) => `/lp/${props.slug}`,
  },
  "subject-index": {
    analyticsPageName: "Subject Listing",
    pageType: "subject-index",
    resolveHref: (props) => `/key-stages/${props.slug}/subjects`,
  },
};

export type ResolveOakHrefProps = Exclude<
  Parameters<OakPages[keyof OakPages]["resolveHref"]>[number],
  void
>;

/**
 * Pass readable props which are unlikely to need to change, and return an href.
 * @example
 * resolveOakHref({ page: "teacher-hub "})
 * resolveOakHref({ page: "pupils-lesson", lessonSlug: "spreadsheet-warm-up-75j64r" })
 * resolveOakHref({ page: "blog", slug: "how-oak-helps-everyone" })
 */
export const resolveOakHref = (props: ResolveOakHrefProps): string => {
  return (
    OAK_PAGES[props.page]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .resolveHref(props)
  );
};
