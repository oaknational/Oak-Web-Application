import { useEffect } from "react";
import Bugsnag from "@bugsnag/js";

import { initialiseBugsnag } from "../../common-lib/error-reporter";
import { AnonymousUserId } from "../analytics/useAnonymousId";

export const bugsnagInitialised = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(Bugsnag._client);
};

type UseBugsnagProps = {
  enabled: boolean;
  userId: AnonymousUserId;
};
const useBugsnag = ({ enabled, userId }: UseBugsnagProps) => {
  useEffect(() => {
    // This should happen once per app load.
    if (enabled && !bugsnagInitialised()) {
      initialiseBugsnag(userId);
    }
    if (!enabled && bugsnagInitialised()) {
      /**
       * @TODO disable bugsnag here!?
       * If we can't disable bugsnag globally, we'll have to configure
       * in error-reporter to stop sending reports
       */
    }
  }, [enabled, userId]);
};

export default useBugsnag;
