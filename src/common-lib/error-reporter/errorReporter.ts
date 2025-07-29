import { Event } from "@bugsnag/js";
import * as Sentry from "@sentry/nextjs";

import isBrowser from "../../utils/isBrowser";
import OakError from "../../errors/OakError";

import bugsnagNotify from "./bugsnagNotify";

import { consentClient } from "@/browser-lib/cookie-consent/consentClient";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

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

      const originalError =
        maybeError instanceof OakError ? maybeError.originalError : undefined;

      const oakErrorMeta =
        maybeError instanceof OakError ? maybeError.meta : undefined;

      const { severity, groupingHash, ...metaFields } = {
        ...metadata,
        ...data,
      };

      metaFields.originalError = originalError;
      metaFields.oakErrorMeta = oakErrorMeta;

      if (process.env.SENTRY_ENABLED === "true") {
        Sentry.withScope((scope) => {
          scope.setTag("context", context);

          if (severity) {
            scope.setLevel(severity);
          }

          if (groupingHash) {
            scope.setFingerprint([groupingHash]);
          }

          Object.entries(metaFields).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });

          Sentry.captureException(err);
        });
      } else {
        await bugsnagNotify(err, (event: Event) => {
          setHasBeenReported(maybeError);

          event.context = context;

          if (groupingHash) {
            event.groupingHash = groupingHash;
          }

          if (severity) {
            event.severity = severity;
          }

          event.addMetadata("Meta", metaFields);
        });
      }
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
