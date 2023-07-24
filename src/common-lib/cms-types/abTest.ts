import * as z from "zod";

import { slugSchema, documentSchema } from "./base";
import { landingPageSchema } from "./landingPage";

// If/when we have more than 1, change this to z.union([landingPageSchema, ...])
const abTestablePageTypes = landingPageSchema;

export const abTestSchema = z
  .object({
    slug: slugSchema,
    posthogFeatureFlagKey: z.string(),
    controlVariant: abTestablePageTypes,
    variants: z.array(
      z.object({
        posthogVariant: z.string(),
        page: abTestablePageTypes,
      })
    ),
  })
  .merge(documentSchema);

export type ABTest = z.infer<typeof abTestSchema>;
