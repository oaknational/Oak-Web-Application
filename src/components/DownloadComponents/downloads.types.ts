import { z } from "zod";

export type DownloadResourceType =
  | "presentation"
  | "intro-quiz-questions"
  | "intro-quiz-answers"
  | "exit-quiz-questions"
  | "exit-quiz-answers"
  | "worksheet-pdf"
  | "worksheet-pptx";

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
