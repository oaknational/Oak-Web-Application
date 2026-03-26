/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import {
  getClassroomAuthForVerify,
  getClassroomAuthFromRequest,
} from "./getClassroomAuthFromRequest";

const mockRequest = (
  headerAuth: string | null,
  headerSession: string | null,
  cookieMap: Record<string, string>,
): NextRequest => {
  return {
    headers: {
      get: (name: string) => {
        if (name === "Authorization") return headerAuth;
        if (name.toLowerCase() === "x-oakgc-session") return headerSession;
        return null;
      },
    },
    cookies: {
      get: (name: string) => {
        const value = cookieMap[name];
        return value !== undefined ? { name, value } : undefined;
      },
    },
  } as unknown as NextRequest;
};

describe("getClassroomAuthFromRequest", () => {
  it("returns header pair when both Authorization and x-oakgc-session are set", () => {
    const req = mockRequest("token-h", "session-h", {});
    expect(getClassroomAuthFromRequest(req, "pupil")).toEqual({
      accessToken: "token-h",
      session: "session-h",
    });
  });

  it("prefers headers over cookies for pupil role", () => {
    const req = mockRequest("token-h", "session-h", {
      [AuthCookieKeys.PupilAccessToken]: "token-c",
      [AuthCookieKeys.PupilSession]: "session-c",
    });
    expect(getClassroomAuthFromRequest(req, "pupil")).toEqual({
      accessToken: "token-h",
      session: "session-h",
    });
  });

  it("uses pupil cookies when headers are incomplete", () => {
    const req = mockRequest(null, null, {
      [AuthCookieKeys.PupilAccessToken]: "ptok",
      [AuthCookieKeys.PupilSession]: "psess",
    });
    expect(getClassroomAuthFromRequest(req, "pupil")).toEqual({
      accessToken: "ptok",
      session: "psess",
    });
  });

  it("returns null for pupil when only one header is set", () => {
    const req = mockRequest("only-token", null, {});
    expect(getClassroomAuthFromRequest(req, "pupil")).toBeNull();
  });

  it("returns null for pupil when only one pupil cookie is set", () => {
    const req = mockRequest(null, null, {
      [AuthCookieKeys.PupilAccessToken]: "ptok",
    });
    expect(getClassroomAuthFromRequest(req, "pupil")).toBeNull();
  });

  it("uses teacher cookies for teacher role", () => {
    const req = mockRequest(null, null, {
      [AuthCookieKeys.AccessToken]: "ttok",
      [AuthCookieKeys.Session]: "tsess",
    });
    expect(getClassroomAuthFromRequest(req, "teacher")).toEqual({
      accessToken: "ttok",
      session: "tsess",
    });
  });
});

describe("getClassroomAuthForVerify", () => {
  it("uses teacher cookies after headers, before pupil cookies", () => {
    const req = mockRequest(null, null, {
      [AuthCookieKeys.AccessToken]: "ttok",
      [AuthCookieKeys.Session]: "tsess",
      [AuthCookieKeys.PupilAccessToken]: "ptok",
      [AuthCookieKeys.PupilSession]: "psess",
    });
    expect(getClassroomAuthForVerify(req)).toEqual({
      accessToken: "ttok",
      session: "tsess",
    });
  });

  it("uses pupil cookies when teacher pair is incomplete", () => {
    const req = mockRequest(null, null, {
      [AuthCookieKeys.Session]: "tsess",
      [AuthCookieKeys.PupilAccessToken]: "ptok",
      [AuthCookieKeys.PupilSession]: "psess",
    });
    expect(getClassroomAuthForVerify(req)).toEqual({
      accessToken: "ptok",
      session: "psess",
    });
  });

  it("returns null when no complete pair exists", () => {
    const req = mockRequest(null, null, {});
    expect(getClassroomAuthForVerify(req)).toBeNull();
  });
});
