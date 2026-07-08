import { createStore } from "zustand";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import { ProgrammeState } from "./teacherBrowseAnalytics.types";
import {
  getLessonAnalyticsProperties,
  getUnitAnalyticsProperties,
} from "./helpers";

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
  track: TrackFns;
  actions: {
    trackLessonResourceDownloadStarted: (
      downloadResourceButtonName: DownloadResourceButtonNameValueType,
    ) => void;
    trackUnitDownloadInitiated: () => void;
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
  initialState: Pick<TeacherBrowseAnalyticsStore, "programmeState" | "track">,
) => {
  return createStore<TeacherBrowseAnalyticsStore>()((_, get) => ({
    ...initialState,
    actions: {
      trackLessonResourceDownloadStarted: (
        downloadResourceButtonName: DownloadResourceButtonNameValueType,
      ) => {
        const { track, programmeState } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: { event: "lessonResourceDownloadStarted" },
            }),
          );
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

        track.lessonResourceDownloadStarted({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.LESSON_DOWNLOAD_BUTTON,
          downloadResourceButtonName,
          lessonReleaseCohort: "2023-2026",
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      trackUnitDownloadInitiated: () => {
        const { track, programmeState } = get();

        if (programmeState.browseLevel === "programme") {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: { event: "unitDownloadInitiated" },
            }),
          );
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(programmeState);

        track.unitDownloadInitiated({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.UNIT_DOWNLOAD_BUTTON,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
    },
  }));
};
