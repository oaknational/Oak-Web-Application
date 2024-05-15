import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

export const rawTierResponseSchema = z.array(
  z.object({
    programme_fields: programmeFieldsSchema,
    programme_slug: z.string(),
  }),
);

export const tierCounts = z.object({
  lessonCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
    nodes: z.array(z.object({ programme_fields: z.string() })),
  }),
  unitCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
    nodes: z.array(z.object({ programme_fields: z.string() })),
  }),
});

export type TierCounts = z.infer<typeof tierCounts>;

export const batchResultResponseArray = z.array(
  z.object({
    data: tierCounts,
  }),
);

export type BatchResultResponseArray = z.infer<typeof batchResultResponseArray>;

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

export const tierSchema = z.array(
  z.object({
    tierSlug: z.string(),
    tierTitle: z.string(),
    tierProgrammeSlug: z.string(),
    unitCount: z.number().nullish(),
    lessonCount: z.number().nullish(),
  }),
);
const unitListingData = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  examBoardSlug: z.string().nullable(),
  examBoardTitle: z.string().nullable(),
  lessonCount: z.number().nullish(),
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
  lessonCount: z.number().nullish(),
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
