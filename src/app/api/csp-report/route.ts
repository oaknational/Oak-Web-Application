import { NextRequest, NextResponse } from "next/server";

import errorReporter, { initialiseBugsnag } from "@/common-lib/error-reporter";

export async function POST(req: NextRequest) {
  initialiseBugsnag(null);
  try {
    const reportBody = await req.json();

    const reportError = errorReporter("cspViolationReport");
    reportError(reportBody);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to parse CSP report JSON:", error);
    return new NextResponse("Invalid JSON format", { status: 400 });
  }
}
