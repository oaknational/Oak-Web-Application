import { NextRequest } from "next/server";

import { GET } from "@/app/api/preview/[[...path]]/route";

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default: () => () => null,
}));

const mockEnableDraftMode = jest.fn();
const mockDisableDraftMode = jest.fn();
jest.mock("next/headers", () => ({
  draftMode: jest.fn().mockResolvedValue({
    enable: () => mockEnableDraftMode(),
    disable: () => mockDisableDraftMode(),
  }),
}));

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(args),
}));

describe("/api/preview/[[...path]]", () => {
  let mockRequest: NextRequest;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ secret: "SANITY_PREVIEW_SECRET" }),
        pathname: "/api/preview/blog/slug",
      },
      headers: new Headers(),
    } as unknown as NextRequest;
  });

  it("should set preview data", async () => {
    await GET(mockRequest);

    expect(mockEnableDraftMode).toHaveBeenCalled();
  });

  it("should redirect to the desired path", async () => {
    await GET(mockRequest);

    expect(mockRedirect).toHaveBeenCalledWith(["/blog/slug"]);
  });

  it("should treat an undefined path as empty", async () => {
    mockRequest.nextUrl.pathname = "/api/preview";
    await GET(mockRequest);

    expect(mockRedirect).toHaveBeenCalledWith(["/"]);
  });

  it("should reject an invalid preview secret", async () => {
    mockRequest = {
      ...mockRequest,
      nextUrl: {
        ...mockRequest.nextUrl,
        searchParams: new URLSearchParams({ secret: "invalid_secret" }),
      },
    } as unknown as NextRequest;

    const res = await GET(mockRequest);

    expect(res.status).toBe(500);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should disable draft mode when the disable query param is passed", async () => {
    mockRequest = {
      ...mockRequest,
      nextUrl: {
        ...mockRequest.nextUrl,
        searchParams: new URLSearchParams({ disable: "true" }),
      },
    } as unknown as NextRequest;

    await GET(mockRequest);
    expect(mockDisableDraftMode).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith(["/blog/slug"]);
  });
});
