import {
  DownloadResourceType,
  PreselectedDownloadType,
  preselectedDownloadTypeMap,
} from "../downloads.types";

export const getPreselectedDownloadResourceTypes = (
  title: PreselectedDownloadType,
): DownloadResourceType[] | "all" | undefined => {
  return preselectedDownloadTypeMap[title];
};
