import Bugsnag, { Event } from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

import getBrowserConfig from "../../browser-lib/getBrowserConfig";
import isBrowser from "../../utils/isBrowser";
import OakError from "../../errors/OakError";
import { MaybeDistinctId } from "../../browser-lib/posthog/posthog";

import bugsnagNotify, { BugsnagConfig } from "./bugsnagNotify";

import { consentClient } from "@/browser-lib/cookie-consent/consentClient";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

/**
 * Test if a user agent matches any in a list of regex patterns.
 *
 */
export const matchesUserAgent = (ua: string) => {
  const userAgentsToMatch = [/Detectify/i, /Percy/i];
  return userAgentsToMatch.some((regex) => regex.test(ua));
};

export const matchesIgnoredError = (error: {
  errorMessage: string;
  stacktrace: { file: string }[];
}) => {
  const filesToMatch = [
    // Testing
    /OAK_TEST_ERROR_STACKTRACE_FILE/i,
    // Don't error external Hubspot script problems
    /\/\/[a-zA-Z0-9-]+\.hubspot\.com/i,
    /\/\/[a-zA-Z0-9-]+\.hsleadflows\.net/i,
  ];
  const messagesToMatch = [
    // Testing
    /Test error/i,
    // Hubspot multiple initialisation error.
    // https://github.com/oaknational/Oak-Web-Application/issues/999
    /Multiple lead flow scripts are trying to run on the current page/i,
    /t.report is not a function/i,
    /null is not an object (evaluating 'e.portalId')/i,
    /Hubspot script failed to load/i,
    //Ignored because the error is due to a video deliberately expiring on the staging data while we temporarily build the pre-release experience against staging
    /undefined is not an object (evaluating 'e.find(e=>e.startsWith("#EXT-X-TARGETDURATION")).split')/i,
  ];
  return (
    filesToMatch.some((regex) =>
      error.stacktrace.some((stacktrace) => regex.test(stacktrace.file)),
    ) || messagesToMatch.some((regex) => regex.test(error.errorMessage))
  );
};

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
      const shouldIgnore = matchesIgnoredError(firstError);
      if (shouldIgnore) {
        logger.warn(`Ignoring known issue: ${firstError.errorMessage}`);
        return false;
      }
    }
  };
}

export function initialiseBugsnag() {
  return Bugsnag.start(
    getBugsnagConfig({
      apiKey: getBrowserConfig("bugsnagApiKey"),
      appVersion: getBrowserConfig("appVersion"),
      releaseStage: getBrowserConfig("releaseStage"),
      userId: null,
    }),
  );
}

/**
 * Generate bugsnag config.
 *
 */
export function getBugsnagConfig({
  apiKey,
  appVersion,
  releaseStage,
  userId,
}: {
  apiKey: string;
  appVersion: string;
  releaseStage: string;
  userId: MaybeDistinctId;
}): BugsnagConfig {
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
}

const bugsnagConfig = getBugsnagConfig({
  apiKey: getBrowserConfig("bugsnagApiKey"),
  appVersion: getBrowserConfig("appVersion"),
  releaseStage: getBrowserConfig("releaseStage"),
  userId: null,
});
export const client = Bugsnag.start(bugsnagConfig);

export type ErrorData = Record<string, unknown> & {
  severity?: Event["severity"];
  // All errors with the same groupingHash will be grouped together in Bugsnag
  groupingHash?: string;
};

const errorify = (maybeError: unknown): Error => {
  if (maybeError instanceof Error) {
    return maybeError;
  }

  try {
    const message = JSON.stringify(maybeError);
    return new Error(message);
  } catch (jsonStringifyError) {
    return new Error(
      `Failed to stringify maybeError, type: ${typeof maybeError}`,
    );
  }
};

/**
 * Checks to see if the error has already been reported
 */
function getHasBeenReported(maybeError: unknown, depth = 0) {
  if (depth > 9) {
    return false;
  }
  depth = depth + 1;
  if (typeof maybeError === "object" && maybeError !== null) {
    if ("hasBeenReported" in maybeError) {
      return Boolean(maybeError.hasBeenReported);
    } else if ("originalError" in maybeError) {
      return getHasBeenReported(maybeError.originalError, depth);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Set hasBeenReported = true to prevent reporting the same error twice
 */
function setHasBeenReported(maybeError: unknown) {
  if (typeof maybeError === "object" && maybeError !== null) {
    if ("hasBeenReported" in maybeError) {
      maybeError.hasBeenReported = true;
    }
  }
}

type MaybeError = OakError | Error | unknown;

type Logger = Pick<typeof console, "log" | "warn" | "error">;
const errorReporter = (
  context: string,
  metadata?: Record<string, unknown>,
  { logger }: { logger: Logger } = { logger: console },
) => {
  const reportError = async (maybeError: MaybeError, data?: ErrorData) => {
    try {
      logger.error(maybeError);
      logger.log(context, metadata, data);

      if (getHasBeenReported(maybeError)) {
        logger.warn("Error already reported, aborting reportError()");
        return;
      }

      if (maybeError instanceof OakError && !maybeError.config.shouldNotify) {
        logger.log("Error should not be reported, aborting reportError()");
        logger.error(maybeError);
        return;
      }

      if (isBrowser) {
        const consentState = consentClient.getConsent(ServicePolicyMap.BUGSNAG);
        if (consentState !== "granted") {
          // Do not continue if user has not given consent to send data bugsnag
          return;
        }
      }
      // data argument can be null
      data = data || {};
      const err = errorify(maybeError);

      await bugsnagNotify(err, (event: Event) => {
        setHasBeenReported(maybeError);

        event.context = context;

        const originalError =
          maybeError instanceof OakError ? maybeError.originalError : undefined;

        const oakErrorMeta =
          maybeError instanceof OakError ? maybeError.meta : undefined;

        const { severity, groupingHash, ...metaFields } = {
          ...metadata,
          ...data,
        };

        if (groupingHash) {
          event.groupingHash = groupingHash;
        }

        if (severity) {
          event.severity = severity;
        }

        metaFields.originalError = originalError;
        metaFields.oakErrorMeta = oakErrorMeta;

        event.addMetadata("Meta", metaFields);
      });
    } catch (bugsnagErr) {
      logger.log("Failed to send error to bugsnag:");
      logger.error(bugsnagErr);
      logger.log("Original error:");
      logger.error(maybeError);
    }
  };

  return reportError;
};

export default errorReporter;
