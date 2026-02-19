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

export type SpecialistProgrammeQueryResponseSchema = z.infer<
  typeof specialistProgrammeQueryResponseSchema
>;
export type SpecialistProgramme = {
  programmeSlug: string;
  developmentStageSlug: string;
  developmentStageTitle: string;
  unitCount: number;
  lessonCount: number;
};
export type SpecialistProgrammes = SpecialistProgramme[];
export type SpecialistProgrammeListingPageData = {
  subjectSlug: string;
  subjectTitle: string;
  programmes: SpecialistProgrammes;
};
