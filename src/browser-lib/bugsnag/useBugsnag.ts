import { useEffect } from "react";
import { Client } from "@bugsnag/js";

import { MaybeDistinctId } from "../posthog/posthog";

import { initialiseBugsnag } from "@/common-lib/error-reporter";

let bugsnagClient: Client | null = null;

export const isBugsnagInitialised = () => {
  return Boolean(bugsnagClient);
};

type UseBugsnagProps = {
  enabled: boolean;
  userId: MaybeDistinctId;
};
const useBugsnag = ({ enabled, userId }: UseBugsnagProps) => {
  useEffect(() => {
    if (enabled) {
      if (!bugsnagClient) {
        bugsnagClient = initialiseBugsnag();
      }

      /**
       * This should happen once per app load.
       */
      bugsnagClient.setUser(userId);

      // Manually start a Bugsnag session.
      bugsnagClient.startSession();
    }

    if (!enabled && bugsnagClient) {
      /**
       * errorReporter.ts is configured not to send errors if Bugsnag has not
       * been consented to
       */
      bugsnagClient.pauseSession();
    }

    return () => {
      bugsnagClient?.pauseSession();
    };
  }, [enabled, userId]);
};

export default useBugsnag;
