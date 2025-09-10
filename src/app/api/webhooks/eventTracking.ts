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

  initAvo({ env: getAvoEnv() }, {}, getAvoBridge({ posthog: posthogClient }));
}
