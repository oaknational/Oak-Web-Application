import { PostHog as PostHogNode } from "posthog-node";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const posthogApiKey = getBrowserConfig("posthogApiKey");

const posthogClient = new PostHogNode(posthogApiKey, {
  host: getBrowserConfig("posthogApiHost"),
});

/**
 * Set person properties for `distinctId`, but only for keys that are not
 * already present on the person (PostHog's `$set_once` semantics). This never
 * overwrites an existing value — e.g. a `has_downloaded: true` set by download
 * tracking is left untouched when we seed defaults at sign-up.
 *
 * Awaits a flush so the write is delivered before a short-lived serverless
 * function (e.g. a webhook handler) exits.
 *
 */
export async function setPersonPropertiesOnce(
  distinctId: string,
  properties: Record<string, unknown>,
): Promise<void> {
  posthogClient.capture({
    distinctId,
    event: "$set",
    properties: { $set_once: properties },
  });

  await posthogClient.flush();
}
