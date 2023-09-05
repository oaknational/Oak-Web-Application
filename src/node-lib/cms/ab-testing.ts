import { GetServerSidePropsContext } from "next";
import { PostHog as PostHogNode } from "posthog-node";
import { sample } from "lodash/fp";

import getBrowserConfig from "../../browser-lib/getBrowserConfig";

import CMSClient from ".";

const posthogApiKey = getBrowserConfig("posthogApiKey");

const posthogClient = new PostHogNode(posthogApiKey, {
  host: getBrowserConfig("posthogApiHost"),
});

/**
 * Look up an A/B tested landing page by slug. If it exists,
 * attempt to match a variant to the variant a user has been
 * assigned to
 */
export async function getABTestedLandingPage(
  landingPageSlug: string,
  context: GetServerSidePropsContext,
  isPreviewMode: boolean
) {
  const abTest = await CMSClient.landingPageABTestBySlug(landingPageSlug, {
    previewMode: isPreviewMode,
  });

  if (!abTest) {
    /**
     * No A/B test exists, exit early so we fall back to
     * regular landing page rendering
     */
    return null;
  }

  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey
  );

  if (posthogUserId) {
    const variantName = await posthogClient.getFeatureFlag(
      "cms_ab_spike_dev",
      posthogUserId
    );

    // Look up the users variant in the mapping of variants->pages from the CMS
    const variant = abTest?.variants.find(
      (variantOption) => variantOption.posthogVariant === variantName
    );

    if (!variant) {
      /**
       * If we can't find a variant that matches what we have in the CMS
       * there's probably a data integrity issue. Fall back to showing
       * them the control instead of potentially losing a lead.
       *
       * n.b. we need to be cautious of skewing statistics here if a user
       * is marked as being in one group, but is seeing content for the
       * control
       */
      return abTest.controlVariant;
    }

    return variant.page;
  } else {
    /**
     * We don't have a distinct ID to identify the user which means they
     * probably haven't consented to posthog. Fall back to showing a random variant.
     */
    const variantPages = abTest.variants.map((variant) => variant.page);
    return sample([abTest.controlVariant, ...variantPages]);
  }
}

/**
 * Find a users `distinct_id` from cookies, if it exists
 */
function getPosthogIdFromCookie(
  cookies: Partial<Record<string, string>>,
  posthogApiKey: string
): string | null {
  const posthogCookieName = `ph_${posthogApiKey}_posthog`;
  const posthogCookie = cookies[posthogCookieName];

  if (posthogCookie) {
    try {
      // Casting here instead of some zod parsing, as
      // we quickly fallback to null otherwise
      const parsedCookie = JSON.parse(posthogCookie) as {
        distinct_id?: string;
      };

      return parsedCookie?.distinct_id ?? null;
    } catch (err) {
      // Fall back to returning null if we can't
      // parse the cookie
      console.error(err);
    }
  }

  return null;
}
