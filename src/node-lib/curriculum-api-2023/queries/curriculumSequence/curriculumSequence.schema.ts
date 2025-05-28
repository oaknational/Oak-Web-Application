import { z } from "zod";

const curriculumSequenceSchema = z.object({
  units: z
    .object({
      connection_prior_unit_description: z.string().nullable(),
      connection_future_unit_description: z.string().nullable(),
      connection_future_unit_title: z.string().nullable(),
      connection_prior_unit_title: z.string().nullable(),
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
      order: z.number(),
      slug: z.string(),
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
            slug: z.string(),
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
      description: z.string().nullable(),
      why_this_why_now: z.string().nullable(),
      cycle: z.string(),
      features: z.any(),
      parent_programme_features: z.any().nullable(),
      actions: z.any(),
      unit_options: z.array(
        z.object({
          connection_prior_unit_description: z.string().nullable(),
          connection_future_unit_description: z.string().nullable(),
          connection_prior_unit_title: z.string().nullable(),
          connection_future_unit_title: z.string().nullable(),
          description: z.string().nullable(),
          why_this_why_now: z.string().nullable(),
          title: z.string(),
          unitvariant_id: z.number(),
          slug: z.string().optional(),
          lessons: z.array(
            z.object({
              slug: z.string().optional(),
              title: z.string(),
              _state: z.string().optional(),
            }),
          ),
          state: z.string(),
        }),
      ),
      year: z.string(),
      state: z.string(),
    })
    .strict()
    .array(),
});

export default curriculumSequenceSchema;
