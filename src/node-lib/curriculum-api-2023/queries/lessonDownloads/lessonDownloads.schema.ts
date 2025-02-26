import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  quizQuestionSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  baseLessonDownloadsSchema,
  lessonDownloadsListSchema,
  lessonListSchema,
  lessonPathwaySchema,
} from "../../shared.schema";

export const nextLessonSchema = z.object({
  nextLessons: z.array(
    z.object({ lessonSlug: z.string(), lessonTitle: z.string() }),
  ),
});

export const lessonDownloadsSchema = z.object({
  ...baseLessonDownloadsSchema.shape,
  ...lessonPathwaySchema.shape,
  ...nextLessonSchema.shape,
});

export const downloadsAssetData = z.object({
  has_slide_deck_asset_object: z.boolean(),
  starter_quiz: z.array(quizQuestionSchema).nullable(),
  exit_quiz: z.array(quizQuestionSchema).nullable(),
  has_worksheet_asset_object: z.boolean(),
  has_worksheet_answers_asset_object: z.boolean(),
  has_worksheet_google_drive_downloadable_version: z.boolean(),
  has_supplementary_asset_object: z.boolean(),
  has_lesson_guide_object: z.boolean(),
  is_legacy: z.boolean(),
  expired: z.boolean().nullable().optional(),
  geo_restricted: z.boolean().nullable(),
  login_required: z.boolean().nullable(),
});

export const lessonDownloadsQueryRaw = z.object({
  download_assets: z.array(downloadsAssetData),
  unit_lessons: z.array(syntheticUnitvariantLessonsSchema),
});

export type LessonDownloadsListSchema = z.infer<
  typeof lessonDownloadsListSchema
>;
export type LessonDownloadsPageData = z.infer<typeof lessonDownloadsSchema>;
export type LessonListSchema = z.infer<typeof lessonListSchema>;
export type NextLessonSchema = z.infer<typeof nextLessonSchema>;
export type NextLesson = {
  lessonTitle: string;
  lessonSlug: string;
};

export default lessonDownloadsSchema;
