import { type OakGoogleClassroomExceptionLike } from "@oaknational/google-classroom-addon/server";

import errorReporter from "@/common-lib/error-reporter";

export type {
  OakGoogleClassroomExceptionLike,
  ErrorContext,
} from "@oaknational/google-classroom-addon/server";
export {
  ExceptionType,
  ErrorSeverity,
} from "@oaknational/google-classroom-addon/server";

/**
 * Type guard to check if an error is an OakGoogleClassroomException
 */
export function isOakGoogleClassroomException(
  error: unknown,
): error is OakGoogleClassroomExceptionLike {
  return (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "OakGoogleClassroomException" &&
    "type" in error &&
    "severity" in error &&
    "shouldRetry" in error
  );
}

export function createClassroomErrorReporter(operation: string) {
  return errorReporter(`classroom-auth-${operation}`);
}
