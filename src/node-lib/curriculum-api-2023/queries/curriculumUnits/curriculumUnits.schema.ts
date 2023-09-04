import { z } from "zod";

const curriculumUnitsSchema = z.object({
  units: z
    .object({
      title: z.string(),
      slug: z.string(),
      connection_prior_unit_description: z.string().nullable(),
      connection_future_unit_description: z.string().nullable(),
      planned_number_of_lessons: z.number().nullable(),
      subject: z.string(),
      subject_slug: z.string(),
      subject_parent: z.string().nullable(),
      subject_parent_slug: z.string().nullable(),
      phase: z.string(),
      phase_slug: z.string(),
      year: z.string(),
      keystage_slug: z.string(),
      tier: z.string().nullable(),
      tier_slug: z.string().nullable(),
      examboard: z.string().nullable(),
      examboard_slug: z.string().nullable(),
      threads: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
        })
      ),
      domains: z.array(
        z.object({
          title: z.string(),
          tag_id: z.number(),
        })
      ),
    })
    .strict()
    .array(),
});

export default curriculumUnitsSchema;
