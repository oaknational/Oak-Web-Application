import { RawLessonShareSchema } from "./lessonShare.schema";

export const constructShareableResources = (lesson: RawLessonShareSchema) => {
  const starterQuizLength = lesson.starter_quiz?.length ?? 0;
  const exitQuizLength = lesson.exit_quiz?.length ?? 0;

  const introQuiz = {
    exists: lesson.starter_quiz !== null,
    type: "intro-quiz-questions" as const,
    label: "Starter quiz",
    metadata: lesson.starter_quiz
      ? `${starterQuizLength} question${starterQuizLength === 1 ? "" : "s"}`
      : "",
  };
  const exitQuiz = {
    exists: lesson.exit_quiz !== null,
    type: "exit-quiz-questions" as const,
    label: "Exit quiz",
    metadata: lesson.exit_quiz
      ? `${exitQuizLength} question${exitQuizLength === 1 ? "" : "s"}`
      : "",
  };
  const video = {
    exists: lesson.video_mux_playback_id !== null,
    type: "video" as const,
    label: "Video",
    metadata: lesson.video_duration,
  };
  const worksheet = {
    exists: lesson.worksheet_asset_object_url !== null,
    type: "worksheet-pdf" as const,
    label: "Worksheet",
    metadata: "pdf",
  };

  return [video, introQuiz, exitQuiz, worksheet];
};
