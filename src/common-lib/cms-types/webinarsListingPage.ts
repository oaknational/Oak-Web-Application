import * as z from "zod";

import { documentSchema, seoSchema } from "./base";
import { portableTextSchema } from "./portableText";

export const webinarsListingPageSchema = z
  .object({
    title: z.string(),
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type WebinarsListingPage = z.infer<typeof webinarsListingPageSchema>;
