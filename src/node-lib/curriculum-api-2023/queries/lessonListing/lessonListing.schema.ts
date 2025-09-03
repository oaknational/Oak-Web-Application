import { z } from "zod";
import {
  programmeFieldsSchema,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  lessonListItemSchema,
  lessonListSchema,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const lessonListingPageDataSchema = z.object({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitvariantId: z.number(),
  unitTitle: z.string(),
  subjectSlug: programmeFieldsSchema.shape.subject_slug,
  subjectTitle: programmeFieldsSchema.shape.subject,
  yearTitle: programmeFieldsSchema.shape.year_description,
  yearSlug: programmeFieldsSchema.shape.year_slug,
  year: programmeFieldsSchema.shape.year,
  keyStageSlug: programmeFieldsSchema.shape.keystage_slug,
  keyStageTitle: programmeFieldsSchema.shape.keystage_description,
  tierSlug: programmeFieldsSchema.shape.tier_slug,
  tierTitle: programmeFieldsSchema.shape.tier_description,
  examBoardSlug: programmeFieldsSchema.shape.examboard_slug,
  examBoardTitle: programmeFieldsSchema.shape.examboard,
  pathwaySlug: programmeFieldsSchema.shape.pathway_slug,
  pathwayTitle: programmeFieldsSchema.shape.pathway,
  pathwayDisplayOrder: programmeFieldsSchema.shape.pathway_display_order,
  lessons: lessonListSchema,
  actions: lessonListItemSchema.shape.actions.nullable(),
  containsGeorestrictedLessons: z.boolean().optional(),
  containsLoginRequiredLessons: z.boolean().optional(),
});

export type LessonListingPageData = z.infer<typeof lessonListingPageDataSchema>;

export const partialSyntheticUnitvariantLessonsSchema = z.object({
  ...syntheticUnitvariantLessonsSchema
    .extend({
      lesson_data: syntheticUnitvariantLessonsSchema.shape.lesson_data.omit({
        media_clips: true, // omit the media_clips field from lesson_data
      }),
    })
    .omit({
      supplementary_data: true, // omit supplementary_data from the root schema
    }).shape,
  order_in_unit: z.number(),
});

export const partialSyntheticUnitvariantLessonsArraySchema = z.array(
  partialSyntheticUnitvariantLessonsSchema,
);

export type PartialSyntheticUnitvariantLessons = z.infer<
  typeof partialSyntheticUnitvariantLessonsSchema
>;
