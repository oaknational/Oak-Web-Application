import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type { LessonSectionResults } from "@/context/PupilLessonProgress";
import type { PupilLessonAnalyticsGet } from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";

export const buildLessonSummaryReviewedTrackingData = (
  sectionResults: LessonSectionResults,
) => ({
  pupilWorksheetAvailable: sectionResults.intro?.worksheetAvailable ?? false,
  pupilWorksheetDownloaded: sectionResults.intro?.worksheetDownloaded ?? false,
  pupilExitQuizGrade: sectionResults["exit-quiz"]?.grade ?? null,
  pupilExitQuizNumQuestions: sectionResults["exit-quiz"]?.numQuestions ?? null,
  pupilStarterQuizGrade: sectionResults["starter-quiz"]?.grade ?? null,
  pupilStarterQuizNumQuesions:
    sectionResults["starter-quiz"]?.numQuestions ?? null,
  pupilVideoPlayed: sectionResults.video?.played ?? false,
  pupilVideoDurationSeconds: sectionResults.video?.duration ?? 0,
  pupilVideoTimeElapsedSeconds: sectionResults.video?.timeElapsed ?? 0,
  pupilExitQuiz: undefined,
  pupilStarterQuiz: undefined,
});

export const buildActivityResultsSharedTrackingData = (
  sectionResults: LessonSectionResults,
) => ({
  shareMedium: "copy-link" as const,
  pupilExitQuizGrade: sectionResults["exit-quiz"]?.grade ?? 0,
  pupilExitQuizNumQuestions: sectionResults["exit-quiz"]?.numQuestions ?? 0,
  pupilStarterQuizGrade: sectionResults["starter-quiz"]?.grade ?? 0,
  pupilStarterQuizNumQuesions:
    sectionResults["starter-quiz"]?.numQuestions ?? 0,
  pupilExitQuiz: undefined,
  pupilStarterQuiz: undefined,
});

export const trackLessonSummaryReviewed = (
  get: PupilLessonAnalyticsGet,
  sectionResults: LessonSectionResults,
) => {
  const { track, additionalArgs, videoData } = get();
  if (!track || !additionalArgs) return;

  track.lessonSummaryReviewed({
    ...additionalArgs,
    ...videoData,
    ...buildLessonSummaryReviewedTrackingData(sectionResults),
  } as unknown as Parameters<TrackFns["lessonSummaryReviewed"]>[0]);
};

export const trackActivityResultsShared = (
  get: PupilLessonAnalyticsGet,
  sectionResults: LessonSectionResults,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.activityResultsShared({
    ...additionalArgs,
    ...buildActivityResultsSharedTrackingData(sectionResults),
  } as unknown as Parameters<TrackFns["activityResultsShared"]>[0]);
};
