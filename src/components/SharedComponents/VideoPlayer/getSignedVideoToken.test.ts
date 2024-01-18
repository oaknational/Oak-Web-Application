import { describe, expect, it } from "vitest";

import getSignedVideoToken from "./getSignedVideoToken";

import OakError from "@/errors/OakError";

const fetch = vi.spyOn(global, "fetch") as vi.Mock;

const reportError = vi.fn();
vi.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

describe("getSignedVideoToken", () => {
  it("should throw an error if failed to fetch token ", async () => {
    fetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ res: "this" }),
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    await expect(
      async () =>
        await getSignedVideoToken(
          "https://api/signed-video-token",
          "123",
          "signed",
        ),
    ).rejects.toThrowError(new OakError({ code: "video/fetch-signed-token" }));
    expect(reportError).toBeCalled();
  });
  it("should return json is res.ok ", async () => {
    fetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ res: "this" }),
      ok: true,
      status: 404,
      statusText: "Not Found",
    });

    const result = await getSignedVideoToken(
      "https://api/signed-video-token",
      "123",
      "signed",
    );
    expect(result).toEqual({ res: "this" });
  });
});
