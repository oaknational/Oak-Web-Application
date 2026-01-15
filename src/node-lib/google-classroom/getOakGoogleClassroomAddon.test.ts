import { OakGoogleClassroomAddOn } from "@oaknational/google-classroom-addon/server";

import { getOakGoogleClassroomAddon } from "./getOakGoogleClassroomAddon";

import { getPupilFirestore } from "@/node-lib/firestore";

jest.mock("@oaknational/google-classroom-addon/server", () => ({
  OakGoogleClassroomAddOn: jest.fn(),
}));

jest.mock("@/node-lib/firestore", () => ({
  getPupilFirestore: jest.fn(),
}));

describe("getOakGoogleClassroomAddon", () => {
  const env = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_CLASSROOM_ENCRYPTION_SECRET = "enc";
    process.env.GOOGLE_CLASSROOM_OAUTH_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLASSROOM_OAUTH_CLIENT_SECRET = "client-secret";
    process.env.GOOGLE_CLASSROOM_SESSION_SECRET = "session-secret";
  });

  afterAll(() => {
    process.env = env;
  });

  const buildMockRequest = (headers: Record<string, string>): MockRequest => {
    const headersObj = new Headers();
    Object.entries(headers).forEach(([key, value]) =>
      headersObj.set(key, value),
    );
    return {
      headers: {
        get: (key: string) => headersObj.get(key),
      },
    };
  };

  it("instantiates the add-on with derived base URL", () => {
    (getPupilFirestore as jest.Mock).mockReturnValue("firestore");

    const req = buildMockRequest({
      host: "app.test",
      "x-forwarded-proto": "http",
    });

    getOakGoogleClassroomAddon(req as never);

    expect(OakGoogleClassroomAddOn).toHaveBeenCalledWith(
      "enc",
      "firestore",
      "client-id",
      "client-secret",
      "http://app.test/api/classroom/auth/callback",
      "session-secret",
      "http://app.test",
    );
  });

  it("throws when any env var missing", () => {
    delete process.env.GOOGLE_CLASSROOM_SESSION_SECRET;
    const req = buildMockRequest({ host: "app.test" });

    expect(() => getOakGoogleClassroomAddon(req as never)).toThrow(
      "OakGoogleClassroomAddOn is missing required environment variables",
    );
  });
});

type MockRequest = {
  headers: Pick<Headers, "get">;
};
