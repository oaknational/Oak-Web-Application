import { combinedPreselectedTypeMap } from "./combinedPreselectedTypeMap";

import {
  DownloadResourceType,
  PreselectedDownloadType,
  PreselectedShareType,
  ShareResourceType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";

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
