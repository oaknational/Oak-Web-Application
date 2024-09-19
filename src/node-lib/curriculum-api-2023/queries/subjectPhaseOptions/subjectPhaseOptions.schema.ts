import { z } from "zod";

const phaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

const ks4OptionSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

const subjectPhaseOptionsSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    phases: z.array(phaseSchema),
    state: z.string().optional(),
    keystages: z
      .array(
        z
          .object({
            title: z.string(),
            slug: z.string(),
          })
          .nullable(),
      )
      .nullable(),
    ks4_options: z.array(ks4OptionSchema).optional().nullable(),
    cycle: z.string(),
  })
  .array();

export default subjectPhaseOptionsSchema;
