import { match, compile, MatchFunction } from "path-to-regexp";

import createQueryStringFromObject, {
  UrlQueryObject,
} from "./createQueryStringFromObject";

import { PageNameValueType } from "@/browser-lib/avo/Avo";
import isBrowser from "@/utils/isBrowser";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { SearchQuery } from "@/context/Search/search.types";
import { SpecialistPreselectedType } from "@/node-lib/curriculum-api-2023/queries/specialistLessonShare/specialistLessonShare.schema";
import {
  PreselectedDownloadType,
  PreselectedShareType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";

const reportError = errorReporter("urls.ts");

/**
 * type pattern below is to allow any string value whilst offering autocomplete
 * on a union type specified. E.g. type A =  OrString<"foo" | "bar"> would
 * allow strings, but would autocomplete with "foo", "bar"
 */
type OrString<T extends string> = T | (string & Record<never, never>);

export type OakPageType = keyof OakPages;
export type OakHref = ReturnType<OakPages[OakPageType]["resolveHref"]>;

export type MaybeOakHref = OrString<OakHref>;
export type MaybeOakPageType = OrString<OakPageType>;

export type AnalyticsPageName = PageNameValueType | ExternalPageName;

const getCurrentHostname = () => {
  if (isBrowser) {
    return window.location.hostname;
  }
  return getBrowserConfig("clientAppBaseUrl");
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
  keyStageSlug: string;
  subjectSlug: string;
};

export type SpecialistProgrammeListingLinkProps = Omit<
  ProgrammeListingLinkProps,
  "page" | "keyStageSlug"
> & {
  page: "specialist-programme-index";
};

export type UnitListingLinkProps = {
  page: "unit-index";
  programmeSlug: string;
  search?: {
    ["learning-theme"]?: string | null;
  };
};

export type SpecialistUnitListingLinkProps = Omit<
  UnitListingLinkProps,
  "page"
> & {
  page: "specialist-unit-index";
};
export type KeyStageSubjectProgrammesLinkProps = {
  page: "key-stage-subject-programmes";
  keyStageSlug: string;
  subjectSlug: string;
};
export type LessonListingLinkProps = {
  page: "lesson-index";
  programmeSlug: string;
  unitSlug: string;
};
export type SpecialistLessonListingLinkProps = Omit<
  LessonListingLinkProps,
  "page"
> & {
  page: "specialist-lesson-index";
};

export type LessonOverviewLinkProps = {
  page: "lesson-overview";
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
};

export type TeachersHomePageProps = {
  page: "teachers-home-page";
};

export type PupilLessonLinkProps = {
  page: "pupil-lesson";
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
};

export type PupilLessonResultsLinkProps = {
  page: "pupil-lesson-results";
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  attemptId: string;
};

export type PupilLessonResultsCanonicalShareLinkProps = {
  page: "pupil-lesson-results-canonical-share";
  lessonSlug: string;
  attemptId: string;
};
export type PupilLessonResultsCanonicalPrintableLinkProps = {
  page: "pupil-lesson-results-canonical-printable";
  lessonSlug: string;
  attemptId: string;
};
export type PupilLessonListingLinkProps = {
  page: "pupil-lesson-index";
  programmeSlug: string;
  unitSlug: string;
};

export type PupilProgrammeListingLinkProps = {
  page: "pupil-programme-index";
  programmeSlug: string;
  optionSlug: string;
};

export type PupilUnitListingLinkProps = {
  page: "pupil-unit-index";
  programmeSlug: string;
};

export type PupilSubjectListingLinkProps = {
  page: "pupil-subject-index";
  yearSlug: string;
};

export type PupilYearListingLinkProps = {
  page: "pupil-year-index";
};

export type SpecialistLessonOverviewLinkProps = Omit<
  LessonOverviewLinkProps,
  "page"
> & {
  page: "specialist-lesson-overview";
};
type LessonOverviewCanonicalLinkProps = {
  page: "lesson-overview-canonical";
  lessonSlug: string;
};
export type LessonDownloadsLinkProps = {
  page: "lesson-downloads";
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  // @TODO remove this when auth is no longer behind a feature flag
  downloads: "downloads" | "downloads-auth";
  query?: {
    preselected: PreselectedDownloadType | null;
  };
};

export type SpecialistLessonDownloadsLinkProps = Omit<
  LessonDownloadsLinkProps,
  "page"
> & {
  page: "specialist-lesson-downloads";
};

export type LessonDownloadsCanonicalLinkProps = {
  page: "lesson-downloads-canonical";
  lessonSlug: string;
  // @TODO remove this when auth is no longer behind a feature flag
  downloads: "downloads" | "downloads-auth";
  query?: {
    preselected: PreselectedDownloadType | null;
  };
};

export type LessonMediaLinkProps = {
  page: "lesson-media";
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  query?: {
    video: string;
  };
};

export type LessonMediaCanonicalLinkProps = {
  page: "lesson-media-canonical";
  lessonSlug: string;
  query?: {
    video: string;
  };
};

export type LessonShareLinkProps = {
  page: "lesson-share";
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  query?: {
    preselected: PreselectedShareType | null;
  };
};

export type SpecialistLessonShareLinkProps = Omit<
  LessonDownloadsLinkProps,
  "page" | "query" | "downloads"
> & {
  page: "specialist-lesson-share";
  query?: {
    preselected: SpecialistPreselectedType | null;
  };
};

export type LessonShareCanonicalLinkProps = {
  page: "lesson-share-canonical";
  lessonSlug: string;
  query?: {
    preselected: PreselectedShareType | null;
  };
};
type SearchLinkProps = {
  page: "search";
  query?: Partial<SearchQuery>;
};
type LandingPageLinkProps = { page: "landing-page"; lpSlug: string };
type SubjectListingLinkProps = {
  page: "subject-index";
  keyStageSlug: string;
};

type SpecialistSubjectListingLinkProps = {
  page: "specialist-subject-index";
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
type HelpLinkProps = { page: "help" };
type HomeLinkProps = { page: "home" };
type LessonPlanningLinkProps = { page: "lesson-planning" };
type LegalLinkProps = {
  page: "legal";
  /**
   * The slug for legal pages comes from Sanity so should technically be a
   * string, but the assumption is that the slugs will not be changing from
   * their current values:
   */
  legalSlug: OrString<"privacy-policy" | "terms-and-conditions">;
};
type SupportYourTeamLinkProps = { page: "support-your-team" };
type OurTeachersLinkProps = { page: "our-teachers" };
type OakCurriculumLinkProps = { page: "oak-curriculum" };
type ClassroomLinkProps = { page: "classroom" };
type LabsLinkProps = { page: "labs" };
type TeacherHubLinkProps = { page: "teacher-hub" };
type CurriculumLandingPageLinkProps = {
  page: "curriculum-landing-page";
};

type CurriculumOverviewLinkProps = {
  page: "curriculum-overview";
  subjectPhaseSlug: string;
};
type CurriculumUnitsLinkProps = {
  page: "curriculum-units";
  subjectPhaseSlug: string;
};
type CurriculumDownloadsLinkProps = {
  page: "curriculum-downloads";
  subjectPhaseSlug: string;
};
type CurriculumPreviousDownloadsLinkProps = {
  page: "curriculum-previous-downloads";
  query?: {
    subject: string;
    keystage?: string;
  };
};

type OnboardingLinkProps = {
  page: "onboarding";
};

type OnboardingSchoolSelectionLinkProps = {
  page: "onboarding-school-selection";
};

type OnboardingRoleSelectionLinkProps = {
  page: "onboarding-role-selection";
};

type OnboardingUseOfOak = {
  page: "onboarding-use-of-oak";
};

type PupilLessonCanonical = {
  page: "pupil-lesson-canonical";
  lessonSlug: string;
};

export type OakLinkProps =
  | LabsLinkProps
  | SubjectListingLinkProps
  | TeachersHomePageProps
  | SpecialistSubjectListingLinkProps
  | LandingPageLinkProps
  | LessonDownloadsLinkProps
  | SpecialistLessonDownloadsLinkProps
  | LessonDownloadsCanonicalLinkProps
  | LessonMediaLinkProps
  | LessonMediaCanonicalLinkProps
  | LessonShareLinkProps
  | SpecialistLessonShareLinkProps
  | LessonShareCanonicalLinkProps
  | LessonOverviewLinkProps
  | PupilLessonLinkProps
  | PupilLessonResultsLinkProps
  | PupilLessonResultsCanonicalShareLinkProps
  | PupilLessonResultsCanonicalPrintableLinkProps
  | PupilLessonListingLinkProps
  | PupilUnitListingLinkProps
  | PupilSubjectListingLinkProps
  | PupilProgrammeListingLinkProps
  | PupilYearListingLinkProps
  | PupilUnitListingLinkProps
  | SpecialistLessonOverviewLinkProps
  | LessonOverviewCanonicalLinkProps
  | LessonListingLinkProps
  | SpecialistLessonListingLinkProps
  | UnitListingLinkProps
  | SpecialistUnitListingLinkProps
  | ProgrammeListingLinkProps
  | SpecialistProgrammeListingLinkProps
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
  | HomeLinkProps
  | LessonPlanningLinkProps
  | SupportYourTeamLinkProps
  | OurTeachersLinkProps
  | OakCurriculumLinkProps
  | ClassroomLinkProps
  | TeacherHubLinkProps
  | CurriculumLandingPageLinkProps
  | CurriculumOverviewLinkProps
  | CurriculumUnitsLinkProps
  | CurriculumDownloadsLinkProps
  | CurriculumPreviousDownloadsLinkProps
  | OnboardingLinkProps
  | OnboardingSchoolSelectionLinkProps
  | OnboardingRoleSelectionLinkProps
  | OnboardingUseOfOak
  | PupilLessonCanonical;

const EXTERNAL_PAGE_NAMES = [
  "[external] Careers",
  "[external] Help",
  "[external] Classroom",
  "[external] Labs",
  "[external] Our teachers",
  "[external] Teacher hub",
  "[external] Our curriculum",
] as const;
type ExternalPageName = (typeof EXTERNAL_PAGE_NAMES)[number];

type OakPages = {
  [K in OakLinkProps as K["page"]]: OakPageConfig<K>;
};

type OakPageConfig<
  ResolveHrefProps extends {
    page: string;
    query?: UrlQueryObject;
  },
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
      },
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
            { encode: encodeURIComponent },
          )(resolveHrefProps);
          /**
           * @todo consolidate these -> query
           */
          if ("search" in resolveHrefProps) {
            return `${path}?${createQueryStringFromObject(
              resolveHrefProps.search,
            )}`;
          }
          if ("query" in resolveHrefProps) {
            return `${path}?${createQueryStringFromObject(
              resolveHrefProps.query,
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
    postType: PostListingLinkProps["page"],
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
    postType: PostListingLinkProps["page"],
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
  help: createOakPageConfig({
    url: "https://support.thenational.academy",
    analyticsPageName: "[external] Help",
    configType: "external",
    pageType: "help",
  }),
  home: createOakPageConfig({
    pathPattern: "/",
    analyticsPageName: "Homepage",
    configType: "internal",
    pageType: "home",
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
  labs: createOakPageConfig({
    url: "https://labs.thenational.academy",
    analyticsPageName: "[external] Labs",
    configType: "external",
    pageType: "labs",
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
    pathPattern: "/teachers/programmes/:programmeSlug/units",
    analyticsPageName: "Unit Listing",
    configType: "internal",
    pageType: "unit-index",
  }),
  "specialist-unit-index": createOakPageConfig({
    pathPattern: "/teachers/specialist/programmes/:programmeSlug/units",
    analyticsPageName: "Unit Listing",
    configType: "internal",
    pageType: "specialist-unit-index",
  }),
  "lesson-index": createOakPageConfig({
    pathPattern: "/teachers/programmes/:programmeSlug/units/:unitSlug/lessons",
    analyticsPageName: "Lesson Listing",
    configType: "internal",
    pageType: "lesson-index",
  }),
  "specialist-lesson-index": createOakPageConfig({
    pathPattern:
      "/teachers/specialist/programmes/:programmeSlug/units/:unitSlug/lessons",
    analyticsPageName: "Lesson Listing",
    configType: "internal",
    pageType: "specialist-lesson-index",
  }),
  "lesson-overview": createOakPageConfig({
    pathPattern:
      "/teachers/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "lesson-overview",
  }),
  "pupil-lesson": createOakPageConfig({
    pathPattern:
      "/pupils/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "pupil-lesson",
  }),
  "pupil-lesson-results": createOakPageConfig({
    pathPattern:
      "/pupils/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/results/:attemptId",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "pupil-lesson-results",
  }),
  "pupil-lesson-results-canonical-share": createOakPageConfig({
    pathPattern: "/pupils/lessons/:lessonSlug/results/:attemptId/share",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "pupil-lesson-results-canonical-share",
  }),
  "pupil-lesson-results-canonical-printable": createOakPageConfig({
    pathPattern: "/pupils/lessons/:lessonSlug/results/:attemptId/printable",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "pupil-lesson-results-canonical-printable",
  }),
  "pupil-lesson-canonical": createOakPageConfig({
    pathPattern: "/pupils/lessons/:lessonSlug",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "pupil-lesson-canonical",
  }),
  "pupil-lesson-index": createOakPageConfig({
    pathPattern: "/pupils/programmes/:programmeSlug/units/:unitSlug/lessons",
    analyticsPageName: "Lesson Listing",
    configType: "internal",
    pageType: "pupil-lesson-index",
  }),
  "pupil-unit-index": createOakPageConfig({
    pathPattern: "/pupils/programmes/:programmeSlug/units",
    analyticsPageName: "Unit Listing",
    configType: "internal",
    pageType: "pupil-unit-index",
  }),
  "pupil-programme-index": createOakPageConfig({
    pathPattern: "/pupils/programmes/:programmeSlug/:optionSlug",
    analyticsPageName: "Programme Listing",
    configType: "internal",
    pageType: "pupil-programme-index",
  }),
  "pupil-subject-index": createOakPageConfig({
    pathPattern: "/pupils/years/:yearSlug/subjects",
    analyticsPageName: "Subject Listing",
    configType: "internal",
    pageType: "pupil-subject-index",
  }),
  "pupil-year-index": createOakPageConfig({
    pathPattern: "/pupils/years",
    analyticsPageName: "Subject Listing",
    configType: "internal",
    pageType: "pupil-year-index",
  }),
  "specialist-lesson-overview": createOakPageConfig({
    pathPattern:
      "/teachers/specialist/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "specialist-lesson-overview",
  }),
  "lesson-overview-canonical": createOakPageConfig({
    pathPattern: "/teachers/lessons/:lessonSlug",
    analyticsPageName: "Lesson",
    configType: "internal",
    pageType: "lesson-overview-canonical",
  }),
  "lesson-downloads": createOakPageConfig({
    // @TODO revert `:downloads` to `download` when auth is no longer behind a feature flag
    pathPattern:
      "/teachers/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/:downloads",
    analyticsPageName: "Lesson Download",
    configType: "internal",
    pageType: "lesson-downloads",
  }),
  "specialist-lesson-downloads": createOakPageConfig({
    // @TODO revert `:downloads` to `download` when auth is no longer behind a feature flag
    pathPattern:
      "/teachers/specialist/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/:downloads",
    analyticsPageName: "Lesson Download",
    configType: "internal",
    pageType: "specialist-lesson-downloads",
  }),
  "lesson-downloads-canonical": createOakPageConfig({
    // @TODO revert `:downloads` to `download` when auth is no longer behind a feature flag
    pathPattern: "/teachers/lessons/:lessonSlug/:downloads",
    analyticsPageName: "Lesson Download",
    configType: "internal",
    pageType: "lesson-downloads-canonical",
  }),
  "lesson-media": createOakPageConfig({
    pathPattern:
      "/teachers/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/media",
    analyticsPageName: "Lesson Media",
    configType: "internal",
    pageType: "lesson-media",
  }),
  "lesson-media-canonical": createOakPageConfig({
    pathPattern: "/teachers/lessons/:lessonSlug/media",
    analyticsPageName: "Lesson Media",
    configType: "internal",
    pageType: "lesson-media-canonical",
  }),
  "lesson-share": createOakPageConfig({
    pathPattern:
      "/teachers/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/share",
    analyticsPageName: "Lesson Share",
    configType: "internal",
    pageType: "lesson-share",
  }),
  "specialist-lesson-share": createOakPageConfig({
    pathPattern:
      "/teachers/specialist/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/share",
    analyticsPageName: "Lesson Share",
    configType: "internal",
    pageType: "specialist-lesson-share",
  }),
  "lesson-share-canonical": createOakPageConfig({
    pathPattern: "/teachers/lessons/:lessonSlug/share",
    analyticsPageName: "Lesson Share",
    configType: "internal",
    pageType: "lesson-share-canonical",
  }),
  search: createOakPageConfig({
    pathPattern: "/teachers/search",
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
    pathPattern: "/teachers/key-stages/:keyStageSlug/subjects",
    analyticsPageName: "Subject Listing",
    configType: "internal",
    pageType: "subject-index",
  }),
  "specialist-subject-index": createOakPageConfig({
    pathPattern: "/teachers/specialist/subjects",
    analyticsPageName: "Subject Listing",
    configType: "internal",
    pageType: "specialist-subject-index",
  }),
  "programme-index": createOakPageConfig({
    pathPattern:
      "/teachers/key-stages/:keyStageSlug/subjects/:subjectSlug/programmes",
    analyticsPageName: "Programme Listing",
    configType: "internal",
    pageType: "programme-index",
  }),
  "specialist-programme-index": createOakPageConfig({
    pathPattern: "/teachers/specialist/subjects/:subjectSlug/programmes",
    analyticsPageName: "Programme Listing",
    configType: "internal",
    pageType: "specialist-programme-index",
  }),
  "curriculum-landing-page": createOakPageConfig({
    pathPattern: "/teachers/curriculum",
    analyticsPageName: "Curriculum Landing Page",
    configType: "internal",
    pageType: "curriculum-landing-page",
  }),
  "curriculum-overview": createOakPageConfig({
    pathPattern: "/teachers/curriculum/:subjectPhaseSlug/overview",
    analyticsPageName: "Curriculum Overview",
    configType: "internal",
    pageType: "curriculum-overview",
  }),
  "curriculum-units": createOakPageConfig({
    pathPattern: "/teachers/curriculum/:subjectPhaseSlug/units",
    analyticsPageName: "Curriculum Unit Sequence",
    configType: "internal",
    pageType: "curriculum-units",
  }),
  "curriculum-downloads": createOakPageConfig({
    pathPattern: "/teachers/curriculum/:subjectPhaseSlug/downloads",
    analyticsPageName: "Curriculum Downloads",
    configType: "internal",
    pageType: "curriculum-downloads",
  }),
  "curriculum-previous-downloads": createOakPageConfig({
    pathPattern: "/teachers/curriculum/previous-downloads",
    analyticsPageName: "Curriculum Previous Downloads",
    configType: "internal",
    pageType: "curriculum-previous-downloads",
  }),
  onboarding: createOakPageConfig({
    pathPattern: "/onboarding",
    analyticsPageName: "Onboarding: Work In School",
    configType: "internal",
    pageType: "onboarding",
  }),
  "onboarding-school-selection": createOakPageConfig({
    pathPattern: "/onboarding/school-selection",
    analyticsPageName: "Onboarding: School Selection",
    configType: "internal",
    pageType: "onboarding-school-selection",
  }),
  "onboarding-role-selection": createOakPageConfig({
    pathPattern: "/onboarding/role-selection",
    analyticsPageName: "Onboarding: Role Selection",
    configType: "internal",
    pageType: "onboarding-role-selection",
  }),
  "onboarding-use-of-oak": createOakPageConfig({
    pathPattern: "/onboarding/how-can-oak-support-you",
    analyticsPageName: "Onboarding: Use Of Oak",
    configType: "internal",
    pageType: "onboarding-use-of-oak",
  }),
  "teachers-home-page": createOakPageConfig({
    pathPattern: "/teachers",
    analyticsPageName: "Homepage",
    configType: "internal",
    pageType: "teachers-home-page",
  }),
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
 * resolveOakHref({ page: "blog", blogSlug: "how-oak-helps-everyone" })
 */
export const resolveOakHref = (props: ResolveOakHrefProps): string => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const path = OAK_PAGES[props.page].resolveHref(props);
    return path;
  } catch (error) {
    const err = new OakError({
      code: "urls/failed-to-resolve",
      originalError: error,
      meta: props,
    });
    reportError(err);

    return "/";
  }
};
