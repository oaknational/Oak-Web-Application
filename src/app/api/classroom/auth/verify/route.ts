import { NextRequest } from "next/server";

import {
  getOakGoogleClassroomAddon,
  createClassroomErrorReporter,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("verify");

export async function GET(request: NextRequest) {
  try {
    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const accessToken = request.headers.get("Authorization");
    const session = request.headers.get("X-Oakgc-Session");

    if (!session || !accessToken) {
      return Response.json({ authenticated: false }, { status: 401 });
    }

    const verifiedSession: { session: string; token: string } | null =
      await oakClassroomClient.verifyAuthSession(session, accessToken);

    const authenticated = !!verifiedSession;

    return Response.json(
      {
        authenticated,
        session: verifiedSession?.session,
        token: verifiedSession?.token,
      },
      { status: authenticated ? 200 : 401 },
    );
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      reportError(error, {
        severity: "error",
        code: error.code,
        type: error.type,
        context: error.context,
      });
      return Response.json(
        {
          error: error.message,
          code: error.code,
          type: error.type,
          severity: error.severity,
          shouldRetry: error.shouldRetry,
        },
        { status: 401 },
      );
    }
    reportError(error, {
      severity: "error",
    });

    return Response.json(
      {
        authenticated: false,
        error: "Session verification failed",
      },
      { status: 401 },
    );
  }
}
