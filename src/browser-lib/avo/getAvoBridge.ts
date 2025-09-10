/**
 * @see https://www.avo.app/docs/implementation/start-using-avo-functions
 */

import errorReporter from "../../common-lib/error-reporter";
import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import { PosthogConfig } from "../posthog/posthog";

import { CustomDestination } from "./Avo";

const reportError = errorReporter("getAvoBridge");

type AnalyticsServices = {
  posthog: Pick<AnalyticsService<PosthogConfig>, "track" | "identify">;
};
/**
 * getAvoBridge returns the bridge between Avo and our analytics services.
 * Namely, when we call Avo.myEvent(), logEvent() gets fired below.
 * We are only using it for named tracking events, not for page views or
 * identify calls.
 */
const getAvoBridge = ({ posthog }: AnalyticsServices) => {
  const logEvent: CustomDestination["logEvent"] = (
    eventName,
    eventProperties = {},
  ) => {
    const isObject = (
      maybeObject: unknown,
    ): maybeObject is Record<string, unknown> => {
      return (
        typeof maybeObject === "object" &&
        maybeObject !== null &&
        !Array.isArray(maybeObject)
      );
    };
    if (!isObject(eventProperties)) {
      const error = new Error(
        "Could not track event. Event properties not an object",
      );
      reportError(error, {
        severity: "warning",
        eventName,
        eventProperties,
        typeofEventProperties: typeof eventProperties,
      });
      return;
    }
    // Uncomment the below line to send track events to hubspot
    // hubspot.track(eventName, eventProperties);
    posthog.track(eventName, eventProperties);
  };

  const identify: CustomDestination["identify"] = (userId) => {
    posthog.identify(userId, {});
  };

  const setUserProperties: CustomDestination["setUserProperties"] = (
    userId,
    properties,
  ) => {
    posthog.identify(userId, properties);
  };

  return {
    logEvent,
    identify,
    setUserProperties,
  };
};

export default getAvoBridge;
