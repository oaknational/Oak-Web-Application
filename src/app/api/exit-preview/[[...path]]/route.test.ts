import { NextRequest } from "next/server";

import { GET } from "./route";

const mockDisableDraftMode = jest.fn();
jest.mock("next/headers", () => ({
  draftMode: jest
    .fn()
    .mockResolvedValue({ disable: () => mockDisableDraftMode() }),
}));

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(args),
}));

describe("/api/exit-preview/[[...path]]", () => {
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

  it("should clear preview data", async () => {
    await GET(mockRequest);

    expect(mockDisableDraftMode).toHaveBeenCalled();
  });

  // it("should redirect to the desired path", async () => {
  //   await handler();

  //   expect(res._getStatusCode()).toBe(307);
  //   expect(res.getHeaders()).toMatchObject({
  //     location: "/webinars/some-webinar",
  //   });
  // });

  // it("should treat an undefined path as empty", async () => {
  //   const {  } = createReqRes();
  //   await handler();

  //   expect(res._getStatusCode()).toBe(307);
  //   expect(res.getHeaders()).toMatchObject({
  //     location: "/",
  //   });
  // });

  // it("should reject an invalid path", async () => {
  //   const {  } = createReqRes(["https://", "google.com"]);
  //   await handler();

  //   expect(res._getStatusCode()).toBe(500);
  //   expect(res.getHeaders().location).toBeUndefined();
  // });
});
