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

export type PreselectedShareType = Exclude<
  z.infer<typeof preselectedResourceType>,
  "slide deck" | "additional material"
>;

export type ShareResourceType = LessonShareSchema["type"];

export const preselectedDownloadTypeMap: Record<
  PreselectedDownloadType,
  DownloadResourceType[] | "all"
> = {
  "slide deck": ["presentation"],
  "starter quiz": ["intro-quiz-questions", "intro-quiz-answers"],
  "exit quiz": ["exit-quiz-questions", "exit-quiz-answers"],
  worksheet: ["worksheet-pdf", "worksheet-pptx"],
  "additional material": ["supplementary-pdf", "supplementary-docx"],
  all: "all",
};

export const preselectedShareTypeMap: Record<
  PreselectedShareType,
  LessonShareSchema["type"][] | "all"
> = {
  "starter quiz": ["intro-quiz-questions"],
  "exit quiz": ["exit-quiz-questions"],
  worksheet: ["worksheet-pdf"],
  video: ["video"],
  all: "all",
};

export const containerTitleToPreselectMap: Record<
  ExpandingContainerTitle | LessonItemTitle,
  PreselectedDownloadType | null
> = {
  "Slide deck": "slide deck",
  "Exit quiz": "exit quiz",
  "Starter quiz": "starter quiz",
  "Lesson overview": null,
  "Lesson details": null,
  "Additional material": "additional material",
  Worksheet: "worksheet",
  Transcript: null,
  Video: null,
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
