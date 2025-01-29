import { z } from "zod";

const curriculumUnitsIncludeNewSchema = z.object({
  units: z
    .object({
      connection_prior_unit_description: z.string().nullable(),
      connection_future_unit_description: z.string().nullable(),
      connection_future_unit_title: z.string().nullable(),
      connection_prior_unit_title: z.string().nullable(),
      description: z.string().nullable(),
      why_this_why_now: z.string().nullable(),
      cycle: z.string(),
      features: z.any(),
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
            _state: z.string().optional(),
          }),
        )
        .nullable(),
      order: z.number().nullable(),
      slug: z.string(),
      state: z.string(),
      subject: z.string(),
      subject_slug: z.string(),
      subject_parent: z.string().nullable(),
      subject_parent_slug: z.string().nullable(),
      tier: z.string().nullable(),
      tier_slug: z.string().nullable(),
      pathway: z.string().nullable().optional(),
      pathway_slug: z.string().nullable().optional(),
      tags: z
        .array(
          z.object({
            id: z.number(),
            title: z.string(),
            category: z.string().optional(),
          }),
        )
        .nullable(),
      subjectcategories: z
        .array(
          z.object({
            id: z.number(),
            title: z.string(),
            category: z.string().optional(),
          }),
        )
        .nullable(),
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
          connection_prior_unit_title: z.string().nullable(),
          connection_future_unit_title: z.string().nullable(),
          description: z.string().nullable(),
          why_this_why_now: z.string().nullable(),
          state: z.string(),
          title: z.string(),
          slug: z.string().optional(),
          unitvariant_id: z.number(),
          lessons: z.array(
            z.object({
              slug: z.string().optional(),
              title: z.string(),
              _state: z.string().optional(),
            }),
          ),
        }),
      ),
      year: z.string(),
    })
    .strict()
    .array(),
});

export default curriculumUnitsIncludeNewSchema;
