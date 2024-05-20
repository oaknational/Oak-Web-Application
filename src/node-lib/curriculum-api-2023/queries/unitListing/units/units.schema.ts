import { z } from "zod";

import { learningThemesSchema } from "../threads/threads.schema";

const aggregateSchema = z.object({
  count: z.number(),
});

export const lessonCounts = z.object({
  lessonCount: z.object({
    aggregate: aggregateSchema,
    nodes: z.array(
      z.object({
        unit_slug: z.string().nullish(),
        unit_data: z.number().nullish(),
      }),
    ),
  }),
  expiredLessonCount: z.object({
    aggregate: aggregateSchema,
    nodes: z.array(
      z.object({
        unit_slug: z.string().nullish(),
        unit_data: z.number().nullish(),
      }),
    ),
  }),
});

export type LessonCounts = z.infer<typeof lessonCounts>;

const unitData = z.object({
  slug: z.string(),
  title: z.string(),
  nullTitle: z.string(),
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  themeSlug: z.string().nullable(),
  themeTitle: z.string().nullable(),
  lessonCount: z.number().nullable(),
  quizCount: z.number().nullable(),
  unitStudyOrder: z.number(),
  expired: z.boolean().nullable(),
  expiredLessonCount: z.number().nullable(),
  yearTitle: z.string().nullable(),
  yearOrder: z.number(),
  cohort: z.string().nullish(),
  learningThemes: z.array(learningThemesSchema).nullable(),
});

export type UnitData = z.infer<typeof unitData>;

export const unitSchema = z.array(z.array(unitData).min(1));
export type UnitsForProgramme = z.infer<typeof unitSchema>;
