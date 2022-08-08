/**
 * This implementation is not zero-rated so is only temporary.
 *
 * @see: https://github.com/DavidWells/analytics/blob/master/packages/analytics-plugin-hubspot/src/browser.js
 */

import isBrowser from "../../utils/isBrowser";

if (isBrowser) {
  window._hsq = window._hsq || [];
}

function scriptAlreadyLoaded(domain: string) {
  const scripts = document.getElementsByTagName("script");
  return (
    Object.values(scripts).filter((scriptInfo) => {
      const src = scriptInfo.src || "";
      return src.match(domain);
    }).length > 0
  );
}

export type HubspotConfig = {
  portalId: string;
  scriptDomain: string;
};
const startHubspot = ({ portalId, scriptDomain }: HubspotConfig) => {
  if (!portalId) {
    throw new Error("No hubspot portalId defined");
  }

  // NoOp if hubspot already loaded by external source
  if (scriptAlreadyLoaded(scriptDomain)) {
    console.log("hubspot loaded already");

    return;
  }
  //   const protocol = document.location.protocol;
  //   const https = protocol === "https:" || protocol === "chrome-extension:";
  const bustCache = Math.floor(new Date().getTime() / 3600000);
  const scriptLink = `https://${scriptDomain}/${portalId}.js`;
  const src = `${scriptLink}?${bustCache}`;

  // Create script & append to DOM
  const script = document.createElement("script");
  script.id = "hs-script-loader";
  script.type = "text/javascript";
  script.async = true;
  // script.defer = defer
  script.src = src;

  // On next tick, inject the script
  setTimeout(() => {
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  }, 0);
};

export default startHubspot;
