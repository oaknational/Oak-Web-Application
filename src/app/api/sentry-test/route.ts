import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

import errorReporter from "@/common-lib/error-reporter/errorReporter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (
    request.headers.get("x-sentry-test-secret") !==
    "5deee945-2813-4e25-a227-5bcabe3dd6b8"
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // Only permit testing in preview deployments.
  if (process.env.VERCEL_ENV !== "preview") {
    return new NextResponse(null, { status: 404 });
  }

  const error = new Error("OWA Sentry integration test");

  await errorReporter("sentry-integration-test", {
    source: "temporary-test-endpoint",
  })(error);

  // Allow the SDK to deliver the event before the function exits.
  const flushed = await Sentry.flush(5000);

  return NextResponse.json({
    message: "Test exception submitted",
    sentryInitialised: Boolean(Sentry.getClient()),
    flushed,
  });
}
