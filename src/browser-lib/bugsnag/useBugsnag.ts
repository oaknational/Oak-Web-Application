import { useEffect } from "react";
import Bugsnag from "@bugsnag/js";

import { initialiseBugsnag } from "../../common-lib/error-reporter";

export const bugsnagInitialised = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(Bugsnag._client);
};

type UseBugsnagProps = {
  enabled: boolean;
};
const useBugsnag = ({ enabled }: UseBugsnagProps) => {
  useEffect(() => {
    // This should happen once per app load.
    if (enabled && !bugsnagInitialised()) {
      initialiseBugsnag();
    }
    if (!enabled && bugsnagInitialised()) {
      /**
       * @TODO disable bugsnag here!?
       * If we can't disable bugsnag globally, we'll have to configure
       * in error-reporter to stop sending reports
       */
    }
  }, [enabled]);
};

export default useBugsnag;
