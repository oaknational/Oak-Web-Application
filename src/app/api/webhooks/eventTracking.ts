import { PostHog as PostHogNode } from "posthog-node";

import { initAvo } from "@/node-lib/avo/Avo";
import getAvoEnv from "@/browser-lib/avo/getAvoEnv";
import getServerConfig from "@/node-lib/getServerConfig";
import getAvoBridge from "@/node-lib/avo/getAvoBridge";

export function setUpEventTracking() {
  const posthogApiKey = getServerConfig("posthogApiKey");

  const posthogClient = new PostHogNode(posthogApiKey, {
    host: getServerConfig("posthogApiHost"),
  });

  // Use silent logger in test environments to prevent console output
  const isTestEnvironment = process.env.NODE_ENV === "test";
  const silentLogger = isTestEnvironment
    ? {
        logDebug: () => true,
        logWarn: () => true,
        logError: () => true,
      }
    : undefined;

  initAvo(
    {
      env: getAvoEnv(),
      avoLogger: silentLogger,
    },
    {},
    getAvoBridge({ posthog: posthogClient }),
  );
}
