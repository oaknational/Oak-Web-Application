import { z } from "zod";

const programmeSchema = z.object({
  programmeSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  tierTitle: z.string().nullable(),
  tierDisplayOrder: z.string().nullable(), // cast to number in datatools
  examBoardSlug: z.string().nullable(),
  examBoardTitle: z.string().nullable(),
  examBoardDisplayOrder: z.string().nullable(), // cast to number in datatools
});

export const programmeListingSchema = z.object({
  keyStageTitle: z.string(),
  keyStageSlug: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  programmes: z.array(programmeSchema),
});

export type ProgrammeListingPageData = z.infer<typeof programmeListingSchema>;
export type Programme = z.infer<typeof programmeSchema>;
