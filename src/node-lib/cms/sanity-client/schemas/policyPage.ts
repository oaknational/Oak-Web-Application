import * as z from "zod";

import { dateSchema, documentSchema, seoSchema, slugSchema } from "./base";
import { portableTextSchema } from "./portableText";

export const policyPageSchema = z
  .object({
    title: z.string(),
    slug: slugSchema,
    lastUpdatedAt: dateSchema,
    bodyPortableText: portableTextSchema,
    seo: seoSchema,
  })
  .merge(documentSchema);

export type PolicyPage = z.infer<typeof policyPageSchema>;

export const policyPagePreviewSchema = policyPageSchema.pick({
  id: true,
  title: true,
  slug: true,
});

export type PolicyPagePreview = z.infer<typeof policyPagePreviewSchema>;
