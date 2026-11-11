import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { lessonDownloadMetadata } from "@/common-lib/lessonDownloads";

type Download = LessonDownloadsPageData["downloads"][number];
type AdditionalFile = LessonDownloadsPageData["additionalFiles"][number];

export const getGroupName = (
  type: Download["type"] | AdditionalFile["type"],
): string => lessonDownloadMetadata[type]?.group ?? "Lesson files";

export const groupDownloadResources = (
  downloads?: LessonDownloadsPageData["downloads"],
  additionalFiles?: LessonDownloadsPageData["additionalFiles"],
): Record<string, Array<Download | AdditionalFile>> => {
  const combined = [...(downloads || []), ...(additionalFiles || [])];
  const grouped = combined.reduce(
    (
      all: Record<string, Array<Download | AdditionalFile>>,
      item: Download | AdditionalFile,
    ) => {
      const groupName = getGroupName(item.type);
      all[groupName] ??= [];
      all[groupName].push(item);
      return all;
    },
    {},
  );
  return grouped;
};
