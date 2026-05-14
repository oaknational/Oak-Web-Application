import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type {
  PupilLessonAnalyticsGet,
  TrackSectionStartedArgs,
} from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";
import type { LessonSectionResults } from "@/context/PupilLessonProgress";

export const buildVideoTrackingData = (
  sectionResults: LessonSectionResults,
) => ({
  pupilExperienceLessonActivity: "video" as const,
  pupilVideoDurationSeconds: sectionResults.video?.duration || 0,
  pupilVideoPlayed: sectionResults.video?.played || false,
});

export const trackVideoStarted = (
  get: PupilLessonAnalyticsGet,
  { section, sectionResults }: TrackSectionStartedArgs,
) => {
  const { track, additionalArgs, videoData } = get();
  if (!track || !additionalArgs || !videoData) return;
  if (section !== "video" || sectionResults.video?.isComplete) return;

  track.lessonActivityStartedLessonVideo({
    ...additionalArgs,
    ...videoData,
    ...buildVideoTrackingData(sectionResults),
  });
};

export const trackVideoCompleted = (
  get: PupilLessonAnalyticsGet,
  sectionResults: LessonSectionResults,
) => {
  const { track, additionalArgs, videoData } = get();
  if (!track || !additionalArgs || !videoData) return;

  track.lessonActivityCompletedLessonVideo({
    ...additionalArgs,
    ...videoData,
    ...buildVideoTrackingData(sectionResults),
    pupilVideoTimeElapsedSeconds: sectionResults.video?.timeElapsed || 0,
    isMuted: sectionResults.video?.muted || false,
    signedOpened: sectionResults.video?.signedOpened || false,
    transcriptOpened: sectionResults.video?.transcriptOpened || false,
    activityTimeSpent: 0,
  } as unknown as Parameters<
    TrackFns["lessonActivityCompletedLessonVideo"]
  >[0]);
};

export const trackVideoAbandoned = (
  get: PupilLessonAnalyticsGet,
  sectionResults: LessonSectionResults,
  sectionStartedAt: number,
) => {
  const { track, additionalArgs, videoData } = get();
  if (!track || !additionalArgs || !videoData) return;

  track.lessonActivityAbandonedLessonVideo({
    ...additionalArgs,
    ...videoData,
    ...buildVideoTrackingData(sectionResults),
    pupilVideoTimeElapsedSeconds: sectionResults.video?.timeElapsed || 0,
    isMuted: sectionResults.video?.muted || false,
    signedOpened: sectionResults.video?.signedOpened || false,
    transcriptOpened: sectionResults.video?.transcriptOpened || false,
    activityTimeSpent: Date.now() - sectionStartedAt,
  } as unknown as Parameters<
    TrackFns["lessonActivityAbandonedLessonVideo"]
  >[0]);
};
