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
  AnalyticsUseCaseValueType,
  ComponentType,
  DownloadResourceButtonNameValueType,
  EngagementIntent,
  EventVersionValueType,
  LearningTierValueType,
  PlatformValueType,
  ProductValueType,
  ResourceTypeValueType,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
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
    unitDownloadInitiated: () => void;
    curriculumExplainerExplored: () => void;
    curriculumResourcesDownloadRefined: (data: {
      tierSlug?: string | null;
      childSubjectSlug?: string | null;
    }) => void;
    curriculumResourcesDownloaded: (data: ResourceFormValues) => void;
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

        if (programmeState.browseLevel !== "lesson") {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: {
                event: "lessonResourceDownloadStarted",
                browseLevel: programmeState.browseLevel,
                downloadResourceButtonName,
              },
            }),
          );
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

        avo.lessonResourceDownloadStarted({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.LESSON_DOWNLOAD_BUTTON,
          downloadResourceButtonName,
          lessonReleaseCohort: "2023-2026",
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      unitDownloadInitiated: () => {
        const { avo, programmeState } = get();

        // Can be tracked from the unit overview page or the lesson download success page
        if (programmeState.browseLevel === "programme") {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: {
                event: "unitDownloadInitiated",
                browseLevel: programmeState.browseLevel,
              },
            }),
          );
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(programmeState);

        avo.unitDownloadInitiated({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.UNIT_DOWNLOAD_BUTTON,
          ...coreProperties,
          ...analyticsProperties,
        });
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
    },
  }));
};
