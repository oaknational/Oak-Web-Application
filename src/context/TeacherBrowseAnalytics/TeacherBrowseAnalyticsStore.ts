import { createStore } from "zustand";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import { ProgrammeState } from "./teacherBrowseAnalytics.types";
import { getLessonAnalyticsProperties } from "./helpers";

import {
  AnalyticsUseCaseValueType,
  DownloadResourceButtonNameValueType,
  EventVersionValueType,
  PlatformValueType,
  ProductValueType,
} from "@/browser-lib/avo/Avo";

export type TeacherBrowseAnalyticsStore = {
  programmeState: ProgrammeState;
  track: TrackFns;
  actions: {
    trackLessonResourceDownloadStarted: (
      downloadResourceButtonName: DownloadResourceButtonNameValueType,
    ) => void;
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
          // TODO: error handling
          throw new Error("Invalid browse level for event");
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

        track.lessonResourceDownloadStarted({
          engagementIntent: "use",
          componentType: "lesson_download_button",
          downloadResourceButtonName,
          lessonReleaseCohort: "2023-2026",
          ...coreProperties,
          ...analyticsProperties,
        });
      },
    },
  }));
};
