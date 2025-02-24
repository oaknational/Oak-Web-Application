import {
  ResourceType,
  Resources,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

export const sortDownloadResources = (
  resources: LessonDownloadsPageData["downloads"],
) => {
  const sortOrderKey = {
    presentation: 1,
    "worksheet-pdf": 2,
    "worksheet-pptx": 3,
    "intro-quiz-questions": 4,
    "intro-quiz-answers": 5,
    "exit-quiz-questions": 6,
    "exit-quiz-answers": 7,
    "supplementary-pdf": 8,
    "supplementary-docx": 9,
    video: 10,
    "curriculum-pdf": 11,
    "lesson-guide-pdf": 12,
  };
  return sortResourcesByOrder(
    resources,
    sortOrderKey,
  ) as LessonDownloadsPageData["downloads"];
};

export const sortShareResources = (
  resources: LessonShareData["shareableResources"],
) => {
  const sortOrderKey = {
    "intro-quiz-questions": 1,
    video: 2,
    "worksheet-pdf": 3,
    "intro-quiz-answers": 4,
    "exit-quiz-questions": 5,
    presentation: 100,
    "worksheet-pptx": 100,
    "exit-quiz-answers": 100,
    "supplementary-pdf": 100,
    "supplementary-docx": 100,
    "curriculum-pdf": 100,
    "lesson-guide-pdf": 100,
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
