import { NextRequest, NextResponse } from "next/server";

import experimentMiddleware from "./experimentMiddleware";
import { getExperimentCookieKey } from "./cookieHelpers";

import getServerConfig from "@/node-lib/getServerConfig";

const mockReportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default: jest.fn(() => mockReportError),
}));

const mockFetch = jest.spyOn(globalThis, "fetch") as jest.Mock;
const mockJsonResponse = (data: unknown, status = 200) => {
  const statusText = status === 200 ? "OK" : "Error";
  const response = new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: {
      "Content-Type": "application/json",
    },
  });
  mockFetch.mockResolvedValue(response);
};

const featureFlag = "test";
const posthogApiKey = getServerConfig("posthogApiKey");

const cookieStore: Record<string, { value: string }> = {
  [`ph_${posthogApiKey}_posthog`]: {
    value: JSON.stringify({ distinct_id: "testId" }),
  },
  oak_consent: {
    value: JSON.stringify({
      policies: [{ slug: "statistics", state: "granted" }],
    }),
  },
};

const mockGetCookies = jest.fn((key) => cookieStore[key]);

const mockRequest = {
  cookies: {
    get: (key: string) => mockGetCookies(key),
  },
  nextUrl: { pathname: "http://test-path" },
} as unknown as NextRequest;

const getExperimentCookieValue = (res: NextResponse) => {
  const cookieKey = getExperimentCookieKey(featureFlag);
  return res.cookies.get(cookieKey)?.value;
};

describe("experimentMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockJsonResponse({ featureFlags: { [featureFlag]: "control" } });
  });
  it("returns the correct response when variant is control", async () => {
    const response = await experimentMiddleware({
      request: mockRequest,
      featureFlag,
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const experimentCookie = getExperimentCookieValue(response);
    expect(experimentCookie).toEqual("control");

    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });
  it("returns the correct response when variant is test", async () => {
    mockJsonResponse({ featureFlags: { [featureFlag]: "test" } });
    const response = await experimentMiddleware({
      request: mockRequest,
      featureFlag,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const experimentCookie = getExperimentCookieValue(response);
    expect(experimentCookie).toEqual("test");

    expect(response.headers.get("x-middleware-rewrite")).toEqual(
      "http://test-path/variant",
    );
  });
  it("reports an error", async () => {
    mockJsonResponse({}, 500);
    const response = await experimentMiddleware({
      request: mockRequest,
      featureFlag,
    });

    expect(mockReportError).toHaveBeenCalled();
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });
  it("reads experiment group from cookie and does not make request to posthog", async () => {
    cookieStore[getExperimentCookieKey(featureFlag)] = { value: "test" };
    const response = await experimentMiddleware({
      request: mockRequest,
      featureFlag,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    expect(mockFetch).not.toHaveBeenCalled();
  });
  it("does not set a cookie when consent is not granted", async () => {
    cookieStore["oak_consent"] = {
      value: JSON.stringify({
        policies: [{ slug: "statistics", state: "gdeniedd" }],
      }),
    };
    const response = await experimentMiddleware({
      request: mockRequest,
      featureFlag,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const experimentCookie = getExperimentCookieValue(response);
    expect(experimentCookie).toBeUndefined();
  });
});
