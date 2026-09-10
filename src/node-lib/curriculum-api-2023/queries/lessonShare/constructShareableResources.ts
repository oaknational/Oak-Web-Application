import { RawLessonShareSchema } from "./lessonShare.schema";

export const constructShareableResources = (lesson: RawLessonShareSchema) => {
  const starterQuizLength = lesson.starter_quiz?.length ?? 0;
  const exitQuizLength = lesson.exit_quiz?.length ?? 0;

  const introQuiz = {
    exists: lesson.starter_quiz !== null,
    type: "starter-quiz" as const,
    label: "Prior knowledge starter quiz",
    metadata: lesson.starter_quiz
      ? `Check prior knowledge (${starterQuizLength} question${starterQuizLength === 1 ? "" : "s"})`
      : "",
  };
  const exitQuiz = {
    exists: lesson.exit_quiz !== null,
    type: "exit-quiz" as const,
    label: "Assessment exit quiz",
    metadata: lesson.exit_quiz
      ? `Check understanding (${exitQuizLength} question${exitQuizLength === 1 ? "" : "s"})`
      : "",
  };
  const video = {
    exists: lesson.video_mux_playback_id !== null,
    type: "video" as const,
    label: "Lesson video",
    metadata: `Support independent learning (${lesson.video_duration})`,
  };

  return [video, introQuiz, exitQuiz];
};
