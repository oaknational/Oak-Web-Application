import { z } from "zod";

const phaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

const ks4OptionSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

const keystage = z.object({
  slug: z.string(),
  title: z.string(),
});

const curriculumPhaseOptionsSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    phases: z.array(phaseSchema),
    keystages: z.array(keystage).optional().nullable(),
    state: z.string().optional(),
    ks4_options: z.array(ks4OptionSchema).optional().nullable(),
    non_curriculum: z.boolean(),
  })
  .array();

export default curriculumPhaseOptionsSchema;
