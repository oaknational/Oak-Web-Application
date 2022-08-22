import posthogJs from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";

export type PosthogConfig = {
  apiKey: string;
  apiHost: string;
};
const posthog: AnalyticsService<PosthogConfig> = {
  init: ({ apiKey, apiHost }) => {
    posthogJs.init(apiKey, {
      api_host: apiHost,
      debug: true,
    });
  },
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
    // posthogJs.opt_out_capturing();
  },
  loaded: () => {
    /**
     * @todo actually check if loaded
     */
    return true;
  },
};

export default posthog;
