import { createContext } from "react";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  AnalyticsUseCaseValueType,
  KeyStageTitleValueType,
  PhaseValueType,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

/**
 * This file is used to wrap the track function from the analytics context
 * and only expose the functions that are relevant to the pupil experience.
 * It ensures that we keep all of our tracking events in one neat little file.
 *
 * You can find the source code for the tracking events in src/browser-lib/avo/Avo.ts
 *
 */

type NavigationEventProps =
  | "unitName"
  | "unitSlug"
  | "lessonSlug"
  | "lessonName"
  | "keyStageSlug"
  | "keyStageTitle"
  | "subjectTitle"
  | "subjectSlug"
  | "yearGroupName"
  | "yearGroupSlug"
  | "phase"
  | "tierName"
  | "examBoard"
  | "releaseGroup"
  | "analyticsUseCase";

type DefaultVideoProps =
  | "videoTitle"
  | "numberOfVideos"
  | "videoSlug"
  | "isCaptioned"
  | "videoPlaybackId"
  | "signedAvailable";

type DefaultAudioProps =
  | "audioTitle"
  | "numberOfAudios"
  | "audioSlug"
  | "audioPlaybackId"
  | "isCaptioned";

export const trackingEvents = [
  "lessonStarted",
  "lessonCompleted",
  "lessonActivityCompleted",
  "lessonActivityCompletedIntroduction",
  "lessonActivityCompletedStarterQuiz",
  "lessonActivityCompletedLessonVideo",
  "lessonActivityCompletedExitQuiz",
  "lessonActivityCompletedLessonAudio",
  "lessonActivityStarted",
  "lessonActivityStartedIntroduction",
  "lessonActivityStartedStarterQuiz",
  "lessonActivityStartedLessonVideo",
  "lessonActivityStartedExitQuiz",
  "lessonActivityStartedLessonAudio",
  "lessonActivityAbandoned",
  "lessonActivityAbandonedStarterQuiz",
  "lessonActivityAbandonedIntroduction",
  "lessonActivityAbandonedLessonVideo",
  "lessonActivityAbandonedExitQuiz",
  "lessonActivityAbandonedLessonAudio",
  "lessonActivityDownloaded",
  "lessonActivityDownloadedWorksheet",
  "contentGuidanceAccepted",
  "contentGuidanceDeclined",
  "activityResultsShared",
  "activityResultsSharedStarterQuiz",
  "activityResultsSharedExitQuiz",
  "lessonSummaryReviewed",
  "lessonAccessed",
] as const;

export type PupilAnalyticsEvents = (typeof trackingEvents)[number];

export type PupilAnalyticsTrack = {
  [eventName in PupilAnalyticsEvents]: (
    props: Omit<
      Parameters<TrackFns[eventName]>[0],
      NavigationEventProps | DefaultVideoProps | DefaultAudioProps
    >,
  ) => void;
};

export const pupilAnalyticsContext = createContext<{
  track: PupilAnalyticsTrack;
} | null>(null);

export type PupilPathwayData = {
  unitName: string;
  unitSlug: string;
  lessonSlug: string;
  lessonName: string;
  keyStageSlug: string;
  keyStageTitle: KeyStageTitleValueType;
  subjectTitle: string;
  subjectSlug: string;
  yearGroupName: string;
  yearGroupSlug: string;
  phase: PhaseValueType;
  tierName: string | null | undefined;
  examBoard: string | null | undefined;
  releaseGroup: string;
};

export type PupilVideoData = {
  videoTitle: string;
  numberOfVideos: number;
  videoSlug: string[];
  isCaptioned: boolean;
  videoPlaybackId: string[];
  signedAvailable: boolean;
};

export type PupilAudioData = {
  audioTitle: string;
  numberOfAudios: string;
  audioSlug: string[];
  audioPlaybackId: string[];
  isCaptioned: boolean;
  signedAvailable: boolean;
};

export type AdditionalArgType = PupilPathwayData & {
  analyticsUseCase: AnalyticsUseCaseValueType;
};

