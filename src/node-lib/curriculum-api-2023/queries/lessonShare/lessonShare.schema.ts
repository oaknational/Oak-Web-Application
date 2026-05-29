import { z } from "zod";
import { lessonContentSchema } from "@oaknational/oak-curriculum-schema";

import {
  lessonShareResourceSchema,
  lessonShareResourceTypeSchema,
} from "../../shared.schema";

export const rawLessonShareSchema = z.object({
  expired: z.boolean().nullable(),
  ...lessonContentSchema.pick({
    lesson_title: true,
    starter_quiz: true,
    exit_quiz: true,
    video_mux_playback_id: true,
    video_duration: true,
    worksheet_asset_object_url: true,
  }).shape,
});

export type RawLessonShareSchema = z.infer<typeof rawLessonShareSchema>;

const baseLessonShareSchema = z.object({
  isSpecialist: z.literal(false),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  shareableResources: z.array(lessonShareResourceSchema),
  isLegacy: z.boolean(),
  expired: z.boolean().nullable(),
  lessonReleaseDate: z.string().nullable(),
  georestricted: z.boolean(),
  loginRequired: z.boolean(),
});

export const baseLessonBrowseSchema = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  subjectParent: z.string().nullable(),
  phaseSlug: z.string(),
  phaseTitle: z.string().nullish(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
  pathwaySlug: z.string().nullable(),
  pathwayTitle: z.string().nullish(),
  yearGroupTitle: z.string().nullish(),
});

export const lessonShareSchema = baseLessonShareSchema.extend({
  ...baseLessonBrowseSchema.shape,
});

export type LessonShareData = z.infer<typeof lessonShareSchema>;
export type LessonShareResourceDataType = z.infer<
  typeof lessonShareResourceTypeSchema
>;
export type LessonShareResourceData = z.infer<typeof lessonShareResourceSchema>;
