import { useEffect } from "react";

import config from "../../config";
import errorReporter from "../../common-lib/error-reporter";
import OakError from "../../errors/OakError";
import { getOakGlobals, setOakGlobals } from "../oak-globals/oakGlobals";

import posthog from "./posthog";

const apiHost = config.get("posthogApiHost");
const apiKey = config.get("posthogApiKey");

const reportError = errorReporter("usePosthog");

export type WindowOakPosthog = {
  importCount: number;
};

const importCount = (getOakGlobals().posthog?.importCount ?? 0) + 1;

setOakGlobals({
  posthog: {
    importCount,
  },
});

if (importCount > 1) {
  const message = "usePosthog should only be imported once";
  const error = new OakError({
    code: "misc/import-count",
    meta: {
      detailedMessage: message,
      importCount,
    },
  });
  reportError(error);
}

type UsePosthogProps = {
  enabled: boolean;
};
const usePosthog = ({ enabled }: UsePosthogProps) => {
  /**
   * @todo complain if usePosthog called more than once (or at least enure it
   * doesn't try to init again)
   */
  useEffect(() => {
    if (enabled) {
      posthog.init({
        apiHost,
        apiKey,
      });
      posthog.optIn();
    } else {
      posthog.optOut();
    }
  }, [enabled]);

  return posthog;
};

export default usePosthog;
