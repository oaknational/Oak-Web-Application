import {
  DownloadResourceType,
  preselectedDownloadTypeMap,
} from "../downloads.types";

export const getPreselectedDownloadResourceTypes = (
  title: string | string[] | undefined
): DownloadResourceType[] | "all" | undefined => {
  if (
    title === "slide deck" ||
    title === "exit quiz" ||
    title === "starter quiz" ||
    title === "worksheet" ||
    title === "all"
  ) {
    return preselectedDownloadTypeMap[title];
  }
};
