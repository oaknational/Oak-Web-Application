import * as z from "zod";

import { slugSchema, documentSchema } from "./base";
import { landingPageSchema } from "./landingPage";

/**
 * Factory function to produce an A/B test schema
 *
 * Ensures control and all variants conform to
 * the same schema (e.g. can't be mixed & matched)
 *
 * @example
 *   getABTestSchema(landingPageSchema)
 */
export function getABTestSchema<PageSchema extends z.ZodTypeAny>(
  pageSchema: PageSchema,
) {
  return z
    .object({
      slug: slugSchema,
      posthogFeatureFlagKey: z.string(),
      controlVariant: pageSchema,
      variants: z.array(
        z.object({
          posthogVariant: z.string(),
          page: pageSchema,
        }),
      ),
    })
    .merge(documentSchema);
}

// A loose type where the control/variants are typed as any - use ABTestForPage where possible
export type ABTest = z.infer<ReturnType<typeof getABTestSchema>>;

/**
 * A workaround for getABTestSchema being a factory rather than
 * being able to statically z.infer<typeof abTestSchema>
 *
 * @example
 *  ABTestForPage<typeof landingPageSchema>
 */
type ABTestForPage<PageSchema extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof getABTestSchema<PageSchema>>
>;

export type ABTestedLandingPage = ABTestForPage<typeof landingPageSchema>;
