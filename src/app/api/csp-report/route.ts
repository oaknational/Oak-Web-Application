import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import errorReporter, { initialiseBugsnag } from "@/common-lib/error-reporter";

export async function POST(req: NextRequest) {
  initialiseBugsnag(null);
  const requestHeaders = await headers();

  const origin = requestHeaders.get("Origin");
  const expectedOrigin = process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL;

  if (!origin || !expectedOrigin || origin !== expectedOrigin) {
    console.warn(
      `CSP Report blocked: Origin mismatch. Received Origin: ${origin}, Expected Origin: ${expectedOrigin}`,
    );
    return new NextResponse(null, { status: 204 });
  }

  try {
    const reportBody = await req.json();

    console.log(`CSP Report received from trusted origin: ${origin}`);

    const reportError = errorReporter("cspViolationReport");
    reportError(reportBody);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to parse CSP report JSON:", error);
    return new NextResponse("Invalid JSON format", { status: 400 });
  }
}
