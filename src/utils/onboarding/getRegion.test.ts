import { getRegion } from "@/utils/onboarding/getRegion";
import OakError from "@/errors/OakError";

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

// @ts-expect-error - region is overwritten in development
process.env.NODE_ENV = "production";

describe("getRegion", () => {
  it("should return the region from the request header", () => {
    const req = new Request("http://example.com", {
      method: "POST",
      headers: {
        "x-vercel-ip-country": "US",
      },
    });

    const region = getRegion(req, "123", "testRoute");
    expect(region).toBe("US");
  });

  it("should return undefined if no region is found in the request header", () => {
    const req = new Request("http://example.com");

    const region = getRegion(req, "123", "testRoute");
    expect(region).toBeUndefined();
  });

  it("should report error if no region is found", () => {
    const req = new Request("http://example.com");

    getRegion(req, "123", "testRoute");

    expect(reportError).toHaveBeenCalledWith(
      new OakError({
        code: "onboarding/request-error",
        meta: {
          message:
            "Region header not found in header: x-vercel-ip-country or developmentUserRegion",
          user: "123",
        },
      }),
      {
        message: "Region header not found",
      },
    );
  });
});
