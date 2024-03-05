import { z } from "zod";

export const specialistProgrammeQueryResponseSchema = z.array(
  z.object({
    synthetic_programme_slug: z.string(),
    combined_programme_fields: z.object({
      subject: z.string(),
      subject_slug: z.string(),
      developmentstage: z.string(),
      developmentstage_slug: z.string(),
    }),
  }),
);

const SpecialistProgrammeSchema = z.object({
  programmeSlug: z.string(),
  developmentStageSlug: z.string(),
  developmentStageTitle: z.string(),
});

const SpecialistProgrammesListingSchema = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  programmes: z.array(SpecialistProgrammeSchema),
});

const SpecialistProgrammesSchema = z.array(SpecialistProgrammeSchema);

export type SpecialistProgramme = z.infer<typeof SpecialistProgrammeSchema>;
export type SpecialistProgrammes = z.infer<typeof SpecialistProgrammesSchema>;
export type SpecialistProgrammeListingPageData = z.infer<
  typeof SpecialistProgrammesListingSchema
>;
