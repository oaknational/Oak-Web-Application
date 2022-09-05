import * as z from "zod";

import { slugSchema, documentSchema } from "./base";

export const landingPageSchema = z
  .object({
    slug: slugSchema,
  })
  .merge(documentSchema);

export type LandingPage = z.infer<typeof landingPageSchema>;

export const landingPagePreviewSchema = landingPageSchema.pick({
  id: true,
  slug: true,
});

export type LandingPagePreview = z.infer<typeof landingPagePreviewSchema>;
