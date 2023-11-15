import {
  DownloadResourceType,
  PreselectedDownloadType,
  PreselectedShareType,
  ShareResourceType,
  combinedPreselectedTypeMap,
} from "../downloadAndShare.types";

export const getPreselectedDownloadResourceTypes = (
  title: PreselectedDownloadType,
): DownloadResourceType[] | "all" | undefined => {
  return combinedPreselectedTypeMap[title].downloadType;
};

export const getPreselectedShareResourceTypes = (
  title: PreselectedShareType,
): ShareResourceType[] | "all" | undefined => {
  return combinedPreselectedTypeMap[title].shareType;
};
