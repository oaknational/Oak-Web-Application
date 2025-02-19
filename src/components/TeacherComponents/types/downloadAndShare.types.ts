import { z } from "zod";

import {
  preselectedDownloadType,
  preselectedResourceType,
  preselectedShareType,
  resourceFormValuesSchema,
  resourceFormValuesWithRiskAssessmentSchema,
} from "@/components/TeacherComponents/downloadAndShare.schema";
import { LessonItemTitle } from "@/components/TeacherComponents/LessonItemContainer";
import {
  LessonShareData,
  LessonShareResourceData,
} from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

// Resource types

export type Resources =
  | LessonDownloadsPageData["downloads"]
  | LessonShareData["shareableResources"];

export type ResourceType =
  | LessonShareResourceData["type"]
  | DownloadResourceType;

export type DownloadResourceType =
  LessonDownloadsPageData["downloads"][number]["type"];

export type ResourcesToDownloadArrayType = DownloadResourceType[];
export type ShareResourceType = LessonShareResourceData["type"];

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
export type DownloadableLessonTitles = Exclude<
  LessonItemTitle,
  "Demonstration videos" | "Audio clips" | "Video & audio clips"
>;

export type ExpandingContainerTitle =
  | "Slide deck"
  | "Exit quiz"
  | "Starter quiz"
  | "Worksheet"
  | "Lesson video"
  | "Transcript"
  | "Lesson overview"
  | "Additional material";

export type CombinedDownloadsShareType = Record<
  ExpandingContainerTitle | DownloadableLessonTitles,
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

export type ResourceFormWithRiskAssessmentValues = z.infer<
  typeof resourceFormValuesWithRiskAssessmentSchema
>;
export type ResourceFormWithRiskAssessmentProps =
  ResourceFormWithRiskAssessmentValues & {
    onSubmit: (
      values: ResourceFormWithRiskAssessmentValues,
    ) => Promise<string | void>;
  };
export type ErrorKeysWithRiskAssessmentType = keyof Omit<
  ResourceFormWithRiskAssessmentProps,
  "onSubmit"
>;
