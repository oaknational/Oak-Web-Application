import { z } from "zod";

const curriculumSequenceSlugUnitSchema = z.object({
  examboard_slug: z.string().nullable(),
  tier_slug: z.string().nullable(),
  pathway_slug: z.string().nullable().optional(),
  subject_slug: z.string(),
  subject_parent_slug: z.string().nullable(),
});

const curriculumSequenceSlugsSchema = z.object({
  units: z.array(curriculumSequenceSlugUnitSchema),
});

export type CurriculumSequenceSlugUnit = z.infer<
  typeof curriculumSequenceSlugUnitSchema
>;

export default curriculumSequenceSlugsSchema;
