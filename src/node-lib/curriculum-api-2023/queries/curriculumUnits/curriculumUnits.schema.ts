import { z } from "zod";

const curriculumUnitsSchema = z.object({
  units: z
    .object({
      connection_prior_unit_description: z.string().nullable(),
      connection_future_unit_description: z.string().nullable(),
      domain: z.string().nullable(),
      domain_id: z.number().nullable(),
      examboard: z.string().nullable(),
      examboard_slug: z.string().nullable(),
      planned_number_of_lessons: z.number().nullable(),
      phase: z.string(),
      phase_slug: z.string(),
      keystage_slug: z.string(),
      lessons: z
        .array(
          z.object({
            slug: z.string().optional(),
            title: z.string(),
            slug: z.string().optional(),
          }),
        )
        .nullable(),
      slug: z.string(),
      subject: z.string(),
      subject_slug: z.string(),
      subject_parent: z.string().nullable(),
      subject_parent_slug: z.string().nullable(),
      tier: z.string().nullable(),
      tier_slug: z.string().nullable(),
      threads: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
          order: z.number(),
        }),
      ),
      title: z.string(),
      unit_options: z.array(
        z.object({
          connection_prior_unit_description: z.string().nullable(),
          connection_future_unit_description: z.string().nullable(),
          title: z.string(),
          unitvariant_id: z.number(),
          lessons: z.array(
            z.object({
              slug: z.string().optional(),
              title: z.string(),
            }),
          ),
        }),
      ),
      year: z.string(),
    })
    .strict()
    .array(),
});

export default curriculumUnitsSchema;