export const PupilAnalyticsProvider = ({
  children,
  pupilPathwayData,
  pupilVideoData,
  pupilAudioData,
}: {
  children: React.ReactNode;
  pupilPathwayData: PupilPathwayData;
  pupilVideoData: PupilVideoData;
  pupilAudioData: PupilAudioData;
}) => {
  const { track } = useAnalytics();

  const additionalArgs: AdditionalArgType = {
    ...pupilPathwayData,
    analyticsUseCase: "Pupil",
  };

  const defaultVideoArgs: PupilVideoData = {
    ...pupilVideoData,
  };
  const defaultAudioArgs: PupilAudioData = {
    ...pupilAudioData,
  };

  const pupilTrack: PupilAnalyticsTrack = {
    lessonCompleted: (args) =>
      track.lessonCompleted({
        ...args,
        ...additionalArgs,
      }),
    lessonActivityCompleted: (args) =>
      track.lessonActivityCompleted({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityCompletedIntroduction: (args) =>
      track.lessonActivityCompletedIntroduction({
        ...args,
        ...additionalArgs,
      }),
    lessonActivityCompletedStarterQuiz: (args) =>
      track.lessonActivityCompletedStarterQuiz({
        ...args,
        ...additionalArgs,
      }),
    lessonActivityCompletedLessonVideo: (args) =>
      track.lessonActivityCompletedLessonVideo({
        ...args,
        ...additionalArgs,
        ...defaultVideoArgs,
      }),
    lessonActivityCompletedExitQuiz: (args) =>
      track.lessonActivityCompletedExitQuiz({
        ...args,
        ...additionalArgs,
      }),
    lessonActivityCompletedLessonAudio: (args) =>
      track.lessonActivityCompletedLessonAudio({
        ...args,
        ...additionalArgs,
        ...defaultAudioArgs,
      }),
    lessonActivityStarted: (args) =>
      track.lessonActivityStarted({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityStartedIntroduction: (args) =>
      track.lessonActivityStartedIntroduction({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityStartedStarterQuiz: (args) =>
      track.lessonActivityStartedStarterQuiz({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityStartedLessonVideo: (args) =>
      track.lessonActivityStartedLessonVideo({
        ...additionalArgs,
        ...defaultVideoArgs,
        ...args,
      }),
    lessonActivityStartedExitQuiz: (args) =>
      track.lessonActivityStartedExitQuiz({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityStartedLessonAudio: (args) =>
      track.lessonActivityStartedLessonAudio({
        ...additionalArgs,
        ...args,
        ...defaultAudioArgs,
      }),

    lessonActivityAbandoned: (args) =>
      track.lessonActivityAbandoned({
        ...additionalArgs,
        ...args,
        ...defaultVideoArgs,
      }),
    lessonActivityAbandonedStarterQuiz: (args) =>
      track.lessonActivityAbandonedStarterQuiz({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityAbandonedIntroduction: (args) =>
      track.lessonActivityAbandonedIntroduction({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityAbandonedLessonVideo: (args) =>
      track.lessonActivityAbandonedLessonVideo({
        ...additionalArgs,
        ...defaultVideoArgs,
        ...args,
      }),
    lessonActivityAbandonedExitQuiz: (args) =>
      track.lessonActivityAbandonedExitQuiz({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityAbandonedLessonAudio: (args) =>
      track.lessonActivityAbandonedLessonAudio({
        ...additionalArgs,
        ...args,
        ...defaultAudioArgs,
      }),
    lessonActivityDownloaded: (args) =>
      track.lessonActivityDownloaded({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityDownloadedWorksheet: (args) =>
      track.lessonActivityDownloadedWorksheet({
        ...additionalArgs,
        ...args,
      }),
    contentGuidanceAccepted: (args) =>
      track.contentGuidanceAccepted({
        ...additionalArgs,
        ...args,
      }),
    contentGuidanceDeclined: (args) =>
      track.contentGuidanceDeclined({
        ...additionalArgs,
        ...args,
      }),
    activityResultsShared: (args) =>
      track.activityResultsShared({
        ...additionalArgs,
        ...args,
      }),
    activityResultsSharedStarterQuiz: (args) =>
      track.activityResultsSharedStarterQuiz({
        ...additionalArgs,
        ...args,
      }),
    activityResultsSharedExitQuiz: (args) =>
      track.activityResultsSharedExitQuiz({
        ...additionalArgs,
        ...args,
      }),
    lessonSummaryReviewed: (args) =>
      track.lessonSummaryReviewed({
        ...additionalArgs,
        ...defaultVideoArgs,
        ...defaultAudioArgs,
        ...args,
      }),
    lessonAccessed: (args) =>
      track.lessonAccessed({
        ...additionalArgs,
        ...args,
      }),
    lessonStarted: (args) =>
      track.lessonStarted({
        ...additionalArgs,
        ...args,
      }),
  };

  return (
    <pupilAnalyticsContext.Provider value={{ track: pupilTrack }}>
      {children}
    </pupilAnalyticsContext.Provider>
  );
};

export const getPupilPathwayData = (
  browseData: LessonBrowseData,
): PupilPathwayData => {
  const k = browseData.programmeFields.keystageDescription.replace(
    "Stage",
    "stage",
  );

  const keyStageTitle = k as KeyStageTitleValueType;

  if (!keyStageTitle) {
    console.error("Invalid key stage title", k);
    const error = new Error("Invalid key stage title");
    errorReporter(
      "pupils::pupilAnalyticsProvider::getPupilPathwayData::invalidKeyStageTitle",
    )(error, {
      severity: "warning",
      keyStageTitle: k,
    });
  }
  if (browseData.programmeFields.phase === "foundation") {
    throw new Error("Foundation phase is not supported");
  }
  return {
    unitName: browseData.unitData.description ?? "",
    unitSlug: browseData.unitData.slug,
    lessonSlug: browseData.lessonData.slug,
    lessonName: browseData.lessonData.title,
    keyStageSlug: browseData.programmeFields.keystageSlug,
    keyStageTitle,
    subjectTitle: browseData.programmeFields.subject,
    subjectSlug: browseData.programmeFields.subjectSlug,
    yearGroupName: browseData.programmeFields.year,
    yearGroupSlug: browseData.programmeFields.yearSlug,
    phase: browseData.programmeFields.phase,
    tierName: browseData.programmeFields.tier,
    examBoard: browseData.programmeFields.examboard,
    releaseGroup: browseData.isLegacy ? "legacy" : "2023",
  };
};

export const getPupilVideoData = (
  lessonContent: LessonContent,
): PupilVideoData => {
  return {
    videoTitle: lessonContent.videoTitle ?? "",
    numberOfVideos: 1,
    videoSlug: [lessonContent.lessonSlug],
    isCaptioned: lessonContent.transcriptSentences.length > 0,
    videoPlaybackId: [
      lessonContent.videoMuxPlaybackId || "",
      lessonContent.videoWithSignLanguageMuxPlaybackId || "",
    ],
    signedAvailable: !!lessonContent.videoWithSignLanguageMuxPlaybackId,
  };
};

export const getPupilAudioData = (
  lessonContent: LessonContent,
): PupilAudioData => {
  return {
    audioTitle: "",
    numberOfAudios: "0",
    audioSlug: [lessonContent.lessonSlug],
    audioPlaybackId: [""],
    isCaptioned: false,
    signedAvailable: false,
  };
};
