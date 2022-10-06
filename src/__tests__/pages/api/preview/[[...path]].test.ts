import handler from "../../../../pages/api/preview/[[...path]]";
import { createNextApiMocks } from "../../../__helpers__/createNextApiMocks";

const setPreviewData = jest.fn();

const createReqRes = (path?: string[], secret = "SANITY_PREVIEW_SECRET") => {
  const { req, res } = createNextApiMocks({
    query: {
      path,
      secret,
    },
  });

  res.setPreviewData = setPreviewData;

  return { req, res };
};

jest.mock("../../../../common-lib/error-reporter", () => ({
  __esModule: true,
  default: () => () => null,
}));

describe("/api/preview/[[...path]]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should set preview data", async () => {
    const { req, res } = createReqRes(["webinars", "some-webinar"]);
    await handler(req, res);

    expect(setPreviewData).toBeCalled();
  });

  it("should redirect to the desired path", async () => {
    const { req, res } = createReqRes(["webinars", "some-webinar"]);
    await handler(req, res);

    expect(res._getStatusCode()).toBe(307);
    expect(res._getRedirectUrl()).toBe("/webinars/some-webinar?");
  });

  it("should treat an undefined path as empty", async () => {
    const { req, res } = createReqRes();
    await handler(req, res);

    expect(res._getStatusCode()).toBe(307);
    expect(res._getRedirectUrl()).toBe("/?");
  });

  it("should reject an invalid path", async () => {
    const { req, res } = createReqRes(["https://", "google.com"]);
    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getRedirectUrl()).toBe("");
  });

  it("should reject an invalid preview secret", async () => {
    const { req, res } = createReqRes(
      ["https://", "google.com"],
      "invalid-secret"
    );
    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getRedirectUrl()).toBe("");
  });
});
