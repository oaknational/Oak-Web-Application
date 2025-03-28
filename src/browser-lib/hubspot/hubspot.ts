"use client";

/**
 * @todo use hubspot "doNotTrack" option:
 *
 * https://developers.hubspot.com/docs/api/events/cookie-banner
 */

import errorReporter from "../../common-lib/error-reporter";
import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import OakError from "../../errors/OakError";
import withQueue from "../analytics/withQueue";
import { ServicePolicyMap } from "../cookie-consent/ServicePolicyMap";
import { consentClient } from "../cookie-consent/consentClient";

import { HubspotConfig } from "./HubspotScript";

const reportError = errorReporter("hubspot.ts");
const reportNotLoadedError = () => {
  const error = new OakError({
    code: "hubspot/not-loaded",
  });
  reportError(error);
};

type HubspotFn = { push: (arg: unknown) => void } | unknown[];
type Hubspot = {
  _hsq?: HubspotFn;
  _hsp?: HubspotFn;
};
declare global {
  interface Window {
    _hsq: Hubspot["_hsq"];
    _hsp: Hubspot["_hsp"];
  }
}

const getHubspot = (): Hubspot => {
  const _hsq = window._hsq;
  const _hsp = window._hsp;

  return {
    _hsq,
    _hsp,
  };
};

export const hubspotWithoutQueue: AnalyticsService<HubspotConfig> = {
  name: "hubspot",
  /**
   * init is a noop in this case, since hubspot is loaded with the
   * <HubspotScript /> component.
   */
  init: () => Promise.resolve(null),
  identify: (userId, properties) => {
    const { _hsq } = getHubspot();
    if (typeof _hsq === "undefined") {
      return reportNotLoadedError();
    }

    if (!properties.email) {
      const error = new OakError({ code: "hubspot/identify-no-email" });
      reportError(error);
    }

    _hsq.push(["identify", { id: userId, ...properties }]);
  },
  page: (properties) => {
    const { _hsq } = getHubspot();

    if (typeof _hsq === "undefined") {
      return reportNotLoadedError();
    }

    /**
     * We call setPath here, since sometimes this page() function is queued,
     * so would be incorrectly
     */
    _hsq.push(["setPath", properties.path]);
    _hsq.push(["trackPageView"]);
  },
  track: (name, properties) => {
    const { _hsq } = getHubspot();

    if (typeof _hsq === "undefined") {
      return reportNotLoadedError();
    }

    if ("id" in properties) {
      const error = new OakError({
        code: "hubspot/lost-information",
        meta: { name, properties },
      });
      reportError(error);
    }
    _hsq.push(["trackEvent", { ...properties, id: name }]);
  },
  optIn: () => {
    const { _hsq } = getHubspot();
    if (typeof _hsq === "undefined") {
      return reportNotLoadedError();
    }
    _hsq.push(["doNotTrack", { track: true }]);
  },
  optOut: () => {
    const { _hsp, _hsq } = getHubspot();
    if (typeof _hsp === "undefined" || typeof _hsq === "undefined") {
      return reportNotLoadedError();
    }
    /**
     * @see: https://developers.hubspot.com/docs/api/events/cookie-banner#remove-cookie
     */
    _hsp.push(["revokeCookieConsent"]);
    _hsq.push(["doNotTrack"]);
  },
  state: () => {
    switch (consentClient.getConsent(ServicePolicyMap.HUBSPOT)) {
      case "denied":
        return "disabled";
      case "granted":
        return "enabled";
      default:
        return "pending";
    }
  },
};

export default withQueue(hubspotWithoutQueue);
