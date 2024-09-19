import { z } from "zod";

const phaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

const examboard = z.object({
  slug: z.string(),
  title: z.string(),
});

const subjectPhaseOptionsSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    phases: z.array(phaseSchema),
    examboards: z.array(examboard).optional().nullable(),
    state: z.string().optional(),
    cycle: z.string(),
  })
  .array();

export default subjectPhaseOptionsSchema;
