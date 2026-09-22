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

  it("falls back to clerkMiddleware for other routes", async () => {
    const req = buildRequest("/api/some-route");

    await middleware(req, mockEvent);

    expect(mockExperimentMiddleware).not.toHaveBeenCalled();
    expect(mockClerkMiddleware).toHaveBeenCalled();
    expect(mockClerkHandler).toHaveBeenCalledWith(req, mockEvent);
  });
});
