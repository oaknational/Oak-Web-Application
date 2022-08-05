/**
 * @todo use hubspot "doNotTrack" option:
 * https://developers.hubspot.com/docs/api/events/cookie-banner
 */

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";

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

const hubspot: AnalyticsService = {
  identify: (userId, properties) => {
    const { _hsq } = getHubspot();
    if (typeof _hsq === "undefined") {
      // @todo error no hubspot instance found
      return;
    }

    if (!properties.email) {
      // @todo error hubspot needs email to create a 'contact'
      return;
    }
    // @todo snakecase properties
    _hsq.push(["identify", { id: userId, ...properties }]);
  },
  page: () => {
    const { _hsq } = getHubspot();

    if (typeof _hsq === "undefined") {
      return;
    }
    // @todo check that path is correct

    _hsq.push(["trackPageView"]);
  },
  track: (name, properties) => {
    const { _hsq } = getHubspot();

    if (typeof _hsq === "undefined") {
      // @todo error no hubspot instance found
      return;
    }

    if ("id" in properties) {
      // @todo warn here that information is being lost
    }

    _hsq.push(["trackEvent", { id: name, ...properties }]);
  },
  optIn: () => {
    const { _hsq } = getHubspot();
    if (typeof _hsq === "undefined") {
      return;
    }
    _hsq.push(["doNotTrack", { track: true }]);
  },
  optOut: () => {
    const { _hsp, _hsq } = getHubspot();
    if (typeof _hsp === "undefined" || typeof _hsq === "undefined") {
      return;
    }
    /**
     * @see: https://developers.hubspot.com/docs/api/events/cookie-banner#remove-cookie
     */
    _hsp.push(["revokeCookieConsent"]);
    _hsq.push(["doNotTrack"]);
  },
  loaded: () => {
    const { _hsq } = getHubspot();
    return !!(_hsq && _hsq.push !== Array.prototype.push);
  },
};

export default hubspot;
