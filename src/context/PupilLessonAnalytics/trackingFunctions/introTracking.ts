import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type {
  PupilLessonAnalyticsGet,
  TrackSectionAbandonedArgs,
  TrackSectionStartedArgs,
} from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";

export const trackIntroStarted = (
  get: PupilLessonAnalyticsGet,
  { section, sectionResults }: TrackSectionStartedArgs,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;
  if (section !== "intro" || sectionResults.intro?.isComplete) return;

  track.lessonActivityStartedIntroduction({
    ...additionalArgs,
    pupilExperienceLessonActivity: section,
  });
};

export const trackIntroCompleted = (
  get: PupilLessonAnalyticsGet,
  { sectionStartedAt }: TrackSectionAbandonedArgs,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.lessonActivityCompletedIntroduction({
    ...additionalArgs,
    pupilExperienceLessonActivity: "intro",
    activityTimeSpent: Date.now() - sectionStartedAt,
  });
};

export const trackIntroAbandoned = (
  get: PupilLessonAnalyticsGet,
  sectionStartedAt: number,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.lessonActivityAbandonedIntroduction({
    ...additionalArgs,
    pupilExperienceLessonActivity: "intro",
    activityTimeSpent: Date.now() - sectionStartedAt,
  });
};

export const trackWorksheetDownloaded = (get: PupilLessonAnalyticsGet) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.lessonActivityDownloadedWorksheet({
    ...additionalArgs,
    pupilExperienceLessonActivity: "intro",
  } as Parameters<TrackFns["lessonActivityDownloadedWorksheet"]>[0]);
};

export const trackContentGuidanceAccepted = (
  get: PupilLessonAnalyticsGet,
  args: Omit<
    Parameters<TrackFns["contentGuidanceAccepted"]>[0],
    keyof NonNullable<ReturnType<PupilLessonAnalyticsGet>["additionalArgs"]>
  >,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.contentGuidanceAccepted({
    ...additionalArgs,
    ...args,
  } as Parameters<TrackFns["contentGuidanceAccepted"]>[0]);
};

export const trackContentGuidanceDeclined = (
  get: PupilLessonAnalyticsGet,
  args: Omit<
    Parameters<TrackFns["contentGuidanceDeclined"]>[0],
    keyof NonNullable<ReturnType<PupilLessonAnalyticsGet>["additionalArgs"]>
  >,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.contentGuidanceDeclined({
    ...additionalArgs,
    ...args,
  } as Parameters<TrackFns["contentGuidanceDeclined"]>[0]);
};
