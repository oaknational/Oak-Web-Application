import { DownloadFormProps } from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads";

const DOWNLOAD_RESOURCE_TYPES = [
  "presentation",
  "intro-quiz-questions",
  "intro-quiz-answers",
  "exit-quiz-questions",
  "exit-quiz-answers",
  "worksheet-pdf",
  "worksheet-pptx",
] as const;

export const preselectedDownloadTitleTypeMap: Record<
  string,
  DownloadResourceType[] | "all"
> = {
  "slide deck": ["presentation"],
  "starter quiz": ["intro-quiz-questions", "intro-quiz-answers"],
  "exit quiz": ["exit-quiz-questions", "exit-quiz-answers"],
  worksheet: ["worksheet-pdf", "worksheet-pptx"],
  all: "all",
};

export type DownloadResources = typeof DOWNLOAD_RESOURCE_TYPES;
export type DownloadResourceType = DownloadResources[number];

export type ResourcesToDownloadArrayType = DownloadResourceType[];

export type ErrorKeysType = keyof Omit<DownloadFormProps, "onSubmit">;
