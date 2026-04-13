import { NextRequest, NextResponse } from "next/server";

import { isOakGoogleClassroomException } from "@/node-lib/google-classroom";
import { type ErrorData } from "@/common-lib/error-reporter/errorReporter";

export type AuthCredentials = { accessToken: string; session: string };

export function extractAuth(request: NextRequest): AuthCredentials | null {
  const accessToken = request.headers.get("Authorization");
  const session = request.headers.get("X-Oakgc-Session");
  return accessToken && session ? { accessToken, session } : null;
}

export function unauthorisedResponse(): NextResponse {
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 },
  );
}

type ReportErrorFn = (e: unknown, data?: ErrorData) => Promise<void> | void;

export function handleCourseWorkApiError(
  error: unknown,
  reportError: ReportErrorFn,
  fallbackMessage: string,
): NextResponse {
  if (isOakGoogleClassroomException(error)) {
    const errorObject = error.toObject();
    reportError(errorObject);
    return NextResponse.json(errorObject, { status: 400 });
  }
  reportError(error, { severity: "error" });
  return NextResponse.json(
    {
      error: fallbackMessage,
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 },
  );
}
