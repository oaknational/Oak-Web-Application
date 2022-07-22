import { useEffect } from "react";

import startGleap from "./startGleap";

const widgetUrl = "https://feedback-widget.thenational.academy";
const apiUrl = "https://feedback-api.thenational.academy";
const widgetId = "SAlYMttkyMt51GRHLul4GYU8TCC5EXjs";

type UseGleapProps = {
  enabled: boolean;
};

console.log(startGleap);

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
      startGleap({ widgetId, widgetUrl, apiUrl });
    }
  }, [enabled]);
};

export default useGleap;
