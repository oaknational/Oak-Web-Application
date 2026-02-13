import { NextResponse } from "next/server";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";

export function isOakError(error: unknown): error is OakError {
  return error instanceof OakError;
}

export function oakErrorToResponse(error: OakError): NextResponse {
  return NextResponse.json(
    { error: { message: error.message } },
    { status: error.config.responseStatusCode ?? 500 },
  );
}

export function createDownloadsErrorReporter(operation: string) {
  return errorReporter(`downloads-${operation}`);
}
