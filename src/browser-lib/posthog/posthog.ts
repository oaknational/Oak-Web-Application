import posthogJs from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import getHasConsentedTo from "../cookie-consent/getHasConsentedTo";
import withQueue from "../analytics/withQueue";
import config from "../../config";

export type PosthogConfig = {
  apiKey: string;
  apiHost: string;
};

export const posthogWithoutQueue: AnalyticsService<PosthogConfig> = {
  name: "posthog",
  init: ({ apiKey, apiHost }) =>
    new Promise((resolve) => {
      posthogJs.init(apiKey, {
        api_host: apiHost,
        debug: config.get("releaseStage") !== "production",
        loaded: () => resolve(),
      });
    }),
  identify: (userId, properties) => {
    posthogJs.identify(userId, properties);
  },
  page: () => {
    posthogJs.capture("$pageview");
  },
  track: (name, properties) => {
    posthogJs.capture(name, properties);
  },
  optIn: () => {
    if (posthogJs.has_opted_out_capturing()) {
      posthogJs.opt_in_capturing();
    }
  },
  optOut: () => {
    posthogJs.opt_out_capturing();
  },
  state: () => getHasConsentedTo("posthog"),
};

export default withQueue(posthogWithoutQueue);
