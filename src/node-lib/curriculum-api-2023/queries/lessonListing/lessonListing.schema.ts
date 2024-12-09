import { z } from "zod";
import {
  programmeFieldsSchema,
  syntheticUnitvariantLessonsSchema,
  actionsSchema,
} from "@oaknational/oak-curriculum-schema";

import { lessonListSchema } from "../../shared.schema";
import { zodToCamelCase } from "../../helpers/zodToCamelCase";

const camelActionSchema = zodToCamelCase(actionsSchema);

export type Actions = z.infer<typeof camelActionSchema>;

const lessonListingSchema = z.object({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: programmeFieldsSchema.shape.subject_slug,
  subjectTitle: programmeFieldsSchema.shape.subject,
  yearTitle: programmeFieldsSchema.shape.year_description,
  yearSlug: programmeFieldsSchema.shape.year_slug,
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
  actions: camelActionSchema,
});

export type lessonListingSchema = z.infer<typeof lessonListingSchema> & {
  actions: Actions | null;
};

export type LessonListingPageData = z.infer<typeof lessonListingSchema>;

export const partialSyntheticUnitvariantLessonsSchema = z.object({
  ...syntheticUnitvariantLessonsSchema.omit({
    supplementary_data: true,
  }).shape,
  order_in_unit: z.number(),
});

export const partialSyntheticUnitvariantLessonsArraySchema = z.array(
  partialSyntheticUnitvariantLessonsSchema,
);

export type PartialSyntheticUnitvariantLessons = z.infer<
  typeof partialSyntheticUnitvariantLessonsSchema
>;

export default lessonListingSchema;
