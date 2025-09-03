import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

import { MaybeDistinctId } from "../posthog/posthog";

import { initialiseSentry } from "@/common-lib/error-reporter";

/**
 * Determine whether Sentry has been initialised by checking if there is an
 * active Sentry client.
 */
const isSentryInitialised = () => Sentry.getClient() !== undefined;

type UseSentryProps = {
  enabled: boolean;
  userId: MaybeDistinctId;
};

const useSentry = ({ enabled, userId }: UseSentryProps) => {
  useEffect(() => {
    /** Initialise Sentry if it hasn't been initialised yet. */
    if (enabled && !isSentryInitialised()) {
      initialiseSentry(userId);
    }

    /** Update the Sentry user if the user ID becomes available. */
    if (enabled && isSentryInitialised() && userId) {
      Sentry.setUser({ id: userId });
    }

    /** Terminate the Sentry session if permission is revoked. */
    if (!enabled && isSentryInitialised()) {
      Sentry.endSession();
    }
  }, [enabled, userId]);
};

export default useSentry;
export { isSentryInitialised };
