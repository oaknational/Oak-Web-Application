import * as z from "zod";

import {
  dateSchema,
  documentSchema,
  portableTextSchema,
  slugSchema,
} from "./base";

export const policyPageSchema = z
  .object({
    title: z.string(),
    slug: slugSchema,
    lastUpdatedAt: dateSchema,
    // @TODO: Portable text type
    bodyPortableText: portableTextSchema,
  })
  .merge(documentSchema);

export type PolicyPage = z.infer<typeof policyPageSchema>;

export const policyPagePreviewSchema = policyPageSchema.pick({
  id: true,
  title: true,
  slug: true,
});

export type PolicyPagePreview = z.infer<typeof policyPagePreviewSchema>;
