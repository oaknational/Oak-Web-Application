import posthog from "posthog-js";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";

const Posthog: AnalyticsService = {
  identify: (userId, properties) => {
    /**
     * @todo: do we want to let posthog generate the id for us?
     */
    posthog.identify(userId, properties);
  },
  page: () => {
    posthog.capture("$pageview");
  },
  track: (name, properties) => {
    posthog.capture(name, properties);
  },
  optIn: () => {
    posthog.opt_in_capturing();
  },
  optOut: () => {
    // Causing posthog to throw exception
    // posthog.opt_out_capturing();
  },
  loaded: () => {
    /**
     * @todo actually check if loaded
     */
    return true;
  },
};

export default Posthog;
