/**
 * @see https://www.avo.app/docs/implementation/start-using-avo-functions
 * Node.js version of getAvoBridge for server-side usage
 */
import { PostHog as PostHogNode } from "posthog-node";

import errorReporter from "../../common-lib/error-reporter";
import { CustomDestination } from "../../browser-lib/avo/Avo";

const reportError = errorReporter("getAvoBridge");

type AnalyticsServices = {
  posthog: PostHogNode;
};

/**
 * getAvoBridge returns the bridge between Avo and our analytics services for Node.js.
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

    posthog.capture({
      distinctId: (eventProperties.user_id as string) || "anonymous",
      event: eventName,
      properties: eventProperties,
    });
  };

  const identify: CustomDestination["identify"] = (userId) => {
    posthog.identify({
      distinctId: userId,
      properties: {},
    });
  };

  const setUserProperties: CustomDestination["setUserProperties"] = (
    userId,
    properties,
  ) => {
    posthog.identify({
      distinctId: userId,
      properties: properties || {},
    });
  };

  return {
    logEvent,
    identify,
    setUserProperties,
  };
};

export default getAvoBridge;
