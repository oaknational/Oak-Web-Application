import {
  type ErrorContext,
  type OakGoogleClassroomExceptionLike,
  ErrorSeverity,
  ExceptionType,
} from "@oaknational/google-classroom-addon/server";

import errorReporter from "@/common-lib/error-reporter";

export type { OakGoogleClassroomExceptionLike, ErrorContext };
export { ExceptionType, ErrorSeverity };

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

/**
 * Get appropriate HTTP status code for a Google Classroom error
 */
export function getStatusCodeForClassroomError(
  error: OakGoogleClassroomExceptionLike,
): number {
  // Client errors (bad requests)
  if (error.code === "MISSING_LOGIN_HINT") return 400;

  // Server errors (OAuth failures, etc.)
  return 500;
}

export function createClassroomErrorReporter(operation: string) {
  return errorReporter(`classroom-auth-${operation}`);
}
