import handler from "../../../../pages/api/exit-preview/[[...path]]";
import { createNextApiMocks } from "../../../__helpers__/createNextApiMocks";

const clearPreviewData = jest.fn();

const createReqRes = (path: string[]) => {
  const { req, res } = createNextApiMocks({
    query: { path },
  });

  res.clearPreviewData = clearPreviewData;

  return { req, res };
};

jest.mock("../../../../common-lib/error-reporter", () => ({
  __esModule: true,
  default: () => () => null,
}));

describe("/api/exit-preview/[[...path]]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
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

  it("should reject an invalid path", async () => {
    const { req, res } = createReqRes(["https://", "google.com"]);
    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res.getHeaders().location).toBeUndefined();
  });
});
