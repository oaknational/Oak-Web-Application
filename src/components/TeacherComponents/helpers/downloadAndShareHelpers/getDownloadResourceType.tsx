import { combinedPreselectedTypeMap } from "./combinedPreselectedTypeMap";

import { LessonDownloadsData } from "@/node-lib/curriculum-api";
import {
  DownloadResourceType,
  PreselectedDownloadType,
  PreselectedShareType,
  ShareResourceType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";

function removeFromPreselectedIfDownloadExistsFalse(
  preSelectedTypes: DownloadResourceType[],
  downloads: LessonDownloadsData["downloads"],
): DownloadResourceType[] {
  const existingItemTypes = new Set(
    downloads.filter((item) => item.exists).map((item) => item.type),
  );

  // Filter the preSelectedTypes array, keeping only those that exist in the 'exists' downloads set.
  // This will ensure that any preselected query string is removed if it has no download.
  return preSelectedTypes.filter((resourceType) =>
    existingItemTypes.has(resourceType),
  );
}

export const getPreselectedDownloadResourceTypes = (
  title: PreselectedDownloadType,
  downloads: LessonDownloadsData["downloads"],
): DownloadResourceType[] | "all" | undefined => {
  const preSelectedTypes = combinedPreselectedTypeMap[title].downloadType;
  if (preSelectedTypes === "all" || preSelectedTypes === undefined) {
    return preSelectedTypes;
  }
  return removeFromPreselectedIfDownloadExistsFalse(
    preSelectedTypes,
    downloads,
  );
};

export const getPreselectedShareResourceTypes = (
  title: PreselectedShareType,
): ShareResourceType[] | "all" | undefined => {
  return combinedPreselectedTypeMap[title].shareType;
};
