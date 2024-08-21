import { PostHog as PostHogNode } from "posthog-node";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const posthogApiKey = getBrowserConfig("posthogApiKey");

const posthogClient = new PostHogNode(posthogApiKey, {
  host: getBrowserConfig("posthogApiHost"),
});

export const getFeatureFlag = ({
  featureFlagKey,
  posthogUserId,
}: {
  featureFlagKey: string;
  posthogUserId: string;
}) => posthogClient.getFeatureFlag(featureFlagKey, posthogUserId);
