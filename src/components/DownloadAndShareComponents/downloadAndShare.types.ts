import { z } from "zod";

import { ExpandingContainerTitle } from "../ExpandingContainer/ExpandingContainer";
import { LessonItemTitle } from "../LessonItemContainer/LessonItemContainer";

import {
  preselectedDownloadType,
  preselectedResourceType,
  preselectedShareType,
  resourceFormValuesSchema,
} from "./downloadAndShare.schema";

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

// Form types

export type ResourceFormValues = z.infer<typeof resourceFormValuesSchema>;
export type ResourceFormProps = ResourceFormValues & {
  onSubmit: (values: ResourceFormValues) => Promise<string | void>;
};

export type ErrorKeysType = keyof Omit<ResourceFormProps, "onSubmit">;
