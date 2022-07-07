import { useEffect } from "react";
import posthog from "posthog-js";

import config from "../../config";

type UsePosthogPrpos = {
  enabled: boolean;
};
const usePosthog = ({ enabled }: UsePosthogPrpos) => {
  /**
   * @todo complain if usePosthog called more than once (or at least enure it
   * doesn't try to init again)
   */
  useEffect(() => {
    if (enabled) {
      posthog.init(config.get("posthogApiKey"), {
        api_host: config.get("posthogApiHost"),
        debug: true,
      });
    }
  }, [enabled]);

  return posthog;
};

export default usePosthog;
