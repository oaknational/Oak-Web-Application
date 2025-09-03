import { useEffect } from "react";
import Bugsnag from "@bugsnag/js";

import { initialiseBugsnag } from "../../common-lib/error-reporter";
import { MaybeDistinctId } from "../posthog/posthog";

export const bugsnagInitialised = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(Bugsnag._client);
};

export type UseBugsnagProps = {
  enabled: boolean;
  userId: MaybeDistinctId;
};
const useBugsnag = ({ enabled, userId }: UseBugsnagProps) => {
  useEffect(() => {
    if (enabled && !bugsnagInitialised()) {
      /**
       * This should happen once per app load.
       */
      initialiseBugsnag(userId);
    }
    if (enabled && bugsnagInitialised() && userId) {
      /**
       * Sometimes userId might come through (after Posthog loads) after Bugsnag
       * has already initialised. In this case we update the Busnag session with
       * the id
       */
      Bugsnag.setUser(userId);
    }
    if (!enabled && bugsnagInitialised()) {
      /**
       * errorReporter.ts is configured not to send errors if Bugsnag has not
       * been consented to
       */
      Bugsnag.pauseSession();
    }
  }, [enabled, userId]);
};

export default useBugsnag;
