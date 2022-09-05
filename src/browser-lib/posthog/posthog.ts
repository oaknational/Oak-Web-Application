import posthogJs from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import getHasConsentedTo from "../cookie-consent/getHasConsentedTo";
import withQueue from "../analytics/withQueue";

export type PosthogConfig = {
  apiKey: string;
  apiHost: string;
};

const log = (...m: unknown[]) => console.log("posthog:", ...m);

export const posthogWithoutQueue: AnalyticsService<PosthogConfig> = {
  name: "posthog",
  init: ({ apiKey, apiHost }) =>
    new Promise((resolve) => {
      log("init");
      posthogJs.init(apiKey, {
        api_host: apiHost,
        debug: true,
        loaded: () => resolve(),
      });
    }),
  identify: (userId, properties) => {
    log("identify", userId, properties);
    posthogJs.identify(userId, properties);
  },
  page: () => {
    log("page");
    posthogJs.capture("$pageview");
  },
  track: (name, properties) => {
    log("track", name, properties);
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
