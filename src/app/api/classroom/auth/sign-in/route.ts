import type { NextRequest } from "next/server";

import {
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
  createClassroomErrorReporter,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("sign-in");

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const loginHint = searchParams.get("login_hint") ?? undefined;

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const response = await oakClassroomClient.getGoogleSignInUrl(loginHint);

    return Response.json({ signInUrl: response }, { status: 200 });
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);

      return Response.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return Response.json(
      {
        error: "Could not get Google Sign In link",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
