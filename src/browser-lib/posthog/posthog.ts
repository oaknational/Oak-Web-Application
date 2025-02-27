import { PostHog } from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import withQueue from "../analytics/withQueue";
import getLegacyAnonymousId from "../analytics/getLegacyAnonymousId";
import getBrowserConfig from "../getBrowserConfig";
import { consentClient } from "../cookie-consent/consentClient";
import { ServicePolicyMap } from "../cookie-consent/ServicePolicyMap";

export type PosthogDistinctId = string;
export type MaybeDistinctId = string | null;

export type PosthogConfig = {
  apiKey: string;
  apiHost: string;
  uiHost?: string;
};

export const posthogToAnalyticsServiceWithoutQueue = (
  client: PostHog,
): AnalyticsService<PosthogConfig> => ({
  name: "posthog",
  init: ({ apiKey, apiHost, uiHost }) =>
    new Promise((resolve) => {
      if (!client.__loaded) {
        client.init(apiKey, {
          api_host: apiHost,
          ui_host: uiHost,
          debug: getBrowserConfig("releaseStage") !== "production",
          loaded: () => {
            const legacyAnonymousId = getLegacyAnonymousId();
            if (legacyAnonymousId) {
              client.register({
                legacy_anonymous_id: legacyAnonymousId,
              });
            }

            resolve(client.get_distinct_id());
          },
          disable_session_recording: true,
          capture_pageview: false,
        });
      } else {
        resolve(client.get_distinct_id());
      }
    }),
  identify: (userId, properties) => {
    client.identify(userId, properties);
  },
  alias: (userId, aliasId) => {
    client.alias(aliasId, userId);
  },
  page: () => {
    client.capture("$pageview");
  },
  track: (name, properties) => {
    const m = window.location.search.match(/update_tracking_profile=true/);

    if ((name === "$pageview" || name === "$autocapture") && m) {
      client.capture("$set", {
        $set: {
          latest_search_params: window.location.search,
        },
      });
    }
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
  state: () => {
    switch (consentClient.getConsent(ServicePolicyMap.POSTHOG)) {
      case "denied":
        return "disabled";
      case "granted":
        return "enabled";
      default:
        return "pending";
    }
  },
});

export default (client: PostHog) =>
  withQueue(posthogToAnalyticsServiceWithoutQueue(client));
