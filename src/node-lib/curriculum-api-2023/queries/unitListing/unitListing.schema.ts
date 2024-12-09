import { z } from "zod";
import {
  examboardSlugs,
  examboards,
  keystageDescriptions,
  keystageSlugs,
  phaseSlugs,
  subjectSlugs,
  subjects,
  tierSlugs,
  yearDescriptions,
  yearSlugs,
  syntheticUnitvariantsWithLessonIdsByKsSchema,
  ProgrammeFields,
  tierDescriptions,
} from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const learningThemesSchema = z.object({
  themeTitle: z.string(),
  themeSlug: z.string(),
});
export const learningThemes = z.array(learningThemesSchema);
export type LearningThemes = z.infer<typeof learningThemes>;

const subjectCategorySchema = z.object({
  label: z.string(),
  slug: z.string().optional(),
  iconName: z.string().optional().nullable(),
});
export type SubjectCategory = z.infer<typeof subjectCategorySchema>;

const reshapedUnitData = z.object({
  slug: z.string(),
  title: z.string(),
  nullTitle: z.string(),
  programmeSlug: z.string(),
  keyStageSlug: keystageSlugs,
  keyStageTitle: keystageDescriptions,
  subjectSlug: subjectSlugs,
  subjectTitle: subjects,
  lessonCount: z.number().nullable(),
  unitStudyOrder: z.number(),
  expired: z.boolean().nullable(),
  expiredLessonCount: z.number().nullable(),
  yearTitle: yearDescriptions,
  year: yearSlugs,
  yearOrder: z.number(),
  cohort: z.string().nullish(),
  learningThemes: z.array(learningThemesSchema).nullable(),
  subjectCategories: z.array(subjectCategorySchema).nullish(),
});

export type ReshapedUnitData = z.infer<typeof reshapedUnitData>;
export const groupedUnitsSchema = z.array(z.array(reshapedUnitData));
export type GroupedUnitsSchema = z.infer<typeof groupedUnitsSchema>;

export const rawQuerySchema = syntheticUnitvariantsWithLessonIdsByKsSchema
  .omit({
    null_unitvariant_id: true,
    programme_slug_by_year: true,
    base_slug: true,
    lesson_ids: true,
  })
  .array();

export type UnitsSnake = z.infer<typeof rawQuerySchema>;
export type UnitSnake = z.infer<typeof rawQuerySchema>[0];
export type UnitsCamel = ConvertKeysToCamelCase<UnitsSnake>;
export type ProgrammeFieldsCamel = ConvertKeysToCamelCase<ProgrammeFields>;

const tierSchema = z.array(
  z.object({
    tierSlug: tierSlugs,
    tierTitle: tierDescriptions,
    tierProgrammeSlug: z.string(),
    unitCount: z.number().nullish(),
    lessonCount: z.number().nullish(),
    tierOrder: z.number().nullable(),
  }),
);

export type Tiers = z.infer<typeof tierSchema>;

// reshaped output of the unitListing query
const unitListingData = z.object({
  programmeSlug: z.string(),
  keyStageSlug: keystageSlugs,
  keyStageTitle: keystageDescriptions,
  examBoardSlug: examboardSlugs.nullable(),
  examBoardTitle: examboards.nullable(),
  lessonCount: z.number().nullish(),
  subjectSlug: subjectSlugs,
  subjectTitle: subjects,
  subjectParent: subjects.nullable(),
  tierSlug: tierSlugs.nullable(),
  tiers: tierSchema,
  units: groupedUnitsSchema,
  hasNewContent: z.boolean(),
  learningThemes: learningThemes,
  phase: phaseSlugs,
  yearGroups: z.array(
    z.object({ year: yearSlugs, yearTitle: yearDescriptions }),
  ),
  subjectCategories: z.array(subjectCategorySchema),
});

export type UnitListingData = z.infer<typeof unitListingData>;
