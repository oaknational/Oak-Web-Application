import { NextRequest, NextResponse } from "next/server";

import {
  getClassroomAuthForVerify,
  getOakGoogleClassroomAddon,
  createClassroomErrorReporter,
  isOakGoogleClassroomException,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("verify");

export async function GET(request: NextRequest) {
  try {
    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const auth = getClassroomAuthForVerify(request);
    const accessToken = auth?.accessToken;
    const session = auth?.session;

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
        userProfilePicUrl: verifiedSession?.userProfilePicUrl,
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
