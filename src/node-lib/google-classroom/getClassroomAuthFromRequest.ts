import type { NextRequest } from "next/server";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

type AuthPair = {
  accessToken: string;
  session: string;
};

const getPairFromHeaders = (request: NextRequest): AuthPair | null => {
  const accessToken = request.headers.get("Authorization");
  const session = request.headers.get("x-oakgc-session");
  if (accessToken && session) {
    return { accessToken, session };
  }
  return null;
};

const getPairFromCookies = (
  request: NextRequest,
  tokenCookieName: string,
  sessionCookieName: string,
): AuthPair | null => {
  const accessToken = request.cookies?.get(tokenCookieName)?.value;
  const session = request.cookies?.get(sessionCookieName)?.value;
  if (accessToken && session) {
    return { accessToken, session };
  }
  return null;
};

/**
 * Resolves Google Classroom auth from duplicated headers (Cookie Store clients)
 * or from auth cookies when headers are absent (e.g. iOS WebKit without cookieStore).
 */
export function getClassroomAuthFromRequest(
  request: NextRequest,
  role: "pupil" | "teacher",
): AuthPair | null {
  const fromHeaders = getPairFromHeaders(request);
  if (fromHeaders) {
    return fromHeaders;
  }

  if (role === "pupil") {
    return getPairFromCookies(
      request,
      AuthCookieKeys.PupilAccessToken,
      AuthCookieKeys.PupilSession,
    );
  }

  return getPairFromCookies(
    request,
    AuthCookieKeys.AccessToken,
    AuthCookieKeys.Session,
  );
}

/**
 * Same as header+cookie resolution for `/api/classroom/auth/verify`, which may be
 * called for either teacher or pupil sessions.
 */
export function getClassroomAuthForVerify(
  request: NextRequest,
): AuthPair | null {
  const fromHeaders = getPairFromHeaders(request);
  if (fromHeaders) {
    return fromHeaders;
  }

  const teacher = getPairFromCookies(
    request,
    AuthCookieKeys.AccessToken,
    AuthCookieKeys.Session,
  );
  if (teacher) {
    return teacher;
  }

  return getPairFromCookies(
    request,
    AuthCookieKeys.PupilAccessToken,
    AuthCookieKeys.PupilSession,
  );
}
