import { z } from "zod";

import {
  preselectedDownloadType,
  preselectedResourceType,
  preselectedShareType,
  resourceFormValuesSchema,
} from "@/components/TeacherComponents/downloadAndShare.schema";
import { LessonItemTitle } from "@/components/TeacherComponents/LessonItemContainer";
import { ExpandingContainerTitle } from "@/components/ArchivedComponents/ExpandingContainer/ExpandingContainer";
import {
  LessonDownloadsData,
  LessonShareData,
  LessonShareSchema,
} from "@/node-lib/curriculum-api";

// Resource types

export type Resources =
  | LessonDownloadsData["downloads"]
  | LessonShareData["shareableResources"];

export type ResourceType = LessonShareSchema["type"] | DownloadResourceType;

export type DownloadResourceType =
  LessonDownloadsData["downloads"][number]["type"];
export type ResourcesToDownloadArrayType = DownloadResourceType[];
export type ShareResourceType = LessonShareSchema["type"];

// Preselected types

export type PreselectedResourceType = z.infer<typeof preselectedResourceType>;
export type PreselectedDownloadType = z.infer<typeof preselectedDownloadType>;
export type PreselectedShareType = z.infer<typeof preselectedShareType>;

export type CombinedPreselectedTypeMap = Record<
  PreselectedDownloadType | PreselectedShareType,
  {
    downloadType?: DownloadResourceType[] | "all";
    shareType?: ShareResourceType[] | "all";
  }
>;

export type CombinedDownloadsShareType = Record<
  ExpandingContainerTitle | LessonItemTitle,
  {
    downloadType: PreselectedDownloadType | null;
    shareType: PreselectedShareType | null;
  }
>;

export const isPreselectedDownloadType = (
  preselected: PreselectedDownloadType | PreselectedShareType | null,
): preselected is PreselectedDownloadType => {
  return preselectedDownloadType.safeParse(preselected).success;
};

export const isPreselectedShareType = (
  preselected: PreselectedDownloadType | PreselectedShareType | null,
): preselected is PreselectedShareType => {
  return preselectedShareType.safeParse(preselected).success;
};

// Form types

export type ResourceFormValues = z.infer<typeof resourceFormValuesSchema>;
export type ResourceFormProps = ResourceFormValues & {
  onSubmit: (values: ResourceFormValues) => Promise<string | void>;
};

export type ErrorKeysType = keyof Omit<ResourceFormProps, "onSubmit">;
