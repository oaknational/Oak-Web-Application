import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { codeSchema } from "@oaknational/google-classroom-addon/types";

import {
  getOakGoogleClassroomAddon,
  isOakGoogleClassroomException,
  createClassroomErrorReporter,
} from "@/node-lib/google-classroom";
import { handleNewsletterSignup } from "@/node-lib/google-classroom/handleNewsletterSignup";
import {
  getOAuthError,
  getNewsletterPreference,
  isTeacherLogin,
  parseStateParam,
  type OAuthError,
} from "@/app/api/classroom/classroomUtils";

const reportError = createClassroomErrorReporter("callback");

function oauthErrorResponse(oauthError: OAuthError) {
  return NextResponse.json(
    {
      error: "OAuth error",
      details: oauthError.error,
      description: oauthError.errorDescription,
    },
    { status: 400 },
  );
}

function missingCodeResponse(searchParams: URLSearchParams) {
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const oauthError = getOAuthError(searchParams);
    const state = parseStateParam(searchParams);
    const subscribeToNewsletter = getNewsletterPreference(state);
    const parsedCode = codeSchema.safeParse(code);

    // Check for OAuth errors from Google -
    // Redirect to 404 Error Page
    if (oauthError) {
      reportError(new Error(`OAuth error: ${oauthError.error}`), {
        severity: "warning",
        errorDescription: oauthError.errorDescription,
      });
      return oauthErrorResponse(oauthError);
    }

    if (!parsedCode.success) {
      return missingCodeResponse(searchParams);
    }

    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const onNewsletterSignup = isTeacherLogin(state)
      ? (email: string) =>
          handleNewsletterSignup(
            email,
            baseUrl,
            reportError,
            subscribeToNewsletter,
          )
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
