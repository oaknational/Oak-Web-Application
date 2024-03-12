import { z } from "zod";

export const combinedProgrammeFields = z.object({
  subject: z.string(),
  subject_slug: z.string(),
  subject_type: z.string(),
  subject_parent: z.string(),
  developmentstage: z.string().nullish(),
  developmentstage_slug: z.string().nullish(),
  phase_slug: z.string().nullish(),
  phase: z.string().nullish(),
});
export const specialistUnitListRequestSchema = z.array(
  z.object({
    contains_copyright_content: z.boolean(),
    expired: z.boolean().nullable(),
    synthetic_programme_slug: z.string(),
    unit_slug: z.string(),
    unit_title: z.string(),
    combined_programme_fields: combinedProgrammeFields,
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

export type DevelopmentalStageUnitCount = z.infer<
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

const themeSchema = z.object({
  themeSlug: z.string().nullable(),
  themeTitle: z.string().nullable(),
});

export const developmentalStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  unitCount: z.number().nullable(),
  lessonCount: z.number().nullable(),
  programmeSlug: z.string(),
});

export type DevelopmentalStage = z.infer<typeof developmentalStageSchema>;

const individualSpecialistUnitSchema = z.object({
  slug: z.string(),
  title: z.string(),
  nullTitle: z.string(),
  programmeSlug: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  lessonCount: z.number(),
  unitStudyOrder: z.number().nullish(),
  expired: z.boolean().nullable(),
  expiredLessonCount: z.number().nullable(),
  learningThemes: z.array(themeSchema).nullable(),
  themeSlug: z.string().nullish(),
  themeTitle: z.string().nullish(),
  developmentalStageSlug: z.string().nullish(),
  developmentalStageTitle: z.string().nullish(),
});
const specialistUnitArray = z.array(individualSpecialistUnitSchema);

export type SpecialistUnit = z.infer<typeof individualSpecialistUnitSchema>;

export const specialistUnitListingSchema = z.object({
  units: z.array(specialistUnitArray),
  developmentalStage: z.array(developmentalStageSchema),
  programmeSlug: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  learningThemes: z.array(themeSchema),
  developmentalStageSlug: z.string(),
});

export type SpecialistUnitListingData = z.infer<
  typeof specialistUnitListingSchema
>;
