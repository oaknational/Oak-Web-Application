"use client";

import { useEffect } from "react";

import getBrowserConfig from "../getBrowserConfig";

import startGleap, { hasLoaded } from "./startGleap";

const apiKey = getBrowserConfig("gleapApiKey");
const apiUrl = getBrowserConfig("gleapApiUrl");
const frameUrl = getBrowserConfig("gleapFrameUrl");

type UseGleapProps = {
  enabled: boolean;
};

/**
 * If enabled, loads Gleap widget. If disabled unloads Gleap widget.
 */
const useGleap = ({ enabled }: UseGleapProps) => {
  useEffect(() => {
    const shouldStartGleap = enabled && !hasLoaded();
    const shouldStopGleap = !enabled && hasLoaded();

    if (shouldStopGleap) {
      /**
       * Currently the only way we can properly clear gleap from the browser
       * (whilst allowing the user to re-enable it)
       * @todo check that this doesn't blow up when confirmic policies are updated
       */
      window.location.reload();
    }
    if (shouldStartGleap) {
      startGleap({ apiKey, frameUrl, apiUrl });
    }
  }, [enabled]);
};

export default useGleap;
