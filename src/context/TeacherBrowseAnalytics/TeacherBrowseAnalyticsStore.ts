import { createStore } from "zustand";
import { capitalize } from "lodash";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import { ProgrammeState } from "./teacherBrowseAnalytics.types";
import {
  getLessonAnalyticsProperties,
  getProgrammeAnalyticsProperties,
  getUnitAnalyticsProperties,
} from "./utils/getAnalyticsProperties";

import {
  AccessLevelValueType,
  AnalyticsUseCaseValueType,
  ComponentType,
  DownloadResourceButtonNameValueType,
  EngagementIntent,
  EventVersionValueType,
  LearningTierValueType,
  MediaClipsButtonNameValueType,
  PlatformValueType,
  ProductValueType,
  ResourceTypeValueType,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import OakError, { ErrorMeta } from "@/errors/OakError";
import { Thread, Unit } from "@/utils/curriculum/types";
import { buildUnitOverviewAccessedAnalytics } from "@/utils/curriculum/analytics";
import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import {
  getSchoolOption,
  getSchoolName,
  getSchoolUrn,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { convertUnitSlugToTitle } from "@/app/(core)/teachers/search/helpers";

export type TeacherBrowseAnalyticsStore = {
  programmeState: ProgrammeState;
  journeyId: string | null;
  avo: TrackFns;
  track: {
    lessonResourceDownloadStarted: (
      downloadResourceButtonName: DownloadResourceButtonNameValueType,
    ) => void;
    unitDownloaded: (accessLevel: AccessLevelValueType) => void;
    curriculumExplainerExplored: () => void;
    unitOverviewAccessed: (
      unit: Unit,
      isHighlighted: boolean,
      selectedThread: Thread | undefined,
    ) => void;
    curriculumResourcesDownloadRefined: (data: {
      tierSlug?: string | null;
      childSubjectSlug?: string | null;
    }) => void;
    curriculumResourcesDownloaded: (data: ResourceFormValues) => void;
    lessonMediaClipsStarted: (data: {
      mediaClipsButtonName: MediaClipsButtonNameValueType;
      learningCycle: string | null;
    }) => void;
  };
};

const coreProperties: {
  platform: PlatformValueType;
  product: ProductValueType;
  eventVersion: EventVersionValueType;
  analyticsUseCase: AnalyticsUseCaseValueType;
} = {
  platform: "owa",
  product: "teacher lesson resources",
  eventVersion: "2.0.0",
  analyticsUseCase: "Teacher",
};

const reportError = errorReporter("teacher-browse-analytics");

type AnalyticsErrorMeta = ErrorMeta & {
  event: keyof TeacherBrowseAnalyticsStore["track"];
  programmeState: ProgrammeState;
};

/**
 * Report a tracking problem, tagged with the event and the browse level it
 * was fired from.
 */
const reportAnalyticsError = ({
  event,
  programmeState,
  ...meta
}: AnalyticsErrorMeta) => {
  reportError(
    new OakError({
      code: "analytics/teacher-browse",
      meta: {
        event,
        browseLevel: programmeState.browseLevel,
        ...meta,
      },
    }),
  );
};

/**
 * A journeyId should always be present, but the event is still worth sending
 * without one, so report the error and fall back to an empty string.
 */
const resolveJourneyId = (
  journeyId: string | null,
  errorMeta: AnalyticsErrorMeta,
): string => {
  if (!journeyId) {
    reportAnalyticsError(errorMeta);
    return "";
  }
  return journeyId;
};

export const createTeacherBrowseAnalyticsStore = (
  initialState: Pick<
    TeacherBrowseAnalyticsStore,
    "programmeState" | "avo" | "journeyId"
  >,
) => {
  return createStore<TeacherBrowseAnalyticsStore>()((_, get) => ({
    ...initialState,
    track: {
      lessonResourceDownloadStarted: (
        downloadResourceButtonName: DownloadResourceButtonNameValueType,
      ) => {
        const { avo, programmeState } = get();

        // Lesson properties are unavailable at other browse levels, so the
        // event can't be sent
        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "lessonResourceDownloadStarted",
            programmeState,
            downloadResourceButtonName,
          });
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

        avo.lessonResourceDownloadStarted({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.LESSON_DOWNLOAD_BUTTON,
          downloadResourceButtonName,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      unitDownloaded: (accessLevel) => {
        const { avo, programmeState, journeyId } = get();

        // Can be tracked from the unit overview page or the lesson download success page
        if (programmeState.browseLevel === "programme") {
          reportAnalyticsError({ event: "unitDownloaded", programmeState });
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(programmeState);

        avo.unitDownloaded({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.UNIT_DOWNLOAD_BUTTON,
          journeyId: resolveJourneyId(journeyId, {
            event: "unitDownloaded",
            programmeState,
          }),
          accessLevel,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      unitOverviewAccessed: (unit, isHighlighted, selectedThread) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "unit") {
          reportAnalyticsError({
            event: "unitOverviewAccessed",
            programmeState,
            unitSlug: unit.slug,
          });
          return;
        }

        const analyticsProperties = buildUnitOverviewAccessedAnalytics({
          unit,
          isHighlighted,
          componentType: "unit_info_button",
          selectedThread,
          analyticsUseCase: "Teacher",
          journeyId: resolveJourneyId(journeyId, {
            event: "unitOverviewAccessed",
            programmeState,
            unitSlug: unit.slug,
          }),
          accessLevel: "unit",
          navigationType: "across",
        });

        avo.unitOverviewAccessed(analyticsProperties);
      },
      curriculumExplainerExplored: () => {
        const { avo, programmeState } = get();

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

        avo.curriculumExplainerExplored({
          engagementIntent: "explore",
          componentType: "explainer_tab",
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      curriculumResourcesDownloadRefined: (data) => {
        const { avo, programmeState } = get();
        const { tierSlug, childSubjectSlug } = data;

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

        avo.curriculumResourcesDownloadRefined({
          ...coreProperties,
          ...analyticsProperties,
          engagementIntent: "refine",
          componentType: "download_tab",
          childSubjectSlug: childSubjectSlug || "",
          childSubjectName: convertUnitSlugToTitle(childSubjectSlug || ""),
          learningTier: capitalize(tierSlug || "") as LearningTierValueType,
        });
      },
      curriculumResourcesDownloaded: (data: ResourceFormValues) => {
        const { avo, programmeState } = get();

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

        const schoolOption = getSchoolOption(data.school);

        avo.curriculumResourcesDownloaded({
          ...coreProperties,
          ...analyticsProperties,
          engagementIntent: "explore",
          componentType: "download_button",
          emailSupplied: data.email != null,
          resourceType: ["curriculum document"] as ResourceTypeValueType[],
          schoolOption,
          schoolName: getSchoolName(data.school, schoolOption),
          schoolUrn: getSchoolUrn(data.school, schoolOption),
          keyStageSlug: null,
          keyStageTitle: null,
        });
      },
      lessonMediaClipsStarted: (data) => {
        const { avo, programmeState } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: {
                event: "lessonMediaClipsStarted",
                browseLevel: programmeState.browseLevel,
              },
            }),
          );
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

        avo.lessonMediaClipsStarted({
          ...coreProperties,
          ...analyticsProperties,
          ...data,
          engagementIntent: "use",
          componentType: "go_to_media_clips_page_button",
        });
      },
    },
  }));
};
