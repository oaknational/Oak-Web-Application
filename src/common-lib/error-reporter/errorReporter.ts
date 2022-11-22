import Bugsnag, { Event } from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

import config from "../../config/browser";
import { AnonymousUserId } from "../../browser-lib/analytics/useAnonymousId";
import getHasConsentedTo from "../../browser-lib/cookie-consent/getHasConsentedTo";
import isBrowser from "../../utils/isBrowser";
import OakError from "../../errors/OakError";

import { consoleError, consoleLog } from "./logging";
import bugsnagNotify, { BugsnagConfig } from "./bugsnagNotify";

/**
 * Test if a user agent matches any in a list of regex patterns.
 *
 */
export const matchesUserAgent = (ua: string) => {
  const userAgentsToMatch = [/Detectify/i, /Percy/i];
  return userAgentsToMatch.some((regex) => regex.test(ua));
};

/**
 * Generate bugsnag config.
 *
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
  userId: AnonymousUserId;
}): BugsnagConfig => {
  return {
    apiKey,
    appVersion,
    plugins: [new BugsnagPluginReact()],
    // @TODO: Add userId or anonymous id
    // user: { id: userId },
    releaseStage,
    collectUserIp: false,
    user: {
      id: userId,
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
    onError: function (event: Event) {
      const { userAgent } = event.device;
      if (userAgent) {
        // If the user agent is in the ignore list then return false.
        return !matchesUserAgent(userAgent);
      }
    },
  };
};

export const initialiseBugsnag = (userId: AnonymousUserId) => {
  const bugsnagConfig = getBugsnagConfig({
    apiKey: config.get("bugsnagApiKey"),
    appVersion: config.get("appVersion"),
    releaseStage: config.get("releaseStage"),
    userId,
  });

  // Start Bugsnag
  Bugsnag.start(bugsnagConfig);

  // Manually start a Bugsnag session.
  Bugsnag.startSession();
};

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
      `Failed to stringify maybeError, type: ${typeof maybeError}`
    );
  }
};

const errorReporter = (context: string, metadata?: Record<string, unknown>) => {
  const reportError = async (
    maybeError: OakError | Error | unknown,
    data?: ErrorData
  ) => {
    consoleError(maybeError);
    consoleLog(context, metadata, data);

    if (isBrowser) {
      const bugsnagAllowed = getHasConsentedTo("bugsnag");
      if (!bugsnagAllowed) {
        // Do not continue if user has not given consent to send data bugsnag
        return;
      }
    }
    // data argument can be null
    data = data || {};
    try {
      const err = errorify(maybeError);

      await bugsnagNotify(err, (event: Event) => {
        event.context = context;

        const originalError =
          maybeError instanceof OakError ? maybeError.originalError : undefined;

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

        if (originalError && originalError instanceof Error) {
          /**
           * Previously we were using https://github.com/sindresorhus/serialize-error
           * but jest won't run with it, or will storybook
           * @see https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#im-having-problems-with-esm-and-jest
           **/
          // event.addMetadata("Original error", serializeError(originalError));
          metaFields.originalError = originalError;
        } else {
          // If originalError is not an Error, append it to metaFields
          metaFields.originalError = originalError;
        }
        // @todo ensure metaFields are serializable otherwise data is lost
        event.addMetadata("Meta", metaFields);
      });
    } catch (bugsnagErr) {
      consoleLog("Failed to send error to bugsnag:");
      consoleError(bugsnagErr);
      consoleLog("Original error:");
      consoleError(maybeError);
    }
  };

  return reportError;
};

export default errorReporter;
