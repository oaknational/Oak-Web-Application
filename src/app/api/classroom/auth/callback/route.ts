import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";

import {
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
  createClassroomErrorReporter,
} from "@/node-lib/google-classroom";

const reportError = createClassroomErrorReporter("callback");

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const subscribeToNewsletter = searchParams.get("subscribeToNewsletter");

    // Check for OAuth errors from Google -
    //Redirect to 404 Error Page
    if (error) {
      reportError(new Error(`OAuth error: ${error}`), {
        severity: "warning",
        errorDescription,
      });

      return Response.json(
        {
          error: "OAuth error",
          details: error,
          description: errorDescription,
        },
        { status: 400 },
      );
    }

    if (!code) {
      reportError(new Error("OAuth callback missing authorization code"), {
        severity: "error",
        searchParams: Object.fromEntries(searchParams.entries()),
      });

      return Response.json(
        {
          error: "Authentication failed",
          details:
            "Missing authorization code from Google. Please try signing in again.",
        },
        { status: 400 },
      );
    }

    const tempSignUpToNewsletter = async (email: string) => {
      // todo: this is temp until we have actual mailing list to subscribe to
      console.log("should subscribe to newsletter", email);
    };

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const { encryptedSession, accessToken } =
      await oakClassroomClient.handleGoogleSignInCallback(
        code,
        subscribeToNewsletter === "true" ? tempSignUpToNewsletter : undefined,
      );

    return redirect(
      `/classroom/auth/success?s=${encodeURIComponent(encryptedSession)}&at=${accessToken}`,
    );
  } catch (error) {
    // Next.js redirect() throws a special error to trigger redirects, error needs to be re-thrown to handle redirect.
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    if (isOakGoogleClassroomException(error)) {
      const errorObject = error.toObject();
      reportError(errorObject);
      return Response.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return Response.json(
      {
        error: "Failed to process OAuth callback",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
