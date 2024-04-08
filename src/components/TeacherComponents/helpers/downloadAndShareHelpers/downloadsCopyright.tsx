import { ResourceType } from "../../types/downloadAndShare.types";

import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { LessonOverviewDownloads } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { CopyrightContent } from "@/node-lib/curriculum-api-2023/shared.schema";

export const isResourceTypeSubjectToCopyright = (resource: ResourceType) => {
  return (
    resource === "worksheet-pdf" ||
    resource === "presentation" ||
    resource === "worksheet-pptx"
  );
};

export const checkIsResourceCopyrightRestricted = (
  resource: ResourceType,
  copyrightContent: CopyrightContent,
) => {
  if (!isResourceTypeSubjectToCopyright(resource)) {
    return false;
  } else {
    return (
      copyrightContent?.find(
        (c) => c.copyrightInfo === "This lesson contains copyright material.",
      ) !== undefined
    );
  }
};

export const filterDownloadsByCopyright = (
  downloads: LessonDownloadsPageData["downloads"],
  copyrightContent: CopyrightContent,
) => {
  return downloads.filter(
    (d) =>
      d.exists === true &&
      !checkIsResourceCopyrightRestricted(d.type, copyrightContent),
  );
};

export const getIsResourceDownloadable = (
  resource: ResourceType,
  downloads: LessonOverviewDownloads,
  copyrightContent: CopyrightContent,
) => {
  const inDownloads = downloads.find((d) => d.type === resource);
  if (!inDownloads || !inDownloads.exists) {
    return false;
  }

  return !checkIsResourceCopyrightRestricted(resource, copyrightContent);
};
