import { useEffect } from "react";

import config from "../../config";

import startHubspot from "./startHubspot";

const portalId = config.get("hubspotPortalId");
const scriptDomain = "js-eu1.hs-scripts.com";
// const scriptDomain = config.get("hubspotScriptDomain");

type UseHubspotProps = {
  enabled: boolean;
};
const useHubspot = ({ enabled }: UseHubspotProps) => {
  useEffect(() => {
    if (enabled) {
      startHubspot({
        portalId,
        scriptDomain,
      });
    }
  }, [enabled]);

  return {
    identify: ({ payload, config }) => {
      const { userId, traits } = payload;
      if (typeof _hsq === "undefined" || !traits.email) {
        return;
      }
      /* send hubspot identify call */
      const properties = formatTraits(traits, userId, defaultFormatter);
      // Identify will send with next event or page view.
      _hsq.push(["identify", properties]);
      // Fire without a hard reload or SPA routing
      if (config.flushOnIdentify) {
        // Hack to flush identify call immediately.
        _hsq.push(["trackPageView"]);
      }
    },
  };
};

export default useHubspot;
