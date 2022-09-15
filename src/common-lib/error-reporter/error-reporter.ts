import Bugsnag, { Event, NotifiableError, OnErrorCallback } from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

import config from "../../config";
import getHasConsentedTo from "../../browser-lib/cookie-consent/getHasConsentedTo";
import isBrowser from "../../utils/isBrowser";

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
}: {
  apiKey: string;
  appVersion: string;
  releaseStage: string;
}) => {
  return {
    apiKey,
    appVersion,
    plugins: [new BugsnagPluginReact()],
    // @TODO: Add userId or anonymous id
    // user: { id: userId },
    releaseStage,
    collectUserIp: true,
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

export const initialiseBugsnag = () => {
  const bugsnagConfig = getBugsnagConfig({
    apiKey: config.get("bugsnagApiKey"),
    appVersion: config.get("appVersion"),
    releaseStage: config.get("releaseStage"),
  });

  // Start Bugsnag
  Bugsnag.start(bugsnagConfig);

  // Manually start a Bugsnag session.
  Bugsnag.startSession();
};

/**
 * Wrapping Bugsnag.notify otherwise Vercel terminates the process before error is sent
 * See: https://github.com/bugsnag/bugsnag-js/issues/1360
 */
const bugsnagNotify = (error: NotifiableError, onError: OnErrorCallback) =>
  new Promise((resolve) => Bugsnag.notify(error, onError, resolve));

export type ErrorData = Record<string, unknown> & {
  severity?: Event["severity"];
  originalError?: Error;
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
  const reportError = async (maybeError: Error | unknown, data?: ErrorData) => {
    console.error(maybeError);
    console.log(context, metadata, data);

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
        const { originalError, severity, groupingHash, ...metaFields } = {
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
      console.log("Failed to send error to bugsnag:");
      console.error(bugsnagErr);
      console.log("Original error:");
      console.error(maybeError);
    }
  };

  return reportError;
};

export default errorReporter;
