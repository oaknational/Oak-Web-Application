import { z } from "zod";
import {
  keystageDescriptions,
  keystageSlugs,
  subjectSlugs,
  subjects,
  yearDescriptions,
} from "@oaknational/oak-curriculum-schema";

import { learningThemesSchema } from "../threads/threads.schema";

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
  yearTitle: yearDescriptions.nullable(),
  yearOrder: z.number(),
  cohort: z.string().nullish(),
  learningThemes: z.array(learningThemesSchema).nullable(),
});

export type UnitData = z.infer<typeof unitData>;

export const unitSchema = z.array(z.array(unitData));
export type UnitsForProgramme = z.infer<typeof unitSchema>;
