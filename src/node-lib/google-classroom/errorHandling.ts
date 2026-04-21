import { OakGoogleClassroomException } from "@oaknational/google-classroom-addon/server";
import Bugsnag from "@bugsnag/js";

import errorReporter, {
  initialiseBugsnag,
  initialiseSentry,
} from "@/common-lib/error-reporter";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export type { ErrorContext } from "@oaknational/google-classroom-addon/server";
export {
  ExceptionType,
  ErrorSeverity,
} from "@oaknational/google-classroom-addon/server";

/**
 * Type guard to check if an error is an OakGoogleClassroomException
 */
export function isOakGoogleClassroomException(
  error: unknown,
): error is OakGoogleClassroomException {
  return error instanceof OakGoogleClassroomException;
}

export function createClassroomErrorReporter(operation: string) {
  if (getBrowserConfig("sentryEnabled") === "true") {
    initialiseSentry(null);
  } else {
    if (!Bugsnag.isStarted()) {
      initialiseBugsnag(null);
    }
  }
  return errorReporter(`classroom-auth-${operation}`);
}
