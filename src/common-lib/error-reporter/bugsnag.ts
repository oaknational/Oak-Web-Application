import Bugsnag, { Event } from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

import {
  MaybeDistinctId,
  PosthogDistinctId,
} from "@/browser-lib/posthog/posthog";
import { BugsnagConfig } from "@/common-lib/error-reporter/bugsnagNotify";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import {
  matchesIgnoredErrorBugsnag,
  matchesUserAgent,
} from "@/common-lib/error-reporter/errorFiltering";

type Logger = Pick<typeof console, "log" | "warn" | "error">;

export function getBugsnagOnError(
  { logger }: { logger: Logger } = { logger: console },
) {
  return function bugsnagOnError(event: Event) {
    const { userAgent } = event.device;
    // Ignore errors for some user agents.
    if (userAgent) {
      // If the user agent is in the ignore list then return false.
      const shouldIgnore = matchesUserAgent(userAgent);
      if (shouldIgnore) {
        return false;
      }
    }
    // Ignore some known errors that aren't user impacting but do mess up the stability metrics.
    const firstError = event?.errors[0];
    if (firstError !== undefined) {
      const shouldIgnore = matchesIgnoredErrorBugsnag(firstError);
      if (shouldIgnore) {
        logger.warn(`Ignoring known issue: ${firstError.errorMessage}`);
        return false;
      }
    }
  };
}

/**
 * Generate bugsnag config.
 */
const getBugsnagConfig = ({
  apiKey,
  appVersion,
  releaseStage,
  userId,
}: {
  apiKey: string;
  appVersion: string;
  releaseStage: string;
  userId: MaybeDistinctId;
}): BugsnagConfig => {
  return {
    apiKey,
    appVersion,
    plugins: [new BugsnagPluginReact()],
    releaseStage,
    collectUserIp: false,
    user: {
      id: userId || undefined,
    },

    // Route notifications via our domains for zero rating.
    endpoints: {
      notify: "https://bugsnag-notify.thenational.academy",
      sessions: "https://bugsnag-sessions.thenational.academy",
    },

    /**
     * with autoTrackSessions set to true bugsnag will fire a
     * session on every page change, this is also causing it to fire
     * 2x on initial page load. It does however require we manually
     * call .startSession() below.
     */
    autoTrackSessions: false,

    /**
     * Handling onError allows us to ignore errors that meet certain criteria.
     *
     * We are using it here to prevent errors triggered by Detectify and Percy
     * from being sent to Bugsnag.
     */
    onError: getBugsnagOnError(),
  };
};

export const initialiseBugsnag = (userId: PosthogDistinctId | null) => {
  const bugsnagConfig = getBugsnagConfig({
    apiKey: getBrowserConfig("bugsnagApiKey"),
    appVersion: getBrowserConfig("appVersion"),
    releaseStage: getBrowserConfig("releaseStage"),
    userId,
  });

  // Start Bugsnag
  Bugsnag.start(bugsnagConfig);

  // Manually start a Bugsnag session.
  Bugsnag.startSession();

  return Bugsnag;
};
