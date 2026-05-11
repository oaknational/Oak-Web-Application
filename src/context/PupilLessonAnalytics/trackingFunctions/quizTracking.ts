import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type { LessonSectionResults } from "@/context/PupilLessonProgress";
import type {
  PupilLessonAnalyticsGet,
  TrackQuizCompletedArgs,
  TrackQuizQuestionAttemptArgs,
  TrackSectionStartedArgs,
} from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";

export const buildQuizCompletionTrackingData = ({
  section,
  sectionResults,
  sectionStartedAt,
}: TrackQuizCompletedArgs) => ({
  pupilExperienceLessonActivity: section,
  pupilQuizGrade: sectionResults[section]?.grade || 0,
  pupilQuizNumQuestions: sectionResults[section]?.numQuestions || 0,
  hintQuestion: "",
  hintQuestionResult: "",
  hintUsed: "",
  activityTimeSpent: Date.now() - sectionStartedAt,
});

export const buildQuestionAttemptTrackingData = ({
  section,
  questionType,
  isCorrect,
  hintAvailable,
  hintAccessed,
  questionNumber,
}: TrackQuizQuestionAttemptArgs) => ({
  pupilExperienceLessonActivity: section,
  questionType,
  questionResult: isCorrect ? ("correct" as const) : ("incorrect" as const),
  activityTimeSpent: 0,
  hintOffered: hintAvailable,
  hintAccessed,
  questionNumber,
});

export const trackQuizStarted = (
  get: PupilLessonAnalyticsGet,
  { section, sectionResults }: TrackSectionStartedArgs,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  if (section !== "starter-quiz" && section !== "exit-quiz") {
    return;
  }

  if (sectionResults[section]?.isComplete) return;

  const payload = {
    ...additionalArgs,
    pupilExperienceLessonActivity: section,
    pupilQuizGrade: sectionResults[section]?.grade || 0,
    pupilQuizNumQuestions: sectionResults[section]?.numQuestions || 0,
    hintAvailable: true,
  };

  if (section === "starter-quiz") {
    track.lessonActivityStartedStarterQuiz(
      payload as Parameters<TrackFns["lessonActivityStartedStarterQuiz"]>[0],
    );
    return;
  }

  track.lessonActivityStartedExitQuiz(
    payload as Parameters<TrackFns["lessonActivityStartedExitQuiz"]>[0],
  );
};

export const trackQuizQuestionAttempt = (
  get: PupilLessonAnalyticsGet,
  args: TrackQuizQuestionAttemptArgs,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.questionAttemptSubmitted({
    ...additionalArgs,
    ...buildQuestionAttemptTrackingData(args),
  });
};

export const trackQuizCompleted = (
  get: PupilLessonAnalyticsGet,
  args: TrackQuizCompletedArgs,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  const trackData = buildQuizCompletionTrackingData(args);

  if (args.section === "starter-quiz") {
    track.lessonActivityCompletedStarterQuiz({
      ...additionalArgs,
      ...trackData,
    });
    return;
  }

  track.lessonActivityCompletedExitQuiz({
    ...additionalArgs,
    ...trackData,
  });
};

export const trackQuizAbandoned = (
  get: PupilLessonAnalyticsGet,
  section: "starter-quiz" | "exit-quiz",
  sectionResults: LessonSectionResults,
) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  const payload = {
    ...additionalArgs,
    pupilExperienceLessonActivity: section,
    pupilQuizGrade: sectionResults[section]?.grade || 0,
    pupilQuizNumQuestions: sectionResults[section]?.numQuestions || 0,
  };

  if (section === "starter-quiz") {
    track.lessonActivityAbandonedStarterQuiz(
      payload as Parameters<TrackFns["lessonActivityAbandonedStarterQuiz"]>[0],
    );
    return;
  }

  track.lessonActivityAbandonedExitQuiz(
    payload as Parameters<TrackFns["lessonActivityAbandonedExitQuiz"]>[0],
  );
};
