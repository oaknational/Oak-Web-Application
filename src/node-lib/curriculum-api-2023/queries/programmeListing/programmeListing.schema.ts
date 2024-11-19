import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

export const programmeListingResponseSchema =
  syntheticUnitvariantLessonsSchema.omit({
    supplementary_data: true,
    lesson_slug: true,
    unit_slug: true,
    unit_data: true,
    null_unitvariant_id: true,
  });

export type ProgrammeListingResponse = z.infer<
  typeof programmeListingResponseSchema
>;

const programmeSchema = z.object({
  programmeSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  tierTitle: z.string().nullable(),
  tierDisplayOrder: z.number().nullable(),
  examBoardSlug: z.string().nullable(),
  examBoardTitle: z.string().nullable(),
  examBoardDisplayOrder: z.number().nullable(),
});

export const programmeListingSchema = z.object({
  keyStageTitle: z.string(),
  keyStageSlug: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  programmes: z.array(programmeSchema),
});

export type ProgrammeListingPageData = z.infer<
  typeof programmeListingSchema
> & { legacy: boolean };
export type Programme = z.infer<typeof programmeSchema>;
