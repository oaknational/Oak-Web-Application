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
      // @todo error hubspot needs email
      return;
    }
    /* send hubspot identify call */
    // const properties = formatTraits(traits, userId, defaultFormatter);
    // Identify will send with next event or page view.
    _hsq.push(["identify", properties]);
    // Fire without a hard reload or SPA routing
    // if (config.flushOnIdentify) {
    //   // Hack to flush identify call immediately.
    //   _hsq.push(["trackPageView"]);
    // }
  },
  page: () => {
    // fired on next/router "routeChangeComplete" event
    const { _hsq } = getHubspot();

    if (typeof _hsq === "undefined") {
      return;
    }
    /* ignore the first .page() call b/c hubspot tracking script already fired it */
    // if (!initialPageViewFired) {
    //   initialPageViewFired = true;
    //   return;
    // }
    // Set page path
    // _hsq.push(['setPath', payload.properties.path])
    // @todo check that path is correct
    console.log("pushing ", _hsq);

    _hsq.push(["trackPageView"]);
  },
  track: (name, properties) => {
    const { _hsq } = getHubspot();

    if (typeof _hsq === "undefined") {
      // @todo error no hubspot instance found
      return;
    }

    const formattedProperties = Object.assign({}, properties, {
      id: name,
    });
    _hsq.push(["trackEvent", formattedProperties]);
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
