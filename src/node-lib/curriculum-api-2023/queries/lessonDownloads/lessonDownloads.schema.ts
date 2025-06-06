import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  quizQuestionSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  baseLessonDownloadsSchema,
  lessonAdditionalFilesListSchema,
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

export const additionalFile = z.object({
  asset_id: z.number(),
  media_id: z.number(),
  media_object: z.object({
    url: z.string(),
    bytes: z.number(),
    display_name: z.string(),
  }),
});

export const additionalFiles = z.array(additionalFile);

export const downloadsAssetDataSchema = z.object({
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
  downloadable_files: z.array(additionalFile).nullish(),
  lesson_release_date: z.string().nullish(),
});

export const lessonDownloadsQueryRaw = z.object({
  download_assets: z.array(downloadsAssetDataSchema),
  unit_lessons: z.array(syntheticUnitvariantLessonsSchema),
});

export type LessonDownloadsListSchema = z.infer<
  typeof lessonDownloadsListSchema
>;
export type LessonAdditionalFilesListSchema = z.infer<
  typeof lessonAdditionalFilesListSchema
>;
export type LessonDownloadsPageData = z.infer<typeof lessonDownloadsSchema>;
export type AdditionalFile = z.infer<typeof additionalFile>;
export type AdditionalFiles = z.infer<typeof additionalFiles>;
export type LessonListSchema = z.infer<typeof lessonListSchema>;
export type NextLessonSchema = z.infer<typeof nextLessonSchema>;
export type NextLesson = {
  lessonTitle: string;
  lessonSlug: string;
};

export default lessonDownloadsSchema;
