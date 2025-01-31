import { z } from "zod";

export const preselectedResourceBaseType = z.union([
  z.literal("exit quiz"),
  z.literal("starter quiz"),
  z.literal("worksheet"),
  z.literal("all"),
]);

export const preselectedDownloadType = z.union([
  preselectedResourceBaseType,
  z.union([
    z.literal("worksheet"),
    z.literal("additional material"),
    z.literal("slide deck"),
  ]),
]);

export const preselectedShareType = z.union([
  preselectedResourceBaseType,
  z.literal("video"),
]);

export const preselectedResourceType = z.union([
  preselectedShareType,
  preselectedDownloadType,
]);

export const resourceFormValuesSchema = z.object({
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
