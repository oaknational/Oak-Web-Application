import {
  phaseSlugs,
  subjects,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

const phaseSchema = z.object({
  slug: phaseSlugs,
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
    slug: subjectSlugs,
    title: subjects,
    phases: z.array(phaseSchema),
    keystages: z.array(keystage).optional().nullable(),
    state: z.string().optional(),
    ks4_options: z.array(ks4OptionSchema).optional().nullable().prefault([]),
    non_curriculum: z.boolean().nullish(),
  })
  .array();

export default curriculumPhaseOptionsSchema;
