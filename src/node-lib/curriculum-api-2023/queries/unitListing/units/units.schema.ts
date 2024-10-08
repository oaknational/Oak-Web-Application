import { z } from "zod";
import {
  keystageDescriptions,
  keystageSlugs,
  subjectSlugs,
  subjects,
  yearDescriptions,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

import { learningThemesSchema } from "../filters/threads.schema";

const unitData = z.object({
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
  subjectCategories: z
    .array(z.object({ label: z.string(), slug: z.string() }))
    .nullish(),
});

export type UnitData = z.infer<typeof unitData>;

export const unitSchema = z.array(z.array(unitData));
export type UnitsForProgramme = z.infer<typeof unitSchema>;
