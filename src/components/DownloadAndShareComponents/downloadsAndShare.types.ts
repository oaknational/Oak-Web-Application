import { z } from "zod";

import { ExpandingContainerTitle } from "../ExpandingContainer/ExpandingContainer";
import { LessonItemTitle } from "../LessonItemContainer/LessonItemContainer";

import {
  LessonDownloadsData,
  LessonShareData,
  LessonShareSchema,
} from "@/node-lib/curriculum-api";

export type Resources =
  | LessonDownloadsData["downloads"]
  | LessonShareData["shareableResources"];

export type ResourceType = LessonShareSchema["type"] | DownloadResourceType;

const DOWNLOAD_RESOURCE_TYPES = [
  "presentation",
  "intro-quiz-questions",
  "intro-quiz-answers",
  "exit-quiz-questions",
  "exit-quiz-answers",
  "worksheet-pdf",
  "worksheet-pptx",
  "supplementary-pdf",
  "supplementary-docx",
] as const;

export const preselectedResourceType = z.union([
  z.literal("slide deck"),
  z.literal("exit quiz"),
  z.literal("starter quiz"),
  z.literal("worksheet"),
  z.literal("additional material"),
  z.literal("video"),
  z.literal("all"),
]);

export const preselectedDownloadType = z.union([
  z.literal("slide deck"),
  z.literal("exit quiz"),
  z.literal("starter quiz"),
  z.literal("worksheet"),
  z.literal("additional material"),
  z.literal("all"),
]);

export const preselectedShareType = z.union([
  z.literal("exit quiz"),
  z.literal("starter quiz"),
  z.literal("worksheet"),
  z.literal("video"),
  z.literal("all"),
]);

export type PreselectedResourceType = z.infer<typeof preselectedResourceType>;

export type PreselectedDownloadType = Exclude<
  z.infer<typeof preselectedResourceType>,
  "video"
>;

export const isPreselectedDownloadType = (
  preselected: PreselectedDownloadType | PreselectedShareType | null,
): preselected is PreselectedDownloadType => {
  return (
    preselectedDownloadType.safeParse(preselected).success &&
    preselected !== "video"
  );
};

export const isPreselectedShareType = (
  preselected: PreselectedDownloadType | PreselectedShareType | null,
): preselected is PreselectedShareType => {
  return preselectedShareType.safeParse(preselected).success;
};

export type PreselectedShareType = Exclude<
  z.infer<typeof preselectedResourceType>,
  "slide deck" | "additional material"
>;

export type ShareResourceType = LessonShareSchema["type"];

type CombinedPreselectedTypeMap = Record<
  PreselectedDownloadType | PreselectedShareType,
  {
    downloadType?: DownloadResourceType[] | "all";
    shareType?: LessonShareSchema["type"][] | "all";
  }
>;

export const combinedPreselectedTypeMap: CombinedPreselectedTypeMap = {
  "slide deck": { downloadType: ["presentation"] },
  "starter quiz": {
    downloadType: ["intro-quiz-questions", "intro-quiz-answers"],
    shareType: ["intro-quiz-questions"],
  },
  "exit quiz": {
    downloadType: ["exit-quiz-questions", "exit-quiz-answers"],
    shareType: ["exit-quiz-questions"],
  },
  worksheet: {
    downloadType: ["worksheet-pdf", "worksheet-pptx"],
    shareType: ["worksheet-pdf"],
  },
  "additional material": {
    downloadType: ["supplementary-pdf", "supplementary-docx"],
  },
  all: { downloadType: "all", shareType: "all" },
  video: { shareType: ["video"] },
};

type CombinedDownloadsShareType = Record<
  ExpandingContainerTitle | LessonItemTitle,
  {
    downloadType: PreselectedDownloadType | null;
    shareType: PreselectedShareType | null;
  }
>;

export const containerTitleToPreselectMap: CombinedDownloadsShareType = {
  "Slide deck": { downloadType: "slide deck", shareType: null },
  "Exit quiz": { downloadType: "exit quiz", shareType: "exit quiz" },
  "Starter quiz": { downloadType: "starter quiz", shareType: "starter quiz" },
  "Lesson overview": { downloadType: null, shareType: null },
  "Lesson details": { downloadType: null, shareType: null },
  "Additional material": {
    downloadType: "additional material",
    shareType: null,
  },
  Worksheet: { downloadType: "worksheet", shareType: "worksheet" },
  Transcript: { downloadType: null, shareType: null },
  Video: { downloadType: null, shareType: "video" },
};

export type DownloadResources = typeof DOWNLOAD_RESOURCE_TYPES;
export type DownloadResourceType = DownloadResources[number];

export type ResourcesToDownloadArrayType = DownloadResourceType[];

export const schema = z.object({
  school: z
    .string({
      errorMap: () => ({
        message:
          "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
      }),
    })
    .min(
      1,
      "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
    ),
  schoolName: z.string().optional(),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address",
    })
    .optional()
    .or(z.literal("")),
  terms: z.literal(true, {
    errorMap: () => ({
      message: "Accept terms and conditions to continue",
    }),
  }),
  resources: z
    .array(z.string(), {
      errorMap: () => ({
        message: "Select at least one lesson resource to continue",
      }),
    })
    .min(1),
});

export type ResourceFormValues = z.infer<typeof schema>;

export type ResourceFormProps = ResourceFormValues & {
  onSubmit: (values: ResourceFormValues) => Promise<string | void>;
};

export type ErrorKeysType = keyof Omit<ResourceFormProps, "onSubmit">;
