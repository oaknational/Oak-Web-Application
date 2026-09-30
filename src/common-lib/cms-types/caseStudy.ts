import * as z from "zod";

import { imageSchema, videoSchema } from "./base";
import { portableTextSchema } from "./portableText";

export const caseStudySchema = z.object({
  title: z.string().nullish(),
  tag: z.string().nullish(),
  summaryRaw: portableTextSchema.nullish(),
  content: z
    .array(
      z.object({
        heading: z.string().nullish(),
        label: z.string().nullish(),
        anchorSlug: z
          .object({
            current: z.string(),
          })
          .nullish(),
        contentRaw: portableTextSchema.nullish(),
      }),
    )
    .nullish(),
  showGetInTouchPanel: z.boolean().nullish(),
  getInTouchPanel: z
    .object({
      personName: z.string().nullish(),
      personImage: imageSchema.nullish(),
      jobRole: z.string().nullish(),
      institutionName: z.string().nullish(),
    })
    .nullish(),
  video: videoSchema.nullish(),
  slug: z.object({
    current: z.string(),
  }),
  image: imageSchema,
  textRaw: portableTextSchema.nullish(),
  publishedAt: z.string(),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

export const caseStudyCardSchema = caseStudySchema
  .pick({
    title: true,
    slug: true,
    image: true,
  })
  .extend({
    video: videoSchema
      .pick({
        title: true,
      })
      .nullish(),
  });

export type CaseStudyCard = z.infer<typeof caseStudyCardSchema>;
