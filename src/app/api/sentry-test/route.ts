import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

import errorReporter from "@/common-lib/error-reporter/errorReporter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return new NextResponse(null, { status: 404 });
  }

  await errorReporter("sentry-integration-test", {
    source: "temporary-test-endpoint",
  })(new Error("OWA Sentry integration test"));

  const flushed = await Sentry.flush(5000);

  return NextResponse.json({
    message: "Test exception submitted",
    sentryInitialised: Boolean(Sentry.getClient()),
    flushed,
  });
}
