import { FLAGS } from "./flags";
import { isFeatureFlagEnabledStatic } from "./static";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

/**
 * A utility function to check if a feature flag is enabled
 * @param context only provided in getServerSideProps, not provided in build time rendered components
 * @param featureFlagKey the key of the feature flag to check
 * @returns a boolean indicating whether the feature flag is enabled
 */
export async function isFeatureFlagEnabledServer(
  cookies: Partial<{
    [key: string]: string;
  }>,
  featureFlagKey: keyof typeof FLAGS,
): Promise<boolean> {
  if (isFeatureFlagEnabledStatic(featureFlagKey)) {
    return true;
  }

  const posthogUserId = getPosthogIdFromCookie(
    cookies,
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
