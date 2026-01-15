import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const verifiedSession: {
      session: string;
      token: string;
      userProfilePicUrl?: string;
    } | null = await oakClassroomClient.verifyAuthSession(session, accessToken);

    const authenticated = !!verifiedSession;

    return NextResponse.json(
      {
        authenticated,
        session: verifiedSession?.session,
        token: verifiedSession?.token,
      },
      { status: authenticated ? 200 : 401 },
    );
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);
      return NextResponse.json(errorObject, { status: 401 });
    }

    reportError(error, {
      severity: "error",
    });

    return NextResponse.json(
      {
        authenticated: false,
        error: "Session verification failed",
      },
      { status: 401 },
    );
  }
}
