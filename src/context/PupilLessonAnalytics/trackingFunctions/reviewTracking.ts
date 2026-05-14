import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type {
  PupilLessonAnalyticsGet,
  TrackReviewEventArgs,
} from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";
import { mapPupilQuizResultsForAnalytics } from "@/components/PupilComponents/Views/ViewHelpers/Review/mapPupilQuizResultsForAnalytics";

export const buildLessonSummaryReviewedTrackingData = ({
  sectionResults,
  starterQuizQuestionsArray,
  exitQuizQuestionsArray,
}: TrackReviewEventArgs) => ({
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
  pupilExitQuiz: mapPupilQuizResultsForAnalytics({
    section: "exit-quiz",
    questionResults: sectionResults["exit-quiz"]?.questionResults,
    questionsArray: exitQuizQuestionsArray,
  }),
  pupilStarterQuiz: mapPupilQuizResultsForAnalytics({
    section: "starter-quiz",
    questionResults: sectionResults["starter-quiz"]?.questionResults,
    questionsArray: starterQuizQuestionsArray,
  }),
});

export const buildActivityResultsSharedTrackingData = ({
  sectionResults,
  starterQuizQuestionsArray,
  exitQuizQuestionsArray,
}: TrackReviewEventArgs) => ({
  shareMedium: "copy-link" as const,
  pupilExitQuizGrade: sectionResults["exit-quiz"]?.grade ?? 0,
  pupilExitQuizNumQuestions: sectionResults["exit-quiz"]?.numQuestions ?? 0,
  pupilStarterQuizGrade: sectionResults["starter-quiz"]?.grade ?? 0,
  pupilStarterQuizNumQuesions:
    sectionResults["starter-quiz"]?.numQuestions ?? 0,
  pupilExitQuiz: mapPupilQuizResultsForAnalytics({
    section: "exit-quiz",
    questionResults: sectionResults["exit-quiz"]?.questionResults,
    questionsArray: exitQuizQuestionsArray,
  }),
  pupilStarterQuiz: mapPupilQuizResultsForAnalytics({
    section: "starter-quiz",
    questionResults: sectionResults["starter-quiz"]?.questionResults,
    questionsArray: starterQuizQuestionsArray,
  }),
});

export const trackLessonSummaryReviewed = (
  get: PupilLessonAnalyticsGet,
  args: TrackReviewEventArgs,
) => {
  const { track, additionalArgs, videoData } = get();
  if (!track || !additionalArgs) return;

  track.lessonSummaryReviewed({
    ...additionalArgs,
    ...videoData,
    ...buildLessonSummaryReviewedTrackingData(args),
  } as unknown as Parameters<TrackFns["lessonSummaryReviewed"]>[0]);
};

export const trackActivityResultsShared = (
  get: PupilLessonAnalyticsGet,
  args: TrackReviewEventArgs,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.activityResultsShared({
    ...additionalArgs,
    ...buildActivityResultsSharedTrackingData(args),
  } as unknown as Parameters<TrackFns["activityResultsShared"]>[0]);
};
