import { ResourceType } from "../../types/downloadAndShare.types";

import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { LessonOverviewDownloads } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { LegacyCopyrightContent } from "@/node-lib/curriculum-api-2023/shared.schema";

export const isResourceTypeSubjectToCopyright = (resource: ResourceType) => {
  return (
    resource === "worksheet-pdf" ||
    resource === "presentation" ||
    resource === "worksheet-pptx"
  );
};

export const checkIfResourceHasLegacyCopyright = (
  resource: ResourceType,
  legacyCopyrightContent: LegacyCopyrightContent,
) => {
  const hasCopyrightedContent =
    legacyCopyrightContent?.find(
      (c) => c.copyrightInfo === "This lesson contains copyright material.",
    ) !== undefined;

  return isResourceTypeSubjectToCopyright(resource) && hasCopyrightedContent;
};

export const getResourcesWithoutLegacyCopyright = (
  downloads: LessonDownloadsPageData["downloads"],
  copyrightContent: LegacyCopyrightContent,
) => {
  return downloads.filter(
    (d) =>
      d.exists === true &&
      !checkIfResourceHasLegacyCopyright(d.type, copyrightContent),
  );
};

export const getIsResourceDownloadable = (
  resource: ResourceType,
  downloads: LessonOverviewDownloads,
  copyrightContent: LegacyCopyrightContent,
) => {
  const inDownloads = downloads.find((d) => d.type === resource);
  if (!inDownloads || !inDownloads.exists) {
    return false;
  }

  return !checkIfResourceHasLegacyCopyright(resource, copyrightContent);
};
