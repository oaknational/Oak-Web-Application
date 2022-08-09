/**
 * @see https://www.avo.app/docs/implementation/start-using-avo-functions
 */

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import { HubspotConfig } from "../hubspot/startHubspot";
import { PosthogConfig } from "../posthog/posthog";

import { CustomDestination } from "./Avo";

type AnalyticsServices = {
  hubspot: Pick<AnalyticsService<HubspotConfig>, "identify" | "track">;
  posthog: Pick<AnalyticsService<PosthogConfig>, "identify" | "track">;
};
/**
 * getAvoBridge returns the bridge between Avo and our analytics services.
 * Namely, when we call Avo.myEvent(), logEvent() gets fired below.
 * Likewise when we call Avo.identify()
 */
const getAvoBridge = ({ hubspot, posthog }: AnalyticsServices) => {
  const logEvent: CustomDestination["logEvent"] = (
    eventName,
    eventProperties = {}
  ) => {
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
    hubspot.track(eventName, eventProperties);
    posthog.track(eventName, eventProperties);
  };

  const identify: CustomDestination["identify"] = (userId) => {
    // @todo hubspot requires email for identify call
    hubspot.identify(userId, {});
    posthog.identify(userId, {});
  };

  return {
    logEvent,
    identify,
  };
};

export default getAvoBridge;
