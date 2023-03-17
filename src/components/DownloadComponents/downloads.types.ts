import { DownloadFormProps } from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads";

export type DownloadResourceType =
  | "presentation"
  | "intro-quiz-questions"
  | "intro-quiz-answers"
  | "exit-quiz-questions"
  | "exit-quiz-answers"
  | "worksheet-pdf"
  | "worksheet-pptx";

export type ResourcesToDownloadArrayType = DownloadResourceType[];

export type ErrorKeysType = keyof Omit<DownloadFormProps, "onSubmit">;
