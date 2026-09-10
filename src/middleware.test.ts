import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import middleware from "./middleware";

const mockClerkHandler = jest.fn(() => NextResponse.next());
const mockClerkMiddleware = jest.fn(() => mockClerkHandler);
jest.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: () => mockClerkMiddleware(),
}));

const mockExperimentMiddleware = jest.fn((..._args: unknown[]) =>
  NextResponse.next(),
);
jest.mock("@/utils/posthogExperiments/experimentMiddleware", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockExperimentMiddleware(...args),
}));

const buildRequest = (pathname: string) =>
  ({
    nextUrl: { pathname },
  }) as unknown as NextRequest;

const mockEvent = {} as NextFetchEvent;

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("routes the downloads/success page through experimentMiddleware", async () => {
    const req = buildRequest(
      "/teachers/programmes/maths/units/algebra/lessons/solving-equations/downloads/success",
    );

    await middleware(req, mockEvent);

    expect(mockExperimentMiddleware).toHaveBeenCalledWith({
      request: req,
      featureFlag: "download-success-header-compact",
    });
    expect(mockClerkMiddleware).not.toHaveBeenCalled();
  });

  it("does not route the variant page itself back through experimentMiddleware", async () => {
    const req = buildRequest(
      "/teachers/programmes/maths/units/algebra/lessons/solving-equations/downloads/success/variant",
    );

    await middleware(req, mockEvent);

    expect(mockExperimentMiddleware).not.toHaveBeenCalled();
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });

  it("falls back to clerkMiddleware for other routes", async () => {
    const req = buildRequest("/api/some-route");

    await middleware(req, mockEvent);

    expect(mockExperimentMiddleware).not.toHaveBeenCalled();
    expect(mockClerkMiddleware).toHaveBeenCalled();
    expect(mockClerkHandler).toHaveBeenCalledWith(req, mockEvent);
  });
});
