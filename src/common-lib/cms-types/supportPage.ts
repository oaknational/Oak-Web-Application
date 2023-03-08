import { z } from "zod";

import { documentSchema, imageSchema, quoteSchema, seoSchema } from "./base";
import { textBlockSchema } from "./blocks";
import { portableTextSchema } from "./portableText";

export const supportPageSchema = z
  .object({
    title: z.string(),
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    summaryCardImage: imageSchema.nullish(),
    cover: z.object({
      title: z.string(),
      bodyPortableText: portableTextSchema,
      quote: quoteSchema,
    }),
    curriculum: textBlockSchema,
    development: textBlockSchema,
    planning: textBlockSchema,
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type SupportPage = z.infer<typeof supportPageSchema>;
