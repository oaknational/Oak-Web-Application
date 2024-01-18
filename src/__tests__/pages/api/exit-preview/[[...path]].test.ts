import { describe, expect, it } from "vitest";

import handler from "../../../../pages/api/exit-preview/[[...path]]";
import { createNextApiMocks } from "../../../__helpers__/createNextApiMocks";

const clearPreviewData = vi.fn();

const createReqRes = (path?: string[]) => {
  const { req, res } = createNextApiMocks({
    query: { path },
  });

  res.clearPreviewData = clearPreviewData;

  return { req, res };
};

vi.mock("../../../../common-lib/error-reporter", () => ({
  __esModule: true,
  default: () => () => null,
}));

describe("/api/exit-preview/[[...path]]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should clear preview data", async () => {
    const { req, res } = createReqRes(["webinars", "some-webinar"]);
    await handler(req, res);

    expect(clearPreviewData).toBeCalled();
  });

  it("should redirect to the desired path", async () => {
    const { req, res } = createReqRes(["webinars", "some-webinar"]);
    await handler(req, res);

    expect(res._getStatusCode()).toBe(307);
    expect(res.getHeaders()).toMatchObject({
      location: "/webinars/some-webinar",
    });
  });

  it("should treat an undefined path as empty", async () => {
    const { req, res } = createReqRes();
    await handler(req, res);

    expect(res._getStatusCode()).toBe(307);
    expect(res.getHeaders()).toMatchObject({
      location: "/",
    });
  });

  it("should reject an invalid path", async () => {
    const { req, res } = createReqRes(["https://", "google.com"]);
    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res.getHeaders().location).toBeUndefined();
  });
});
