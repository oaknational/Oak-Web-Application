import { z } from "zod";

const SpecialistProgrammeSchema = z.object({
  programmeSlug: z.string(),
  developmentalStageSlug: z.string(),
  developmentalStageTitle: z.string(),
});

const SpecialistProgrammesSchema = z.array(SpecialistProgrammeSchema);

export type SpecialistProgramme = z.infer<typeof SpecialistProgrammeSchema>;
export type SpecialistProgrammes = z.infer<typeof SpecialistProgrammesSchema>;
