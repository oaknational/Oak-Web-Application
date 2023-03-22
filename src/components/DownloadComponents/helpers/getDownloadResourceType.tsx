import {
  DownloadResourceType,
  preselectedDownloadTitleTypeMap,
} from "../downloads.types";

export const getPreselectedDownloadResourceTypes = (
  title: string | string[] | undefined
): DownloadResourceType[] | "all" | undefined => {
  if (typeof title === "string") {
    return preselectedDownloadTitleTypeMap[title];
  }
};
