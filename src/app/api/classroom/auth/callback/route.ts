import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { codeSchema } from "@oaknational/google-classroom-addon/types";

import {
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
  createClassroomErrorReporter,
} from "@/node-lib/google-classroom";
import { handleNewsletterSignup } from "@/node-lib/google-classroom/handleNewsletterSignup";

const reportError = createClassroomErrorReporter("callback");

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const stateParam = searchParams.get("state");
    let subscribeToNewsletter = false;
    if (stateParam) {
      try {
        const parsed = JSON.parse(stateParam);
        subscribeToNewsletter = parsed.subscribeToNewsletter === true;
      } catch {
        // ignore
      }
    }
    const parsedCode = codeSchema.safeParse(code);

    // Check for OAuth errors from Google -
    // Redirect to 404 Error Page
    if (error) {
      reportError(new Error(`OAuth error: ${error}`), {
        severity: "warning",
        errorDescription,
      });
      return NextResponse.json(
        {
          error: "OAuth error",
          details: error,
          description: errorDescription,
        },
        { status: 400 },
      );
    }

    if (!parsedCode.success) {
      reportError(new Error("OAuth callback missing authorization code"), {
        severity: "error",
        searchParams: Object.fromEntries(searchParams.entries()),
      });

      return NextResponse.json(
        {
          error: "Authentication failed",
          details:
            "Missing authorization code from Google. Please try signing in again.",
        },
        { status: 400 },
      );
    }

    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const onNewsletterSignup = subscribeToNewsletter
      ? (email: string) => handleNewsletterSignup(email, baseUrl, reportError)
      : undefined;

    const oakClassroomClient = getOakGoogleClassroomAddon(request);
    const { encryptedSession, accessToken } =
      await oakClassroomClient.handleGoogleSignInCallback(
        parsedCode.data,
        onNewsletterSignup,
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
      return NextResponse.json(errorObject, { status: 400 });
    }

    reportError(error, { severity: "error" });
    return NextResponse.json(
      {
        error: "Failed to process OAuth callback",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
