import * as z from "zod";

import { documentSchema, imageSchema, videoSchema } from "./base";
import { portableTextSchema } from "./portableText";

export const caseStudySchema = z
  .object({
    video: videoSchema,
    slug: z.object({
      current: z.string(),
    }),
    image: imageSchema,
    text: portableTextSchema.nullish(),
  })
  .merge(documentSchema);

export type CaseStudy = z.infer<typeof caseStudySchema>;

export const caseStudyCardSchema = caseStudySchema
  .pick({
    slug: true,
    image: true,
  })
  .extend({
    video: videoSchema.pick({
      title: true,
    }),
  });

export type CaseStudyCard = z.infer<typeof caseStudyCardSchema>;
