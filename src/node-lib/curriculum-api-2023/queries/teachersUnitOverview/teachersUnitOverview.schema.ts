import { z } from "zod";
import {
  ProgrammeFields,
  programmeFieldsSchema,
  syntheticUnitvariantLessonsByKsSchema,
  threadSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  lessonListItemSchema,
  lessonListSchema,
} from "@/node-lib/curriculum-api-2023/shared.schema";

const neighbourUnitSchema = z
  .object({ title: z.string(), slug: z.string() })
  .nullable();

export type NeighbourUnit = z.infer<typeof neighbourUnitSchema>;

const programmeToggleSchema = z.array(
  z.object({
    title: z.string(),
    programmeSlug: z.string(),
    isSelected: z.boolean(),
  }),
);
export type ProgrammeToggles = z.infer<typeof programmeToggleSchema>;

const unitDataSchema =
  syntheticUnitvariantLessonsByKsSchema.shape.unit_data.extend({
    why_this_why_now: z.string().nullish(),
  });
export const modifiedLessonsResponseSchema =
  syntheticUnitvariantLessonsByKsSchema
    .omit({ is_legacy: true })
    .extend({ unit_data: unitDataSchema });

export const modifiedLessonsResponseSchemaArray = z.array(
  modifiedLessonsResponseSchema,
);

export const unitsInOtherProgrammesResponseSchema = z.array(
  z.object({
    programme_slug: z.string(),
    programme_fields: programmeFieldsSchema,
  }),
);
export type UnitsInOtherProgrammes = z.infer<
  typeof unitsInOtherProgrammesResponseSchema
>;

export const unitSequenceResponseSchema = z.array(
  z.object({
    unitSlug: z.string(),
    unitTitle: z.string(),
    unitDescription: z.string().nullable(),
    unitOrder: z.number(),
    subjectCategories: z.array(z.string()).nullish(),
    optionalityTitle: z.string().nullish(),
    nullUnitvariantId: z.number(),
    yearOrder: z.number(),
    year: programmeFieldsSchema.shape.year,
    isSwimming: z.boolean().nullish(),
  }),
);
export type UnitSequence = z.infer<typeof unitSequenceResponseSchema>;

export const threadsResponseSchema = z.array(
  z.object({
    threads: z.array(threadSchema).nullable(),
  }),
);
export type Threads = z.infer<typeof threadsResponseSchema>;

export type PackagedUnitData = {
  programmeFields: ProgrammeFields;
  unitSlug: string;
  unitvariantId: number;
  programmeSlug: string;
  unitTitle: string;
  unitDescription: string | null;
  programmeSlugByYear: string[];
  nullUnitvariantId: number;
  subjectCategories: string[] | null | undefined;
  whyThisWhyNow: string | null | undefined;
  priorKnowledgeRequirements: string[] | null | undefined;
};

export const subjectCategoriesSchema = z
  .array(
    z.object({
      id: z.number(),
      title: z.string(),
      category: z.string().optional(),
      slug: z.string(),
    }),
  )
  .nullish();
export type SubjectCategories = z.infer<typeof subjectCategoriesSchema>;

export const unitOverviewDataSchema = z.object({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitvariantId: z.number(),
  unitTitle: z.string(),
  unitDescription: z.string().nullable(),
  unitIndex: z.number(),
  unitCount: z
    .number()
    .describe(
      "The number of units in the programme sequence for the current unit's year",
    ),
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
  phaseSlug: programmeFieldsSchema.shape.phase_slug,
  phaseTitle: programmeFieldsSchema.shape.phase_description,
  lessons: lessonListSchema,
  actions: lessonListItemSchema.shape.actions.nullable(),
  containsGeorestrictedLessons: z.boolean().optional(),
  containsLoginRequiredLessons: z.boolean().optional(),
  priorKnowledgeRequirements:
    modifiedLessonsResponseSchema.shape.unit_data.shape
      .prior_knowledge_requirements,
  whyThisWhyNow:
    modifiedLessonsResponseSchema.shape.unit_data.shape.why_this_why_now,
  nextUnit: neighbourUnitSchema,
  prevUnit: neighbourUnitSchema,
  tierOptionToggles: programmeToggleSchema,
  subjectOptionToggles: programmeToggleSchema,
  threads: z.array(z.string()),
});

export type TeachersUnitOverviewData = z.infer<typeof unitOverviewDataSchema>;
