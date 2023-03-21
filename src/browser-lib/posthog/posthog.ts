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

const withLegacyAnonymousId = (
  properties?: Record<string, unknown> & {
    $set_once?: Record<string, unknown>;
  }
) => {
  const legacyAnonymousId = getLegacyAnonymousId();
  const $set_once = legacyAnonymousId
    ? {
        ...properties?.$set_once,
        legacy_anonymous_id: legacyAnonymousId,
      }
    : properties?.$set_once || {};

  const propsWithLegacyAnonymousId = {
    ...properties,
    $set_once,
  };

  return propsWithLegacyAnonymousId;
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
  page: () => {
    client.capture("$pageview", withLegacyAnonymousId());
  },
  track: (name, properties) => {
    client.capture(name, withLegacyAnonymousId(properties));
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
