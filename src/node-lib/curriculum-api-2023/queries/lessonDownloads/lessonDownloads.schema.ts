import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  quizQuestionSchema,
  examboards,
  examboardSlugs,
  keystageDescriptions,
  keystageSlugs,
  pathwayDescriptions,
  phaseDescriptions,
  subjectSlugs,
  tierDescriptions,
  tierSlugs,
  yearDescriptions,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

import {
  baseLessonDownloadsSchema,
  lessonAdditionalFilesListSchema,
  lessonDownloadsListSchema,
  lessonListSchema,
} from "../../shared.schema";

export const nextLessonSchema = z.object({
  nextLessons: z.array(
    z.object({ lessonSlug: z.string(), lessonTitle: z.string() }),
  ),
});

export const lessonDownloadsSchema = z.object({
  ...baseLessonDownloadsSchema.shape,
  ...nextLessonSchema.shape,
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  keyStageSlug: keystageSlugs,
  keyStageTitle: keystageDescriptions,
  subjectSlug: subjectSlugs,
  subjectTitle: z.string(),
  phaseTitle: phaseDescriptions,
  lessonCohort: z.string().nullish(),
  examBoardSlug: examboardSlugs.nullable(),
  examBoardTitle: examboards.nullable(),
  tierSlug: tierSlugs.nullable(),
  tierTitle: tierDescriptions.nullable(),
  yearGroupSlug: yearSlugs,
  yearGroupTitle: yearDescriptions,
  pathwayTitle: pathwayDescriptions.nullable(),
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
