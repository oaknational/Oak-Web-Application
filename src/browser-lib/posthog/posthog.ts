import posthogJs from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import getHasConsentedTo from "../cookie-consent/getHasConsentedTo";
import withQueue from "../analytics/withQueue";

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
        debug: true,
        loaded: () => resolve(),
      });
    }),
  identify: (userId, properties) => {
    /**
     * @todo: do we want to let posthog generate the id for us?
     */
    posthogJs.identify(userId, properties);
  },
  page: () => {
    posthogJs.capture("$pageview");
  },
  track: (name, properties) => {
    posthogJs.capture(name, properties);
  },
  optIn: () => {
    posthogJs.opt_in_capturing();
  },
  optOut: () => {
    // Causing posthog to throw exception
    posthogJs.opt_out_capturing();
  },
  state: () => getHasConsentedTo("posthog"),
};

export default withQueue(posthogWithoutQueue);
