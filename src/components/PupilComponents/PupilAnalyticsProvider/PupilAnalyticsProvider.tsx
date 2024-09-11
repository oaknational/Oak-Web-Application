import { createContext } from "react";
import { capitalize } from "lodash";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  AnalyticsUseCaseValueType,
  ExamBoardValueType,
  KeyStageTitleValueType,
  PathwayValueType,
  PhaseValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { unionOrNull } from "@/utils/narrowToUnion";

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
  | "pathway"
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
  tierName: TierNameValueType | null | undefined;
  pathway: PathwayValueType | null | undefined;
  examBoard: ExamBoardValueType | null | undefined;
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
  lessonContent,
}: {
  children: React.ReactNode;
  pupilPathwayData: PupilPathwayData;
  lessonContent?: LessonContent;
}) => {
  const { track } = useAnalytics();

  const additionalArgs: AdditionalArgType = {
    ...pupilPathwayData,
    analyticsUseCase: "Pupil",
  };

  const videoData = lessonContent && getPupilVideoData(lessonContent);
  const audioData = lessonContent && getPupilAudioData(lessonContent);

  const reportNoAudio = () => {
    console.error("No audio data available");
    const error = new Error("No audio data available");
    errorReporter(
      "pupils::pupilAnalyticsProvider::lessonActivityCompletedLessonAudio::noAudioData",
    )(error, {
      severity: "warning",
    });
  };

  const reportNoVideo = () => {
    console.error("No video data available");
    const error = new Error("No video data available");
    errorReporter(
      "pupils::pupilAnalyticsProvider::lessonActivityCompletedLessonVideo::noVideoData",
    )(error, {
      severity: "warning",
    });
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
    lessonActivityCompletedLessonVideo: (args) => {
      if (!videoData) {
        reportNoVideo();
        return;
      }

      track.lessonActivityCompletedLessonVideo({
        ...args,
        ...additionalArgs,
        ...videoData,
      });
    },
    lessonActivityCompletedExitQuiz: (args) =>
      track.lessonActivityCompletedExitQuiz({
        ...args,
        ...additionalArgs,
      }),
    lessonActivityCompletedLessonAudio: (args) => {
      if (!audioData) {
        reportNoAudio();
        return;
      }
      track.lessonActivityCompletedLessonAudio({
        ...args,
        ...additionalArgs,
        ...audioData,
      });
    },
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
    lessonActivityStartedLessonVideo: (args) => {
      if (!videoData) {
        reportNoVideo();
        return;
      }
      track.lessonActivityStartedLessonVideo({
        ...additionalArgs,
        ...videoData,
        ...args,
      });
    },
    lessonActivityStartedExitQuiz: (args) =>
      track.lessonActivityStartedExitQuiz({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityStartedLessonAudio: (args) => {
      if (!audioData) {
        reportNoAudio();
        return;
      }
      track.lessonActivityStartedLessonAudio({
        ...additionalArgs,
        ...args,
        ...audioData,
      });
    },

    lessonActivityAbandoned: (args) =>
      track.lessonActivityAbandoned({
        ...additionalArgs,
        ...args,
        ...videoData,
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
    lessonActivityAbandonedLessonVideo: (args) => {
      if (!videoData) {
        reportNoVideo();
        return;
      }
      track.lessonActivityAbandonedLessonVideo({
        ...additionalArgs,
        ...videoData,
        ...args,
      });
    },
    lessonActivityAbandonedExitQuiz: (args) =>
      track.lessonActivityAbandonedExitQuiz({
        ...additionalArgs,
        ...args,
      }),
    lessonActivityAbandonedLessonAudio: (args) => {
      if (!audioData) {
        reportNoAudio();
        return;
      }
      track.lessonActivityAbandonedLessonAudio({
        ...additionalArgs,
        ...args,
        ...audioData,
      });
    },
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
        ...videoData,
        ...audioData,
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
    tierName: unionOrNull<TierNameValueType>(
      capitalize(browseData.programmeFields.tier ?? undefined),
      ["Higher", "Foundation", "Core"],
    ),
    examBoard: browseData.programmeFields.examboard,
    releaseGroup: browseData.isLegacy ? "legacy" : "2023",
    pathway: null, // TODO: not yet implemented
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
