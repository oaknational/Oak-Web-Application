import { z } from "zod";

const curriculumUnitsSchema = z.object({
  units: z
    .object({
      title: z.string(),
      slug: z.string(),
      planned_number_of_lessons: z.number().nullable(),
      connection_prior_unit_description: z.string().nullable(),
      connection_future_unit_description: z.string().nullable(),
      subject: z.string(),
      subject_slug: z.string(),
      phase: z.string(),
      phase_slug: z.string(),
      keystage_slug: z.string(),
      tier_slug: z.string().nullable(),
      year: z.string(),
      examboard: z.string().nullable(),
      examboard_slug: z.string().nullable(),
      threads: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
        })
      ),
    })
    .array(),
});

export default curriculumUnitsSchema;
