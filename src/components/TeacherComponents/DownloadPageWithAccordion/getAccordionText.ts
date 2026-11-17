import { DownloadTypeLabel } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { getLessonDownloadMetadata } from "@/common-lib/lessonDownloads";

export const getAccordionText = ({
  lessonDownloads,
  additionalFiles,
  curriculumDownloads,
  teachWithOak,
}: {
  lessonDownloads?: LessonDownloadsPageData["downloads"];
  additionalFiles?: LessonDownloadsPageData["additionalFiles"];
  curriculumDownloads?: DownloadTypeLabel[];
  teachWithOak?: boolean;
}) => {
  if (teachWithOak) {
    return "Explanation, CfU, practice, feedback guides";
  }

  const resources = [];
  if (lessonDownloads) {
    for (const download of lessonDownloads) {
      const label = getLessonDownloadMetadata(download.type).accordionLabel;
      if (label) {
        resources.push(label);
      }
    }
  }

  if (additionalFiles && additionalFiles.length > 0) {
    resources.push("additional files");
  }

  if (curriculumDownloads) {
    for (const download of curriculumDownloads) {
      resources.push(download.groupLabel ?? download.label);
    }
  }

  // It's possible for there to be multiple or a resource here, eg quizzes, so dedupe by creating a set first
  const resourcesText = Array.from(new Set(resources)).join(", ");

  return (
    resourcesText.charAt(0).toUpperCase() +
    resourcesText.slice(1).toLocaleLowerCase()
  );
};
