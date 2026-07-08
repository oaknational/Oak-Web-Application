import {
  phaseDescriptions,
  phaseSlugs,
  subjects,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";
import z from "zod";
import { createStore } from "zustand";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import {
  DownloadResourceButtonNameValueType,
  ExamBoardValueType,
  KeyStageTitleValueType,
  LessonResourceDownloadStartedProperties,
  PathwayValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";

type ItemState = {
  slug: string;
  title: string;
};

export type ProgrammeState = {
  subject: {
    slug: z.infer<typeof subjectSlugs>;
    title: z.infer<typeof subjects>;
  };
  phase: {
    slug: z.infer<typeof phaseSlugs>;
    title: z.infer<typeof phaseDescriptions>;
  };
  year: ItemState; // TODO: use proper types for each value
  keystage: ItemState;
  tier: ItemState | null;
  examboard: ItemState | null;
  pathway: ItemState | null;
} & (
  | { browseLevel: "programme" }
  | { browseLevel: "unit"; unit: UnitState }
  | { browseLevel: "lesson"; unit: UnitState; lesson: LessonState }
);

export type UnitState = ItemState;

export type LessonState = ItemState & {
  lessonReleaseDate: string;
};

export type TeacherBrowseAnalyticsStore = {
  programmeState: ProgrammeState;
  track: TrackFns;
  actions: {
    lessonResourceDownloadStarted: (
      downloadResourceButtonName: DownloadResourceButtonNameValueType,
    ) => void;
  };
};

export const createTeacherBrowseAnalyticsStore = (
  initialState: Pick<TeacherBrowseAnalyticsStore, "programmeState" | "track">,
) => {
  return createStore<TeacherBrowseAnalyticsStore>()((_, get) => ({
    ...initialState,
    actions: {
      lessonResourceDownloadStarted: (
        downloadResourceButtonName: DownloadResourceButtonNameValueType,
      ) => {
        // Track year filter event
        const { track, programmeState } = get();

        if (programmeState.browseLevel !== "lesson") {
          throw new Error("Invalid browse level for event");
        }

        const pathwayData: Pick<
          LessonResourceDownloadStartedProperties,
          | "examBoard"
          | "keyStageSlug"
          | "keyStageTitle"
          | "lessonName"
          | "lessonSlug"
          | "lessonReleaseDate"
          | "pathway"
          | "subjectSlug"
          | "subjectTitle"
          | "tierName"
          | "unitName"
          | "unitSlug"
        > = {
          // TODO: remove casts
          examBoard: programmeState.examboard?.title as ExamBoardValueType,
          keyStageSlug: programmeState.keystage.slug,
          keyStageTitle: programmeState.keystage
            .title as KeyStageTitleValueType,
          lessonName: programmeState.lesson.title,
          lessonSlug: programmeState.lesson.slug,
          lessonReleaseDate: programmeState.lesson.lessonReleaseDate,
          pathway: programmeState.pathway?.title as PathwayValueType,
          subjectSlug: programmeState.subject.slug,
          subjectTitle: programmeState.subject.title,
          tierName: programmeState.tier?.title as TierNameValueType,
          unitName: programmeState.unit.title,
          unitSlug: programmeState.unit.slug,
        };

        track.lessonResourceDownloadStarted({
          platform: "owa",
          product: "teacher lesson resources",
          engagementIntent: "use",
          componentType: "lesson_download_button",
          eventVersion: "2.0.0",
          analyticsUseCase: "Teacher",
          downloadResourceButtonName,
          lessonReleaseCohort: "2023-2026",
          ...pathwayData,
        });
      },
    },
  }));
};
