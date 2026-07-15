import { createStore } from "zustand";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import { ProgrammeState } from "./teacherBrowseAnalytics.types";
import {
  getLessonAnalyticsProperties,
  getUnitAnalyticsProperties,
} from "./utils/getAnalyticsProperties";

import {
  AnalyticsUseCaseValueType,
  ComponentType,
  DownloadResourceButtonNameValueType,
  EngagementIntent,
  EventVersionValueType,
  PlatformValueType,
  ProductValueType,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

export type TeacherBrowseAnalyticsStore = {
  programmeState: ProgrammeState;
  journeyId: string | null;
  avo: TrackFns;
  track: {
    lessonResourceDownloadStarted: (
      downloadResourceButtonName: DownloadResourceButtonNameValueType,
    ) => void;
    unitDownloadInitiated: () => void;
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
    },
  }));
};
