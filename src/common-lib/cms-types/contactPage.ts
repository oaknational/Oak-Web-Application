import * as z from "zod";

import { documentSchema, seoSchema } from "./base";
import { portableTextSchema } from "./portableText";

export const contactPageSchema = z
  .object({
    title: z.string(),
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    bodyPortableText: portableTextSchema,
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type ContactPage = z.infer<typeof contactPageSchema>;
