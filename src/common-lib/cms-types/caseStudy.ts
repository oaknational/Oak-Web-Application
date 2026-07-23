import * as z from "zod";

import { imageSchema, videoSchema } from "./base";
import { portableTextSchema } from "./portableText";

export const caseStudySchema = z.object({
  video: videoSchema,
  slug: z.object({
    current: z.string(),
  }),
  image: imageSchema,
  textRaw: portableTextSchema.nullish(),
});

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
