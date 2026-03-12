import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
  createClassroomErrorReporter,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("sign-in");

function injectStateParam(
  signInUrl: string,
  params: Record<string, unknown>,
): string {
  const url = new URL(signInUrl);
  const existingState = url.searchParams.get("state");
  const state = existingState
    ? { ...JSON.parse(existingState), ...params }
    : params;
  url.searchParams.set("state", JSON.stringify(state));
  return url.toString();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const loginHint = searchParams.get("login_hint") ?? undefined;
    const subscribeToNewsletter =
      searchParams.get("subscribeToNewsletter") === "true";
    const isPupil = searchParams.get("is_pupil") === "true";

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const response = isPupil
      ? injectStateParam(
          await oakClassroomClient.getPupilGoogleSignInUrl(loginHint),
          { isPupil: true },
        )
      : await oakClassroomClient.getGoogleSignInUrl(
          loginHint,
          subscribeToNewsletter,
        );

    return NextResponse.json({ signInUrl: response }, { status: 200 });
  } catch (error) {
    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);

      return NextResponse.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Could not get Google Sign In link",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
