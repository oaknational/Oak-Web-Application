import { z } from "zod";

const programmeSchema = z.object({
  programmeSlug: z.string(),
  subjectTitle: z.string(),
  unitCount: z.number(),
  lessonCount: z.number(),
  tierSlug: z.string().nullable(),
  tierTitle: z.string().nullable(),
});

export const programmeListingSchema = z.object({
  keyStageSlug: z.string(),
  keyStageTitle: z.string().nullish(), // this was left out of the MV and will be added on this ticket https://www.notion.so/oaknationalacademy/I-want-exam-board-and-tier-on-the-mv_programme_listing-8a5ef942178342e8b60d814608670634
  subjectSlug: z.string(),
  programmes: z.array(programmeSchema),
});

export type ProgrammeListingPageData = z.infer<typeof programmeListingSchema>;
export type Programme = z.infer<typeof programmeSchema>;
