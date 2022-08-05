/**
 * @see https://www.avo.app/docs/implementation/start-using-avo-functions
 */

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";

import { CustomDestination } from "./Avo";

type AnalyticsServices = {
  hubspot: AnalyticsService;
  posthog: AnalyticsService;
};
const getAnalyticsSDKBridge = ({
  hubspot,
  posthog,
}: AnalyticsServices): CustomDestination => ({
  logEvent: (eventName, eventProperties = {}) => {
    const isObject = (
      maybeObject: unknown
    ): maybeObject is Record<string, unknown> => {
      return (
        typeof maybeObject === "object" &&
        maybeObject !== null &&
        !Array.isArray(maybeObject)
      );
    };
    if (!isObject(eventProperties)) {
      // @todo reportError warning here
      return;
    }
    console.log("avo.logEvent", { eventName, eventProperties });
    hubspot.track(eventName, eventProperties);
    posthog.track(eventName, eventProperties);
  },
  identify: (userId) => {
    console.log("avo.identify", { userId });
    // @todo hubspot requires email for identify call
    hubspot.identify(userId, {});
    posthog.identify(userId, {});
  },
});

export default getAnalyticsSDKBridge;
