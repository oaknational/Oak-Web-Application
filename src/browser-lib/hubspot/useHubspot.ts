import { useEffect } from "react";

import config from "../../config";

import startHubspot from "./startHubspot";
import hubspot from "./hubspot";

const portalId = config.get("hubspotPortalId");
const scriptDomain = config.get("hubspotScriptDomain");

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

  return hubspot;
};

export default useHubspot;
