import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

type Download = LessonDownloadsPageData["downloads"][number];
type AdditionalFile = LessonDownloadsPageData["additionalFiles"][number];

export const getGroupName = (
  type: Download["type"] | AdditionalFile["type"],
): string => {
  switch (type) {
    case "presentation":
      return "Slide deck";
    case "lesson-guide-pdf":
      return "Lesson guide";
    case "intro-quiz-questions":
    case "intro-quiz-answers":
    case "exit-quiz-questions":
    case "exit-quiz-answers":
      return "Quizzes";
    case "worksheet-pdf":
    case "worksheet-pptx":
      return "Worksheet";
    case "supplementary-pdf":
    case "supplementary-docx":
      return "Additional material";
    case "curriculum-pdf":
    case "additional-files":
    default:
      return "Lesson files";
  }
};

export const groupDownloadResources = (
  downloads?: LessonDownloadsPageData["downloads"],
  additionalFiles?: LessonDownloadsPageData["additionalFiles"],
): Record<string, Array<Download | AdditionalFile>> => {
  const combined = [...(downloads || []), ...(additionalFiles || [])];
  return combined.reduce(
    (
      all: Record<string, Array<Download | AdditionalFile>>,
      item: Download | AdditionalFile,
    ) => {
      const groupName = getGroupName(item.type);
      if (!all[groupName]) all[groupName] = [];
      all[groupName].push(item);
      return all;
    },
    {},
  );
};
