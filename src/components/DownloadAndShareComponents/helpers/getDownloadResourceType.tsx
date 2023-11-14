import {
  DownloadResourceType,
  PreselectedDownloadType,
  PreselectedShareType,
  ShareResourceType,
  preselectedDownloadTypeMap,
  preselectedShareTypeMap,
} from "../downloadsAndShare.types";

export const getPreselectedDownloadResourceTypes = (
  title: PreselectedDownloadType,
): DownloadResourceType[] | "all" | undefined => {
  return preselectedDownloadTypeMap[title];
};

export const getPreselectedShareResourceTypes = (
  title: PreselectedShareType,
): ShareResourceType[] | "all" | undefined => {
  return preselectedShareTypeMap[title];
};
