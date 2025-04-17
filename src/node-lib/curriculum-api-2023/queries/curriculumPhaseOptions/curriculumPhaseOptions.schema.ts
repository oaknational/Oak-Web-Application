import { z } from "zod";

const phaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

export const ks4OptionSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

export type Ks4Option = z.infer<typeof ks4OptionSchema>;

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
    ks4_options: z.array(ks4OptionSchema).optional().nullable().default([]),
  })
  .array();

export default curriculumPhaseOptionsSchema;
