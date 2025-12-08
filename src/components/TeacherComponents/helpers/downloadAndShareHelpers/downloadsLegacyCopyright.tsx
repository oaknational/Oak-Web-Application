import { ResourceType } from "../../types/downloadAndShare.types";

import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { LessonOverviewDownloads } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { LegacyCopyrightContent } from "@/node-lib/curriculum-api-2023/shared.schema";

// Checks if an asset exists in the GCS bucket. Returns true if inGcsBucket is true or undefined (sensible fallback when server-side check fails), false only if explicitly false.
export const isAssetInGcsBucket = (
  download: { inGcsBucket?: boolean } | undefined,
): boolean => {
  if (!download) return false;
  return download.inGcsBucket !== false;
};

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

export const isDownloadAvailable = (
  download: LessonDownloadsPageData["downloads"][number],
) => {
  return download.exists && !download.forbidden && isAssetInGcsBucket(download);
};

export const getFilteredDownloads = (
  downloads: LessonDownloadsPageData["downloads"],
  legacyCopyrightContent: LegacyCopyrightContent,
) => {
  return getResourcesWithoutLegacyCopyright(
    downloads,
    legacyCopyrightContent,
  ).filter(isDownloadAvailable);
};

export const getIsResourceDownloadable = (
  resource: ResourceType,
  downloads: LessonOverviewDownloads,
  copyrightContent: LegacyCopyrightContent,
) => {
  const inDownloads = downloads.find((d) => d.type === resource);

  if (!inDownloads || !isDownloadAvailable(inDownloads)) {
    return false;
  }

  return !checkIfResourceHasLegacyCopyright(resource, copyrightContent);
};
