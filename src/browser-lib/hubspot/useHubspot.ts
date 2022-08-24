import { useEffect, useState } from "react";

import config from "../../config";

import hubspot from "./hubspot";

const portalId = config.get("hubspotPortalId");
const scriptDomain = config.get("hubspotScriptDomain");

type UseHubspotProps = {
  enabled: boolean;
};
const useHubspot = ({ enabled }: UseHubspotProps) => {
  const [hasAttemptedInit, setHasAttemptedInit] = useState(false);

  useEffect(() => {
    // init
    if (!hubspot.loaded() && enabled && !hasAttemptedInit) {
      hubspot.init({
        portalId,
        scriptDomain,
      });
      setHasAttemptedInit(true);
    }
  }, [enabled, hasAttemptedInit]);

  useEffect(() => {
    // do not track
    if (hubspot.loaded()) {
      if (enabled) {
        hubspot.optIn();
      } else {
        hubspot.optOut();
      }
    }
  }, [enabled]);

  return hubspot;
};

export default useHubspot;
