/**
 * @see https://www.avo.app/docs/implementation/start-using-avo-functions
 */
import { PostHog as PostHogNode } from "posthog-node";

import errorReporter from "../../common-lib/error-reporter";
import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import { PosthogConfig } from "../posthog/posthog";

import { CustomDestination } from "./Avo";

const reportError = errorReporter("getAvoBridge");

type AnalyticsServices = {
  posthog:
    | Pick<AnalyticsService<PosthogConfig>, "track" | "identify">
    | PostHogNode;
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

    if (posthog instanceof PostHogNode) {
      posthog.capture({
        distinctId: (eventProperties.userId as string) || "anonymous",
        event: eventName,
        properties: eventProperties,
      });
    } else {
      posthog.track(eventName, eventProperties);
    }
  };

  const identify: CustomDestination["identify"] = (userId) => {
    if (posthog instanceof PostHogNode) {
      posthog.identify({
        distinctId: userId,
        properties: {},
      });
    } else {
      posthog.identify(userId, {});
    }
  };

  const setUserProperties: CustomDestination["setUserProperties"] = (
    userId,
    properties,
  ) => {
    if (posthog instanceof PostHogNode) {
      posthog.identify({
        distinctId: userId,
        properties: properties || {},
      });
    } else {
      posthog.identify(userId, properties);
    }
  };

  return {
    logEvent,
    identify,
    setUserProperties,
  };
};

export default getAvoBridge;
