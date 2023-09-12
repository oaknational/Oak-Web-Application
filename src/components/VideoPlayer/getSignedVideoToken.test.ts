import OakError from "../../errors/OakError";

import getSignedVideoToken from "./getSignedVideoToken";

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

const reportError = jest.fn();
jest.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

describe("getSignedVideoToken", () => {
  test("should throw an error if failed to fetch token ", async () => {
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ res: "this" }),
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
  test("should return json is res.ok ", async () => {
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ res: "this" }),
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
