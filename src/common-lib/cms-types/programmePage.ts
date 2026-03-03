import z from "zod";

import { slugSchema, documentSchema } from "./base";

export const programmePageSchema = z
  .object({
    slug: slugSchema,
    bodyCopy: z.string(),
    bullets: z.array(z.string()),
  })
  .merge(documentSchema);

export type ProgrammePageHeaderCMS = z.infer<typeof programmePageSchema>;
