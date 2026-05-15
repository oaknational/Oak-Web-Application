import { Resources, ResourceType } from "../../types/downloadAndShare.types";

import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

export const sortShareResources = (
  resources: LessonShareData["shareableResources"],
) => {
  const sortOrderKey = {
    "intro-quiz-questions": 1,
    video: 2,
    "worksheet-pdf": 3,
    "intro-quiz-answers": 4,
    "exit-quiz-questions": 5,
    "starter-quiz": 6,
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
  return sortResourcesByOrder(
    resources,
    sortOrderKey,
  ) as LessonShareData["shareableResources"];
};

export const sortResourcesByOrder = (
  resources: Resources,
  sortOrder: Record<ResourceType, number>,
) => {
  return resources.sort((a, b) => {
    const aSortOrder = sortOrder[a.type];
    const bSortOrder = sortOrder[b.type];
    return aSortOrder - bSortOrder;
  });
};
