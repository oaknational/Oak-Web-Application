import { NextResponse } from "next/server";
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

/**
 * Standard error response for teacher-facing Classroom API routes.
 * A 403 from Google most likely means the teacher hasn't consented to the
 * classroom.coursework.students scope — surface scope_insufficient so the
 * UI can prompt re-auth. Everything else is a 500.
 */
export function handleTeacherRouteError(e: unknown): NextResponse {
  const is403 =
    e instanceof Error && "code" in e && (e as { code: unknown }).code === 403;
  const status = is403 ? 403 : 500;
  return NextResponse.json(
    {
      error: is403
        ? "scope_insufficient"
        : e instanceof Error
          ? e.message
          : String(e),
    },
    { status },
  );
}
