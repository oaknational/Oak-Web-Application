import { useEffect } from "react";

import config from "../../config";

import startGleap from "./startGleap";

const apiKey = config.get("gleapApiKey");
const apiUrl = config.get("gleapApiUrl");
const widgetUrl = config.get("gleapWidgetUrl");

type UseGleapProps = {
  enabled: boolean;
};

/**
 * If enabled, loads Gleap widget. If disabled unloads Gleap widget.
 */
const useGleap = ({ enabled }: UseGleapProps) => {
  useEffect(() => {
    const shouldStartGleap = enabled && !("Gleap" in window);
    const shouldStopGleap = !enabled && "Gleap" in window;

    if (shouldStopGleap) {
      /**
       * Currently the only way we can properly clear gleap from the browser
       * (whilst allowing the user to re-enable it)
       * @todo check that this doesn't blow up when confirmic policies are updated
       */
      window.location.reload();
    }
    if (shouldStartGleap) {
      startGleap({ apiKey, widgetUrl, apiUrl });
    }
  }, [enabled]);
};

export default useGleap;
