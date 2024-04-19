import { z } from "zod";

const learningThemesSchema = z.object({
  themeTitle: z.string().nullable(),
  themeSlug: z.string().nullable(),
});

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
  cohort: z.string().nullish(),
  learningThemes: z.array(learningThemesSchema).nullable(),
});

export type UnitData = z.infer<typeof unitData>;

const unitSchema = z.array(z.array(unitData));

const tierSchema = z.array(
  z.object({
    tierSlug: z.string(),
    tierTitle: z.string(),
    tierProgrammeSlug: z.string(),
    unitCount: z.number().nullable().optional(),
    lessonCount: z.number().nullable().optional(),
  }),
);
const unitListingData = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  examBoardSlug: z.string().nullable(),
  examBoardTitle: z.string().nullable(),
  lessonCount: z.number().nullable().optional(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  totalUnitCount: z.number(),
  tiers: tierSchema,
  units: unitSchema,
  hasNewContent: z.boolean().nullish(),
  learningThemes: z
    .array(
      z.object({
        themeTitle: z.string().nullable(),
        themeSlug: z.string().nullable(),
      }),
    )
    .nullable(),
});

export type UnitListingData = z.infer<typeof unitListingData>;

export type TierSchema = z.infer<typeof tierSchema>;

const unitListingSchema = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  examBoardSlug: z.string().nullable(),
  examBoardTitle: z.string().nullable(),
  lessonCount: z.number().nullable().optional(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  totalUnitCount: z.number(),
  tiers: tierSchema,
  units: unitSchema,
  learningThemes: z.array(learningThemesSchema).nullable(),
  hasNewContent: z.boolean().nullish(),
});

export type UnitListingPageData = z.infer<typeof unitListingSchema>;

export default unitListingSchema;
