import { z } from "zod";

import { legacyAssetObjectSchema } from "../../shared.schema";

import { lessonShareSchema } from "@/node-lib/curriculum-api";

export const specialistLessonShareQueryResponseSchema = z.object({
  lesson_title: z.string(),
  unit_title: z.string(),
  expired: z.boolean().nullable(),
  worksheet_url: z.string().nullable(),
  starter_quiz: z.string().nullable(),
  worksheet_asset_object: legacyAssetObjectSchema,
  video_mux_playback_id: z.string().nullish(),
  video_title: z.string().nullish(),
  exit_quiz_asset_object: legacyAssetObjectSchema,
  presentation_url: z.string().nullish(),
  starter_quiz_asset_object: legacyAssetObjectSchema,
  slidedeck_asset_object: legacyAssetObjectSchema,
});

export const specialistLessonShareSchema = z.object({
  programmeSlug: z.string(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  shareableResources: z.array(lessonShareSchema),
  isLegacy: z.boolean(),
  expired: z.boolean().nullable(),
});

export type SpecialistLessonShareData = z.infer<
  typeof specialistLessonShareSchema
>;
export type SpecialistLessonShareResourceData = z.infer<
  typeof specialistLessonShareSchema
>;
