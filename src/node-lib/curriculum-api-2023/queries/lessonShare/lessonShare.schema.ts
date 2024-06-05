import { z } from "zod";
import {
  programmeFieldsSchema,
  quizQuestionSchema,
} from "@oaknational/oak-curriculum-schema";

import { lessonShareResourceSchema } from "../../shared.schema";

export const rawLessonShareSchema = z.object({
  lesson_title: z.string(),
  expired: z.boolean().nullable(),
  starter_quiz: z.array(quizQuestionSchema).nullable(),
  exit_quiz: z.array(quizQuestionSchema).nullable(),
  video_mux_playback_id: z.string().nullable(),
  worksheet_asset_object_url: z.string().nullable(),
});

export const rawShareBrowseData = z.object({
  unit_title: z.string(),
  is_legacy: z.boolean(),
  programme_fields: programmeFieldsSchema,
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
