import { PostHog } from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import getHasConsentedTo from "../cookie-consent/getHasConsentedTo";
import withQueue from "../analytics/withQueue";
import config from "../../config";

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
        loaded: () => resolve(),
        disable_session_recording: true,
      });
    }),
  identify: (userId, properties) => {
    client.identify(userId, properties);
  },
  page: () => {
    client.capture("$pageview");
  },
  track: (name, properties) => {
    client.capture(name, properties);
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
