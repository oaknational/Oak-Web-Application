import { z } from "zod";

const curriculumSubjectPhaseSchema = z.object({
  programmes: z.array(
    z.object({
      programme_id: z.number(),
      programme_fields: z.object({
        year: z.number().nullish(),
        optionality: z.string().nullish(),
        phase: z.string().nullish(),
        phase_description: z.string().nullish(),
        subject: z.string().nullish(),
        subject_slug: z.string().nullish(),
        subject_description: z.string().nullish(),
        subject_display_order: z.string().nullish(),
        tier_description: z.string().nullish(),
      }),
    })
  ),
});

export type curriculumSubjectPhaseData = z.infer<
  typeof curriculumSubjectPhaseSchema
>;

export default curriculumSubjectPhaseSchema;
