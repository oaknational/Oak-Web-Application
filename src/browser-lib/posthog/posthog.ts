import { PostHog } from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import getHasConsentedTo from "../cookie-consent/getHasConsentedTo";
import withQueue from "../analytics/withQueue";
import config from "../../config/browser";
import getLegacyAnonymousId from "../analytics/getLegacyAnonymousId";

export type PosthogDistinctId = string;
export type MaybeDistinctId = string | null;

export type PosthogConfig = {
  apiKey: string;
  apiHost: string;
};

export const posthogToAnalyticsServiceWithoutQueue = (
  client: PostHog
): AnalyticsService<PosthogConfig> => ({
  name: "posthog",
  init: ({ apiKey, apiHost }) =>
    new Promise((resolve) => {
      client.init(apiKey, {
        api_host: apiHost,
        debug: config.get("releaseStage") !== "production",
        loaded: () => {
          resolve(client.get_distinct_id());
        },
        disable_session_recording: true,
      });
    }),
  identify: (userId, properties) => {
    client.identify(userId, properties);
  },
  setLegacyAnonymousId: () => {
    client.identify(client.get_distinct_id(), {
      legacy_oak_anonymous_id: getLegacyAnonymousId(),
    });
  },
  page: () => {
    client.capture("$pageview");
  },
  track: (name, properties) => {
    client.capture(name, {
      ...properties,
      $set_once: {
        legacy_oak_anonymous_id: getLegacyAnonymousId(),
      },
    });
  },
  optIn: () => {
    if (client.has_opted_out_capturing()) {
      client.opt_in_capturing();
    }
  },
  optOut: () => {
    client.opt_out_capturing();
  },
  state: () => getHasConsentedTo("posthog"),
});

export default (client: PostHog) =>
  withQueue(posthogToAnalyticsServiceWithoutQueue(client));
