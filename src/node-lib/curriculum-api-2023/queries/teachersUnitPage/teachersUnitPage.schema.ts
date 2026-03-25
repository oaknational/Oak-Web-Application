import { z } from "zod";
import {
  programmeFieldsSchema,
  syntheticUnitvariantLessonsByKsSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  lessonListItemSchema,
  lessonListSchema,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const unitPageDataSchema = z.object({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitvariantId: z.number(),
  unitTitle: z.string(),
  subjectSlug: programmeFieldsSchema.shape.subject_slug,
  subjectTitle: programmeFieldsSchema.shape.subject,
  parentSubject: programmeFieldsSchema.shape.subject_parent,
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

export type TeachersUnitPageData = z.infer<typeof unitPageDataSchema>;

export const modifiedResponseSchema =
  syntheticUnitvariantLessonsByKsSchema.omit({ is_legacy: true });
export const modifiedResponseSchemaArray = z.array(modifiedResponseSchema);
