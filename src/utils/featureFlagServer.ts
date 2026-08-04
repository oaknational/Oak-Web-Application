import { GetServerSidePropsContext } from "next";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export function isFeatureFlagEnabledAtBuild(
  constant: string | undefined,
): boolean {
  return constant === "true";
}

/**
 * A utility function to check if a feature flag is enabled
 * @param context only provided in getServerSideProps, not provided in build time rendered components
 * @param featureFlagKey the key of the feature flag to check
 * @param constant a constant value that can override the feature flag
 * @returns a boolean indicating whether the feature flag is enabled
 */
export async function isFeatureFlagEnabled(
  context: GetServerSidePropsContext | undefined,
  featureFlagKey: string,
  constant: string | undefined,
): Promise<boolean> {
  if (isFeatureFlagEnabledAtBuild(constant)) {
    return true;
  }

  // Early exit, if no context is provided, we cannot check the feature flag. This is for build time rendered components
  if (!context) {
    return false;
  }

  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    getBrowserConfig("posthogApiKey"),
  );

  let isEnabled: boolean = false;
  if (posthogUserId) {
    isEnabled =
      (await getFeatureFlag({
        featureFlagKey: featureFlagKey,
        posthogUserId,
      })) === true;
  }

  if (!isEnabled) {
    return false;
  }
  return true;
}
