import { z } from "zod";

const SpecialistProgrammeSchema = z.object({
  programmeSlug: z.string(),
  developmentalStageSlug: z.string(),
  developmentalStageTitle: z.string(),
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
