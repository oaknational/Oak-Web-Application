import { DownloadTypeLabel } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

export const getAccordionText = ({
  lessonDownloads,
  additionalFiles,
  curriculumDownloads,
}: {
  lessonDownloads?: LessonDownloadsPageData["downloads"];
  additionalFiles?: LessonDownloadsPageData["additionalFiles"];
  curriculumDownloads?: DownloadTypeLabel[];
}) => {
  const resources = [];
  const resourceTypes: Record<string, string> = {
    presentation: "slides",
    "intro-quiz-questions": "quizzes",
    "intro-quiz-answers": "quizzes",
    "exit-quiz-questions": "quizzes",
    "exit-quiz-answers": "quizzes",
    "worksheet-pdf": "worksheets",
    "worksheet-pptx": "worksheets",
    "supplementary-pdf": "additional materials",
    "supplementary-docx": "additional materials",
    "lesson-guide-pdf": "lesson guide",
    "additional-files": "additional files",
  };

  if (lessonDownloads) {
    for (const download of lessonDownloads) {
      if (download.type && download.type in resourceTypes) {
        resources.push(resourceTypes[download.type]);
      }
    }
  }

  if (additionalFiles && additionalFiles.length > 0) {
    resources.push("additional files");
  }

  if (curriculumDownloads) {
    for (const download of curriculumDownloads) {
      resources.push(download.label);
    }
  }
  const resourcesText = resources.join(", ");

  return (
    resourcesText.charAt(0).toUpperCase() +
    resourcesText.slice(1).toLocaleLowerCase()
  );
};
