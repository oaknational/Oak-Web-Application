import { PostHog } from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import getHasConsentedTo from "../cookie-consent/getHasConsentedTo";
import withQueue from "../analytics/withQueue";
import config from "../../config/browser";

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
  setAnonymousId: (id) => {
    // the following imperative call caused an error to be thrown deep inside
    // posthog, so instead we are props on an event capture call
    // client.people.set("oak_anonymous_id", id);
    client.capture("Setting oak anonymous id", {
      $set: { oak_anonymous_id: id },
    });
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
