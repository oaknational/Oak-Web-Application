import { z } from "zod";

const themeSchema = z.object({
  themeSlug: z.string().nullish(),
  themeTitle: z.string().nullish(),
});

export const combinedProgrammeFields = z.object({
  subject: z.string(),
  subject_slug: z.string(),
  subject_type: z.string(),
  subject_parent: z.string(),
  developmentstage: z.string().nullish(),
  developmentstage_slug: z.string().nullish(),
  phase_slug: z.string().nullish(),
  phase: z.string().nullish(),
  developmentstage_display_order: z.number().nullish(),
});

export const specialistUnitListRequestSchema = z.array(
  z.object({
    contains_copyright_content: z.boolean(),
    expired: z.boolean().nullish(),
    synthetic_programme_slug: z.string(),
    unit_slug: z.string(),
    unit_title: z.string(),
    order_in_programme: z.number(),
    combined_programme_fields: combinedProgrammeFields,
    threads: z.array(themeSchema).nullish(),
  }),
);

export type SpecialistUnitListRequestSchema = z.infer<
  typeof specialistUnitListRequestSchema
>;

export const specialistUnitLessonCount = z.object({
  specialistUnitLessonCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  specialistUnitExpiredLessonCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
});

export type SpecialistUnitLessonCount = z.infer<
  typeof specialistUnitLessonCount
>;

export const developmentStageUnitCount = z.object({
  developmentStageUnitCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  developmentStageLessonCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
});

export const developmentStageCombinedProgrammeFields = z.array(
  z.object({
    combined_programme_fields: combinedProgrammeFields,
    synthetic_programme_slug: z.string(),
  }),
);

export type DevelopmentStageCombinedProgrammeFields = z.infer<
  typeof developmentStageCombinedProgrammeFields
>;

export type DevelopmentStageUnitCount = z.infer<
  typeof developmentStageUnitCount
>;

const batchResultSchema = z.union([
  specialistUnitLessonCount,
  developmentStageUnitCount,
]);

export const batchResultResponse = z.object({
  data: batchResultSchema,
});

export const batchResultResponseArray = z.array(batchResultResponse);

export type BatchResultResponseArray = z.infer<typeof batchResultResponseArray>;

export const developmentStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  unitCount: z.number().nullable(),
  lessonCount: z.number().nullable(),
  programmeSlug: z.string(),
});

export type DevelopmentStage = z.infer<typeof developmentStageSchema>;

const individualSpecialistUnitSchema = z.object({
  slug: z.string(),
  title: z.string(),
  nullTitle: z.string(),
  programmeSlug: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  lessonCount: z.number().nullable(),
  unitStudyOrder: z.number().nullish(),
  expired: z.boolean().nullable(),
  expiredLessonCount: z.number().nullable(),
  learningThemes: z.array(themeSchema).nullish(),
  themeSlug: z.string().nullish(),
  themeTitle: z.string().nullish(),
  developmentStageSlug: z.string().nullish(),
  developmentStageTitle: z.string().nullish(),
});
const specialistUnitArray = z.array(individualSpecialistUnitSchema);

export type SpecialistUnit = z.infer<typeof individualSpecialistUnitSchema>;

export const specialistUnitListingSchema = z.object({
  units: z.array(specialistUnitArray),
  developmentStage: z.array(developmentStageSchema),
  programmeSlug: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  subjectParent: z.string().nullish(),
  learningThemes: z.array(themeSchema),
  developmentStageSlug: z.string().nullable(),
});

export type SpecialistUnitListingData = z.infer<
  typeof specialistUnitListingSchema
>;
