export enum LessonOverviewSectionName {
  Intro = "intro",
  StarterQuiz = "starter-quiz",
  Video = "video",
  ExitQuiz = "exit-quiz",
}

export type LessonOverviewSectionProgress =
  | "not-started"
  | "in-progress"
  | "complete";
