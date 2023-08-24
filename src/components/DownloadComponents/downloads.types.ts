import { z } from "zod";

import { ExpandingContainerTitle } from "../ExpandingContainer/ExpandingContainer";
import { LessonItemTitle } from "../LessonItemContainer/LessonItemContainer";

const DOWNLOAD_RESOURCE_TYPES = [
  "presentation",
  "intro-quiz-questions",
  "intro-quiz-answers",
  "exit-quiz-questions",
  "exit-quiz-answers",
  "worksheet-pdf",
  "worksheet-pptx",
] as const;

export const preselectedDownloadType = z.union([
  z.literal("slide deck"),
  z.literal("exit quiz"),
  z.literal("starter quiz"),
  z.literal("worksheet"),
  z.literal("all"),
]);

export type PreselectedDownloadType = z.infer<typeof preselectedDownloadType>;

export const preselectedDownloadTypeMap: Record<
  PreselectedDownloadType,
  DownloadResourceType[] | "all"
> = {
  "slide deck": ["presentation"],
  "starter quiz": ["intro-quiz-questions", "intro-quiz-answers"],
  "exit quiz": ["exit-quiz-questions", "exit-quiz-answers"],
  worksheet: ["worksheet-pdf", "worksheet-pptx"],
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
  "Additional material": null,
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
        message: "Please select a school or one of the alternative options",
      }),
    })
    .min(1, "Please select a school or one of the alternative options"),
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
      message: "You must accept our terms of use to download the content",
    }),
  }),
  downloads: z
    .array(z.string(), {
      errorMap: () => ({
        message: "Please select at least one lesson resource to download",
      }),
    })
    .min(1),
});

export type DownloadFormValues = z.infer<typeof schema>;

export type DownloadFormProps = DownloadFormValues & {
  onSubmit: (values: DownloadFormValues) => Promise<string | void>;
};

export type ErrorKeysType = keyof Omit<DownloadFormProps, "onSubmit">;
