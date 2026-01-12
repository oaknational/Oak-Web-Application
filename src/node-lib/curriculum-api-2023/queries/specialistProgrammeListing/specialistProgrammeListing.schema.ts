import { z } from "zod";

export const specialistProgrammeQueryResponseSchema = z.array(
  z.object({
    synthetic_programme_slug: z.string(),
    combined_programme_fields: z.object({
      subject: z.string(),
      subject_slug: z.string(),
      developmentstage: z.string(),
      developmentstage_slug: z.string(),
      developmentstage_display_order: z.number(),
    }),
  }),
);

export const specialistProgrammeListingCountSchema = z.object({
  unitCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  lessonCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
});

const SpecialistProgrammeSchema = z.object({
  programmeSlug: z.string(),
  developmentStageSlug: z.string(),
  developmentStageTitle: z.string(),
  unitCount: z.number(),
  lessonCount: z.number(),
});

export const SpecialistProgrammesListingSchema = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  programmes: z.array(SpecialistProgrammeSchema),
});

export const SpecialistProgrammesSchema = z.array(SpecialistProgrammeSchema);

export type SpecialistProgrammeQueryResponseSchema = z.infer<
  typeof specialistProgrammeQueryResponseSchema
>;
export type SpecialistProgramme = z.infer<typeof SpecialistProgrammeSchema>;
export type SpecialistProgrammes = z.infer<typeof SpecialistProgrammesSchema>;
export type SpecialistProgrammeListingPageData = z.infer<
  typeof SpecialistProgrammesListingSchema
>;
