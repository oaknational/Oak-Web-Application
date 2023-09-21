import * as z from "zod";

import { documentSchema, imageSchema, seoSchema } from "./base";
import { textBlockSchema } from "./blocks";
import { blogPostPreviewSchema } from "./blog";
import { portableTextSchema } from "./portableText";

export const curriculumPageSchema = z
  .object({
    title: z.string(),
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    summaryCardImage: imageSchema.nullish(),
    info: textBlockSchema,
    gettingStarted: textBlockSchema,
    elements: z.object({
      title: z.string(),
      posts: z.array(
        z.object({
          title: z.string(),
          post: blogPostPreviewSchema.pick({
            title: true,
            slug: true,
          }),
        }),
      ),
    }),
    ourApproach: textBlockSchema,
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type CurriculumPage = z.infer<typeof curriculumPageSchema>;
