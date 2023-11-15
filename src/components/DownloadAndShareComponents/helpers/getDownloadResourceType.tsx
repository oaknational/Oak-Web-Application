import {
  DownloadResourceType,
  PreselectedDownloadType,
  PreselectedShareType,
  ShareResourceType,
} from "../downloadAndShare.types";

import { combinedPreselectedTypeMap } from "./combinedPreselectedTypeMap";

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
