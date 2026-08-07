import { GetServerSidePropsContext } from "next";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export const FLAGS = {
  get "oaks-impact"() {
    return process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT ?? "false";
  },
} as const;

export function isFeatureFlagEnabledAtBuild(
  featureFlagKey: keyof typeof FLAGS,
): boolean {
  return FLAGS[featureFlagKey] === "true";
}

/**
 * A utility function to check if a feature flag is enabled
 * @param context only provided in getServerSideProps, not provided in build time rendered components
 * @param featureFlagKey the key of the feature flag to check
 * @returns a boolean indicating whether the feature flag is enabled
 */
export async function isFeatureFlagEnabled(
  context: GetServerSidePropsContext,
  featureFlagKey: keyof typeof FLAGS,
): Promise<boolean> {
  if (isFeatureFlagEnabledAtBuild(featureFlagKey)) {
    return true;
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
