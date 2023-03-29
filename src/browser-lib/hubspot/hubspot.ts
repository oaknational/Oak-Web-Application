/**
 * @todo use hubspot "doNotTrack" option:
 *
 * https://developers.hubspot.com/docs/api/events/cookie-banner
 */

import errorReporter from "../../common-lib/error-reporter";
import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import OakError from "../../errors/OakError";
import getHasConsentedTo from "../cookie-consent/getHasConsentedTo";
import withQueue from "../analytics/withQueue";

import startHubspot, { HubspotConfig } from "./startHubspot";

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

const loaded = () => {
  const { _hsq } = getHubspot();
  return !!(_hsq && _hsq.push !== Array.prototype.push);
};

export const hubspotWithoutQueue: AnalyticsService<HubspotConfig> = {
  name: "hubspot",
  init: (config) =>
    new Promise((resolve) => {
      startHubspot(config);
      if (loaded()) {
        resolve(null);
      } else {
        /**
         * Check if hubspot is loaded every second
         */
        const intervalId = window.setInterval(() => {
          if (loaded()) {
            window.clearInterval(intervalId);
            resolve(null);
          }
        }, 1000);
      }
    }),
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
  state: () => getHasConsentedTo("hubspot"),
};

export default withQueue(hubspotWithoutQueue);
