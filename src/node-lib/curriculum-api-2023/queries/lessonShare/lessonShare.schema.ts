import { z } from "zod";
import {
  lessonContentSchema,
  syntheticUnitvariantLessonsByKsSchema,
} from "@oaknational/oak-curriculum-schema";

import { lessonShareResourceSchema } from "../../shared.schema";

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

export const rawShareBrowseData = z.object({
  unit_title: z.string(),
  ...syntheticUnitvariantLessonsByKsSchema.pick({
    is_legacy: true,
    programme_fields: true,
  }).shape,
});

export type RawLessonShareSchema = z.infer<typeof rawLessonShareSchema>;

export const lessonShareSchema = z.object({
  isSpecialist: z.literal(false),
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
  shareableResources: z.array(lessonShareResourceSchema),
  isLegacy: z.boolean(),
  expired: z.boolean().nullable(),
});

export type LessonShareData = z.infer<typeof lessonShareSchema>;
export type LessonShareResourceData = z.infer<typeof lessonShareResourceSchema>;
