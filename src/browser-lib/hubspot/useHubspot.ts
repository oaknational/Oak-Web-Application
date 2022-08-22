import { useEffect } from "react";

import config from "../../config";

import hubspot from "./hubspot";

const portalId = config.get("hubspotPortalId");
const scriptDomain = config.get("hubspotScriptDomain");

type UseHubspotProps = {
  enabled: boolean;
};
const useHubspot = ({ enabled }: UseHubspotProps) => {
  useEffect(() => {
    if (enabled) {
      hubspot.init({
        portalId,
        scriptDomain,
      });
      hubspot.optIn();
    } else {
      if (hubspot.loaded()) {
        hubspot.optOut();
      }
    }
  }, [enabled]);

  return hubspot;
};

export default useHubspot;
