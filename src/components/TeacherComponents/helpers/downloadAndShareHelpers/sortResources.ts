import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

export const sortShareResources = (
  resources: LessonShareData["shareableResources"],
) => {
  const sortOrderKey = {
    "intro-quiz-questions": 1,
    "starter-quiz": 2,
    video: 3,
    "worksheet-pdf": 4,
    "intro-quiz-answers": 5,
    "exit-quiz-questions": 6,
    "exit-quiz": 7,
    presentation: 100,
    "worksheet-pptx": 100,
    "exit-quiz-answers": 100,
    "supplementary-pdf": 100,
    "supplementary-docx": 100,
    "curriculum-pdf": 100,
    "lesson-guide-pdf": 100,
    "additional-files": 100,
  };
  return resources.sort((a, b) => {
    const aSortOrder = sortOrderKey[a.type];
    const bSortOrder = sortOrderKey[b.type];
    return aSortOrder - bSortOrder;
  });
};
