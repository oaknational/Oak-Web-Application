import { z } from "zod";
import {
  examboards,
  examboardSlugs,
  keystageDescriptions,
  keystageSlugs,
  lessonContentSchema,
  pathwayDescriptions,
  pathwaySlugs,
  phaseDescriptions,
  phaseSlugs,
  subjectSlugs,
  tierDescriptions,
  tierSlugs,
  yearDescriptions,
  years,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

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
  keyStageSlug: keystageSlugs,
  keyStageTitle: keystageDescriptions,
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: subjectSlugs,
  subjectTitle: z.string(),
  subjectParent: z.string().nullable(),
  phaseSlug: phaseSlugs,
  phaseTitle: phaseDescriptions,
  year: years,
  examBoardSlug: examboardSlugs.nullable(),
  examBoardTitle: examboards.nullable(),
  tierSlug: tierSlugs.nullable(),
  tierTitle: tierDescriptions.nullable(),
  pathwaySlug: pathwaySlugs.nullable(),
  pathwayTitle: pathwayDescriptions.nullable(),
  yearGroupTitle: yearDescriptions,
  yearGroupSlug: yearSlugs,
});

export const lessonShareSchema = baseLessonShareSchema.extend({
  ...baseLessonBrowseSchema.shape,
});

export type LessonShareData = z.infer<typeof lessonShareSchema>;
export type LessonShareResourceDataType = z.infer<
  typeof lessonShareResourceTypeSchema
>;
export type LessonShareResourceData = z.infer<typeof lessonShareResourceSchema>;
