import { NextRequest, NextResponse } from "next/server";

import { isOakGoogleClassroomException } from "@/node-lib/google-classroom";

export type OAuthError = {
  error: string;
  errorDescription?: string | null;
};

export type OAuthState = {
  subscribeToNewsletter?: boolean;
  isPupil?: boolean;
};

export function getOAuthError(
  searchParams: URLSearchParams,
): OAuthError | null {
  const error = searchParams.get("error");
  if (!error) return null;
  return { error, errorDescription: searchParams.get("error_description") };
}

export function parseStateParam(searchParams: URLSearchParams): OAuthState {
  const stateParam = searchParams.get("state");
  if (!stateParam) return {};
  try {
    return JSON.parse(stateParam) as OAuthState;
  } catch {
    return {};
  }
}

export function getNewsletterPreference(state: OAuthState): boolean {
  return state.subscribeToNewsletter === true;
}

export function isTeacherLogin(state: OAuthState): boolean {
  return state.isPupil !== true;
}

export function handleClassroomError(
  reportError: (e: unknown) => void,
  e: unknown,
): NextResponse {
  const errorObject = isOakGoogleClassroomException(e) ? e.toObject() : e;
  reportError(errorObject);
  return NextResponse.json(
    { error: e instanceof Error ? e.message : String(e) },
    { status: 500 },
  );
}

export function requireClassroomAuthHeaders(
  request: NextRequest,
): { accessToken: string; session: string } | NextResponse {
  const accessToken = request.headers.get("Authorization");
  const session = request.headers.get("x-oakgc-session");

  if (!session || !accessToken) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }

  return { accessToken, session };
}
