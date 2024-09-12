import { z } from "zod";

const phaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

const examboard = z.object({
  slug: z.string(),
  title: z.string(),
});

const keystage = z.object({
  slug: z.string(),
  title: z.string(),
});

const subjectPhaseOptionsSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    phases: z.array(phaseSchema),
    examboards: z.array(examboard).optional().nullable(),
    keystages: z.array(keystage).optional().nullable(),
    state: z.string().optional(),
  })
  .array();

export default subjectPhaseOptionsSchema;
