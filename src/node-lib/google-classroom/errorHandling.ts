import { OakGoogleClassroomException } from "@oaknational/google-classroom-addon/server";

import errorReporter from "@/common-lib/error-reporter";

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
  return errorReporter(`classroom-auth-${operation}`);
}
