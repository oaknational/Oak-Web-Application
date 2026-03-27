import { z } from "zod";
import {
  ProgrammeFields,
  programmeFieldsSchema,
  syntheticUnitvariantLessonsByKsSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  lessonListItemSchema,
  lessonListSchema,
} from "@/node-lib/curriculum-api-2023/shared.schema";

const neighbourUnitSchema = z
  .object({ title: z.string(), slug: z.string() })
  .nullable();

export const unitOverviewDataSchema = z.object({
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
  nextUnit: neighbourUnitSchema,
  prevUnit: neighbourUnitSchema,
});

export type TeachersUnitOverviewData = z.infer<typeof unitOverviewDataSchema>;

export const modifiedLessonsResponseSchema =
  syntheticUnitvariantLessonsByKsSchema.omit({ is_legacy: true });
export const modifiedLessonsResponseSchemaArray = z.array(
  modifiedLessonsResponseSchema,
);

export const unitSequenceResponseSchema = z.array(
  z.object({
    unitSlug: z.string(),
    unitTitle: z.string(),
    unitOrder: z.number(),
    optionalityTitle: z.string().nullish(),
    nullUnitvariantId: z.number(),
    yearOrder: z.number(),
  }),
);
export type UnitSequence = z.infer<typeof unitSequenceResponseSchema>;

export type PackagedUnitData = {
  programmeFields: ProgrammeFields;
  unitSlug: string;
  unitvariantId: number;
  programmeSlug: string;
  unitTitle: string;
  programmeSlugByYear: string[];
  nullUnitvariantId: number;
};
