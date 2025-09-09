import { PostHog as PostHogNode } from "posthog-node";

import getServerConfig from "@/node-lib/getServerConfig";

export function setUpEventTracking() {
  const posthogApiKey = getServerConfig("posthogApiKey");

  const posthogClient = new PostHogNode(posthogApiKey, {
    host: getServerConfig("posthogApiHost"),
  });

  return posthogClient;
}
